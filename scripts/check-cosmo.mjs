import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const required = [
  "index.html", "work.html", "admin.html", "strategy-academy.html", "service-worker.js",
  "manifest.webmanifest", "work.webmanifest", "admin.webmanifest",
  "assets/app.js", "assets/cosmo-live.js",
  "supabase/functions/cosmo-chat/index.ts", "supabase/functions/cosmo-admin-gate/index.ts",
  "supabase/functions/_shared/strategy-engine.ts", "supabase/functions/_shared/strategy-engine.test.ts", "supabase/functions/_shared/strategy-benchmark.ts", "supabase/functions/_shared/strategy-benchmark.test.ts"
];
for (const file of required) readFileSync(file, "utf8");

for (const file of ["manifest.webmanifest", "work.webmanifest", "admin.webmanifest"]) {
  JSON.parse(readFileSync(file, "utf8"));
}

for (const file of ["assets/app.js", "assets/cosmo-live.js", "service-worker.js"]) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(file + " syntax check failed:\n" + result.stderr);
}

for (const file of ["index.html", "work.html", "admin.html", "strategy-academy.html"]) {
  const html = readFileSync(file, "utf8");
  if (!html.includes('rel="manifest"')) throw new Error(file + " is missing its web app manifest.");
  if (!html.includes("serviceWorker.register")) throw new Error(file + " is missing service worker registration.");
  const blocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  let inlineIndex = 0;
  for (const match of blocks) {
    if (/\bsrc\s*=/.test(match[1]) || /application\/ld\+json/i.test(match[1]) || !match[2].trim()) continue;
    const temp = join(tmpdir(), "cosmo-inline-" + process.pid + "-" + inlineIndex++ + ".js");
    writeFileSync(temp, match[2]);
    const result = spawnSync(process.execPath, ["--check", temp], { encoding: "utf8" });
    unlinkSync(temp);
    if (result.status !== 0) throw new Error(file + " inline script syntax check failed:\n" + result.stderr);
  }
}

const work = readFileSync("work.html", "utf8");
for (const id of ["task-form", "task-list", "step-form", "approval-list", "package-form", "package-list", "release-form", "release-list"]) {
  if (!work.includes('id="' + id + '"')) throw new Error("Cosmo Work is missing required control: " + id);
}
const admin = readFileSync("admin.html", "utf8");
for (const id of ["mission-form", "knowledge-form", "lesson-form", "gate-warning"]) {
  if (!admin.includes('id="' + id + '"')) throw new Error("Cosmo Admin is missing required control: " + id);
}
const academy = readFileSync("strategy-academy.html", "utf8");
for (const id of ["auth-form", "run-count", "running-count", "review-count", "eval-count", "verified-count", "run-list", "outcome-bars"]) {
  if (!academy.includes('id="' + id + '"')) throw new Error("Strategy Academy is missing required control: " + id);
}
if (!admin.includes('href="strategy-academy.html"')) throw new Error("Admin portal is missing the Strategy Academy link.");
for (const forbidden of [".insert(", ".update(", ".delete(", "upsert("]) {
  if (academy.includes(forbidden)) throw new Error("Strategy Academy must remain read-only; found " + forbidden);
}
const chat = readFileSync("supabase/functions/cosmo-chat/index.ts", "utf8");
for (const tool of ["create_task", "list_tasks", "search_knowledge", "create_mission", "list_missions", "request_approval"]) {
  if (!chat.includes('name: "' + tool + '"')) throw new Error("Cosmo agent tool is missing: " + tool);
}
if (!chat.includes("parallel_tool_calls: false")) throw new Error("Cosmo agent must keep tool execution sequential.");
for (const tool of ["recommend_strategies","begin_strategy_run","complete_strategy_run","evaluate_strategy_run"]) {
  if (!chat.includes('name: "' + tool + '"')) throw new Error("Cosmo strategy engine tool is missing: " + tool);
}
if (!chat.includes('from "../_shared/strategy-engine.ts"')) throw new Error("Cosmo chat is missing the strategy engine import.");
if (!chat.includes("source_verified===true")) throw new Error("Strategy ranking must ignore unverified evaluation claims.");
const benchmark = readFileSync("supabase/functions/_shared/strategy-benchmark.ts", "utf8");\nif (!benchmark.includes("runStrategyBenchmark")) throw new Error("Strategy benchmark runner is missing.");\nif (!benchmark.includes("deterministic-order")) throw new Error("Benchmark harness is missing deterministic regression checks.");\nconst strategyEngine = readFileSync("supabase/functions/_shared/strategy-engine.ts", "utf8");
for (const guard of ["avoid_when","cosmo_validation_state","history.length >= 3","unsafe"]) {
  if (!strategyEngine.includes(guard)) throw new Error("Strategy engine is missing required safety/ranking guard: " + guard);
}

console.log("Cosmo checks passed: files, manifests, JavaScript syntax, PWA hooks, workspace controls and agent tool registry.");
