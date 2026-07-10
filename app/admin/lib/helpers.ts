import { supabase } from "../../utils/supabase";

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function uploadImages(files: File[], folder: string): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const ext = files[i].name.split(".").pop() || "jpg";
    const path = `${folder}/${Date.now()}-${i + 1}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, files[i]);
    if (error) throw new Error(`Upload failed: ${error.message}`);
    urls.push(supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl);
  }
  return urls;
}
