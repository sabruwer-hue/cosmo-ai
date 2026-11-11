import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: cors });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);

  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  if (!/^[a-f0-9]{32}$/i.test(token)) return json({ error: "Invalid product link" }, 400);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return json({ error: "Product information service is not configured" }, 503);

  const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  const { data: qr, error: qrError } = await db.from("cosmo_retail_qr_codes")
    .select("id,owner_id,product_id").eq("public_token", token).eq("active", true).maybeSingle();
  if (qrError || !qr) return json({ error: "This product information link is unavailable" }, 404);

  const { data: product, error: productError } = await db.from("cosmo_retail_products")
    .select("id,owner_id,store_id,product_code,name,description,image_path,price_cents,compare_at_price_cents,currency,stock_on_hand,reorder_level,active")
    .eq("id", qr.product_id).eq("owner_id", qr.owner_id).eq("active", true).maybeSingle();
  if (productError || !product) return json({ error: "This product is no longer available" }, 404);

  const { data: store } = await db.from("cosmo_retail_stores")
    .select("name").eq("id", product.store_id).eq("owner_id", product.owner_id).maybeSingle();

  const now = new Date();
  const nowIso = now.toISOString();
  const today = nowIso.slice(0, 10);

  const [productPromo, storePromo, expiryBatch, restockItems] = await Promise.all([
    db.from("cosmo_retail_promotions").select("title,description,special_price_cents,starts_at,ends_at")
      .eq("owner_id", product.owner_id).eq("product_id", product.id).eq("active", true)
      .lte("starts_at", nowIso).gt("ends_at", nowIso).order("ends_at", { ascending: true }).limit(1).maybeSingle(),
    db.from("cosmo_retail_promotions").select("title,description,special_price_cents,starts_at,ends_at")
      .eq("owner_id", product.owner_id).eq("store_id", product.store_id).is("product_id", null).eq("active", true)
      .lte("starts_at", nowIso).gt("ends_at", nowIso).order("ends_at", { ascending: true }).limit(1).maybeSingle(),
    db.from("cosmo_retail_product_batches").select("expiry_date,quantity_remaining")
      .eq("owner_id", product.owner_id).eq("product_id", product.id).gt("quantity_remaining", 0)
      .not("expiry_date", "is", null).gte("expiry_date", today).order("expiry_date", { ascending: true }).limit(1).maybeSingle(),
    db.from("cosmo_retail_restock_items").select("restock_order_id,quantity_ordered,quantity_received")
      .eq("owner_id", product.owner_id).eq("product_id", product.id).limit(20)
  ]);

  let nextRestock: { expected_delivery_at: string | null; quantity: number } | null = null;
  const items = restockItems.data ?? [];
  if (items.length) {
    const ids = [...new Set(items.map((item: any) => item.restock_order_id))];
    const { data: orders } = await db.from("cosmo_retail_restock_orders")
      .select("id,status,expected_delivery_at").eq("owner_id", product.owner_id)
      .in("id", ids).in("status", ["submitted", "confirmed", "partially_received"])
      .not("expected_delivery_at", "is", null);
    const incoming = items.map((item: any) => {
      const order = (orders ?? []).find((candidate: any) => candidate.id === item.restock_order_id);
      if (!order) return null;
      return { date: order.expected_delivery_at, quantity: Math.max(0, Number(item.quantity_ordered) - Number(item.quantity_received)) };
    }).filter((entry: any) => entry && entry.quantity > 0)
      .sort((a: any, b: any) => String(a.date).localeCompare(String(b.date)));
    if (incoming.length) nextRestock = { expected_delivery_at: incoming[0].date, quantity: incoming[0].quantity };
  }

  let imageUrl: string | null = null;
  if (product.image_path) {
    const { data } = await db.storage.from("cosmo-retail-product-images").createSignedUrl(product.image_path, 3600);
    imageUrl = data?.signedUrl ?? null;
  }

  await db.from("cosmo_retail_qr_scans").insert({
    owner_id: product.owner_id,
    qr_code_id: qr.id,
    source: "public_product_hub",
    user_agent: (req.headers.get("user-agent") ?? "").slice(0, 500)
  });

  const promotion = productPromo.data ?? storePromo.data ?? null;
  return json({
    product: {
      code: product.product_code,
      name: product.name,
      description: product.description,
      image_url: imageUrl,
      price_cents: product.price_cents,
      compare_at_price_cents: product.compare_at_price_cents,
      currency: product.currency,
      stock_on_hand: product.stock_on_hand,
      low_stock: Number(product.stock_on_hand) <= Number(product.reorder_level),
      reorder_level: product.reorder_level
    },
    store: { name: store?.name ?? "Participating store" },
    promotion,
    next_expiry_date: expiryBatch.data?.expiry_date ?? null,
    next_restock: nextRestock,
    generated_at: nowIso,
    notice: "Stock and delivery information is a live snapshot and may change."
  });
});
