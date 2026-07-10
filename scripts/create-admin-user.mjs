import { createClient } from "@supabase/supabase-js";

const [, , email, password] = process.argv;
if (!email || !password) {
  console.error("usage: node --env-file=.env.local scripts/create-admin-user.mjs <email> <password>");
  process.exit(1);
}
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const { data, error } = await supabase.auth.signUp({ email, password });
if (error) {
  console.error("signUp failed:", error.message);
  process.exit(1);
}
console.log("created user id:", data.user?.id);
