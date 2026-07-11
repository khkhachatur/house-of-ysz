import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const [, , email, password, srcPath, destPath] = process.argv;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
if (authErr) {
  console.error("auth failed:", authErr.message);
  process.exit(1);
}

const buf = await readFile(srcPath);
const { error } = await supabase.storage
  .from("product-images")
  .upload(destPath, buf, { contentType: "image/jpeg" });
if (error) {
  console.error(`FAILED: ${error.message}`);
  process.exit(1);
}
console.log("uploaded:", supabase.storage.from("product-images").getPublicUrl(destPath).data.publicUrl);
