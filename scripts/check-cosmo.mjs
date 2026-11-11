import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const required = [
  "index.html", "work.html", "admin.html", "service-worker.js",
  "manifest.webmanifest", "work.webmanifest", "admin.webmanifest",
  "assets/app.js", "assets/cosmo-live.js",
  "supabase/functions/cosmo-chat/index.ts", "supabase/functions/cosmo-admin-gate/index.ts"
];
for (const file of required) readFileSync(file, "utf8");

for (const file of ["manifest.webmanifest", "work.webmanifest", "admin.webmanifest"]) {
  JSON.parse(readFileSync(file, "utf8"));
}

for (const file of ["assets/app.js", "assets/cosmo-live.js", "service-worker.js"]) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(file + " syntax check failed:\n" + result.stderr);
}

for (const file of ["index.html", "work.html", "admin.html"]) {
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
const chat = readFileSync("supabase/functions/cosmo-chat/index.ts", "utf8");
for (const tool of ["create_task", "list_tasks", "search_knowledge", "create_mission", "list_missions", "request_approval"]) {
  if (!chat.includes('name: "' + tool + '"')) throw new Error("Cosmo agent tool is missing: " + tool);
}
if (!chat.includes("parallel_tool_calls: false")) throw new Error("Cosmo agent must keep tool execution sequential.");
console.log("Cosmo checks passed: files, manifests, JavaScript syntax, PWA hooks, workspace controls and agent tool registry.");
