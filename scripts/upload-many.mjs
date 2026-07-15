// Upload multiple files to the product-images bucket in one run.
// Usage:
//   node --env-file=.env.local scripts/upload-many.mjs <email> <password> <src>=<dest> [<src>=<dest> ...]
// Example:
//   node --env-file=.env.local scripts/upload-many.mjs admin@x.com secret "C:/photos/1.png=products/foo/foo-1.png"
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";

const [, , email, password, ...pairs] = process.argv;
if (!email || !password || pairs.length === 0) {
  console.error("usage: upload-many.mjs <email> <password> <src>=<dest> ...");
  process.exit(1);
}

const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
if (authErr) {
  console.error("auth failed:", authErr.message);
  process.exit(1);
}

let failed = false;
for (const pair of pairs) {
  const idx = pair.lastIndexOf("=");
  const srcPath = pair.slice(0, idx);
  const destPath = pair.slice(idx + 1);
  const buf = await readFile(srcPath);
  const contentType = TYPES[extname(destPath).toLowerCase()] ?? "application/octet-stream";
  const { error } = await supabase.storage
    .from("product-images")
    .upload(destPath, buf, { contentType, upsert: true });
  if (error) {
    console.error(`FAILED ${destPath}: ${error.message}`);
    failed = true;
    continue;
  }
  console.log("uploaded:", supabase.storage.from("product-images").getPublicUrl(destPath).data.publicUrl);
}
process.exit(failed ? 1 : 0);
