# YZS Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Admin panel at `/admin` (single admin user) to view/adjust stock, edit prices, add products, and add categories; categories become database-driven across the site.

**Architecture:** No new backend. The panel is a client-side React page using the existing supabase-js browser client; Postgres RLS scoped to the admin's user UUID is the security boundary. A new `categories` table feeds the navbar, footer, and homepage tiles, which now receive categories as props from server components.

**Tech Stack:** Next.js 16 App Router (no cacheComponents — "previous model" caching), Tailwind v4, @supabase/supabase-js v2, Supabase Postgres/Auth/Storage. Project: `ackzqdjqplinolszugmx`.

## Global Constraints

- Site pages must always show fresh DB data: root layout gets `export const dynamic = "force-dynamic"` (valid in this project's caching model; verified against `node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md`).
- All DB DDL goes through the Supabase MCP `apply_migration`; data seeding/verification through `execute_sql`.
- Write RLS policies must check `auth.uid() = '<ADMIN-UUID>'` (filled in Task 2), never bare `to authenticated`.
- No DELETE policies anywhere (deleting is out of scope).
- Match existing code style: Tailwind classes inline, `"use client"` components, uppercase-tracking typography.
- Existing public SELECT policies on products/variants/sizes/images must not be touched.
- There is no test framework in this repo; each task verifies via `npm run build`, browser checks on `http://localhost:3001`, and SQL checks. Do not introduce a test framework.
- Commit after every task with the trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: `categories` table + seed + public read

**Files:** none (database only)

**Interfaces:**
- Produces: `public.categories` table with columns `id uuid, slug text unique, title_en text, title_ru text, image_url text, display_order int, created_at timestamptz` — later tasks select `*` ordered by `display_order`.

- [ ] **Step 1: Apply migration `create_categories_table`** via MCP `apply_migration`:

```sql
create table public.categories (
  id uuid primary key default extensions.uuid_generate_v4(),
  slug text unique not null,
  title_en text not null,
  title_ru text not null,
  image_url text not null,
  display_order integer not null default 0,
  created_at timestamptz default now()
);
alter table public.categories enable row level security;
create policy "Public read access" on public.categories for select using (true);
```

- [ ] **Step 2: Seed the four existing categories** via `execute_sql`:

```sql
insert into public.categories (slug, title_en, title_ru, image_url, display_order) values
('t-shirts',     'T-Shirts',     'Футболки',   '/images/t-shirts.jpg',            1),
('hoodies',      'Hoodies',      'Худи',       '/images/hoodies.jpg',             2),
('long-sleeves', 'Long Sleeves', 'Лонгсливы',  '/images/long-sleeves.jpg',        3),
('accessories',  'Accessories',  'Аксессуары', '/images/products/bag/bag-2.jpg',  4);
```

- [ ] **Step 3: Verify** via `execute_sql`: `select slug, display_order from public.categories order by display_order;` — expect 4 rows in order t-shirts, hoodies, long-sleeves, accessories.

### Task 2: Admin user + admin-scoped write policies

**Files:**
- Create: `scripts/create-admin-user.mjs`

**Interfaces:**
- Produces: one confirmed auth user (email `khachatryankhachatur57@gmail.com`); its UUID is inlined into all write policies. Panel logs in via `supabase.auth.signInWithPassword`.

- [ ] **Step 1: Write `scripts/create-admin-user.mjs`:**

```js
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
```

- [ ] **Step 2: Generate a strong password and run the script** (Node 20+ has `--env-file`):

```bash
PW=$(openssl rand -base64 18)
echo "ADMIN PASSWORD: $PW"   # surfaced to the owner at the end
node --env-file=.env.local scripts/create-admin-user.mjs khachatryankhachatur57@gmail.com "$PW"
```

Expected: `created user id: <uuid>`.

- [ ] **Step 3: Confirm the email (if project requires confirmation) and fetch the UUID** via `execute_sql`:

```sql
update auth.users set email_confirmed_at = coalesce(email_confirmed_at, now())
 where email = 'khachatryankhachatur57@gmail.com';
select id, email, email_confirmed_at from auth.users where email = 'khachatryankhachatur57@gmail.com';
```

Record the `id` — it is `<ADMIN-UUID>` below.

- [ ] **Step 4: Apply migration `admin_write_policies`** (replace `<ADMIN-UUID>` with the real UUID):

```sql
create policy "Admin insert products" on public.products for insert to authenticated with check (auth.uid() = '<ADMIN-UUID>');
create policy "Admin update products" on public.products for update to authenticated using (auth.uid() = '<ADMIN-UUID>') with check (auth.uid() = '<ADMIN-UUID>');
create policy "Admin insert variants" on public.product_variants for insert to authenticated with check (auth.uid() = '<ADMIN-UUID>');
create policy "Admin update variants" on public.product_variants for update to authenticated using (auth.uid() = '<ADMIN-UUID>') with check (auth.uid() = '<ADMIN-UUID>');
create policy "Admin insert sizes" on public.variant_sizes for insert to authenticated with check (auth.uid() = '<ADMIN-UUID>');
create policy "Admin update sizes" on public.variant_sizes for update to authenticated using (auth.uid() = '<ADMIN-UUID>') with check (auth.uid() = '<ADMIN-UUID>');
create policy "Admin insert images" on public.variant_images for insert to authenticated with check (auth.uid() = '<ADMIN-UUID>');
create policy "Admin update images" on public.variant_images for update to authenticated using (auth.uid() = '<ADMIN-UUID>') with check (auth.uid() = '<ADMIN-UUID>');
create policy "Admin insert categories" on public.categories for insert to authenticated with check (auth.uid() = '<ADMIN-UUID>');
create policy "Admin update categories" on public.categories for update to authenticated using (auth.uid() = '<ADMIN-UUID>') with check (auth.uid() = '<ADMIN-UUID>');
create policy "Admin upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and auth.uid() = '<ADMIN-UUID>');
```

- [ ] **Step 5: Verify anon still cannot write** via `execute_sql`:

```sql
set local role anon;
insert into public.categories (slug, title_en, title_ru, image_url) values ('hack','x','x','x');
```

Expected: error `new row violates row-level security policy`.

- [ ] **Step 6: Commit** `scripts/create-admin-user.mjs`:

```bash
git add scripts/create-admin-user.mjs
git commit -m "feat: one-time admin user creation script"
```

### Task 3: Categories become database-driven (navbar, footer, homepage tiles)

**Files:**
- Create: `app/types.ts`
- Modify: `app/layout.tsx`, `app/page.tsx`, `app/components/Navbar.tsx`, `app/components/Footer.tsx`, `app/components/CategorySection.tsx`

**Interfaces:**
- Produces: `Category` type `{ id: string; slug: string; title_en: string; title_ru: string; image_url: string; display_order: number }` in `app/types.ts`; `Navbar`, `Footer`, `CategorySection` each take `categories: Category[]` as their only new prop.

- [ ] **Step 1: Create `app/types.ts`:**

```ts
export interface Category {
  id: string;
  slug: string;
  title_en: string;
  title_ru: string;
  image_url: string;
  display_order: number;
}
```

- [ ] **Step 2: Modify `app/layout.tsx`** — make it async, fetch categories, pass to Navbar/Footer, force dynamic rendering. Keep the font blocks unchanged. New body:

```tsx
import { supabase } from "./utils/supabase";
import type { Category } from "./types";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");
  const categories: Category[] = data ?? [];

  return (
    <html lang="en" className={`${rebelton.variable} ${rebeltonExtended.variable}`}>
      <body className="antialiased bg-black min-h-screen font-sans text-white">
        <StoreProvider>
          <Navbar categories={categories} />
          <main>{children}</main>
          <Footer categories={categories} />
        </StoreProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Modify `app/components/Navbar.tsx`** — add prop and replace the four hardcoded left links (lines 47-50):

```tsx
import type { Category } from "../types";

export default function Navbar({ categories }: { categories: Category[] }) {
```

```tsx
      <div className="flex items-center gap-8 text-[11px] tracking-widest uppercase">
        {categories.map((c) => (
          <Link key={c.id} href={`/${c.slug}`} className="hover:opacity-70 transition-opacity">
            {c.title_en}
          </Link>
        ))}
      </div>
```

- [ ] **Step 4: Modify `app/components/Footer.tsx`** — add the same prop; replace the four hardcoded Shop links (lines 68-71):

```tsx
import type { Category } from "../types";

export default function Footer({ categories }: { categories: Category[] }) {
```

```tsx
              {categories.map((c) => (
                <Link key={c.id} href={`/${c.slug}`} className="text-[11px] tracking-widest uppercase hover:text-white transition-colors">
                  {c.title_en}
                </Link>
              ))}
```

- [ ] **Step 5: Modify `app/components/CategorySection.tsx`** — delete the hardcoded `categories` array (lines 7-32), add the prop, and adapt the map to DB fields:

```tsx
import type { Category } from "../types";

export default function CategorySection({ categories }: { categories: Category[] }) {
```

In the JSX map: `key={category.id}`, `href={`/${category.slug}`}`, `src={category.image_url}`, `alt={category.title_en}`, `{category.title_en}` as the title. The `index !== 3` border logic becomes `index !== categories.length - 1`.

- [ ] **Step 6: Modify `app/page.tsx`** — fetch and pass categories:

```tsx
import Hero from "./components/Hero";
import AccessoriesSection from "./components/AccessoriesSection";
import NewArrivals from "./components/NewArrivals";
import CategorySection from "./components/CategorySection";
import { supabase } from "./utils/supabase";

export default async function Home() {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  return (
    <>
      <Hero />
      <NewArrivals />
      <AccessoriesSection />
      <CategorySection categories={data ?? []} />
    </>
  );
}
```

- [ ] **Step 7: Verify:** `npm run build` passes. On `http://localhost:3001`: navbar shows the 4 category links, homepage Collections shows 4 tiles, footer Shop column shows 4 links — all still working.

- [ ] **Step 8: Commit:**

```bash
git add app/types.ts app/layout.tsx app/page.tsx app/components/Navbar.tsx app/components/Footer.tsx app/components/CategorySection.tsx
git commit -m "feat: categories are database-driven across navbar, footer, homepage"
```

### Task 4: `/admin` login shell

**Files:**
- Create: `app/admin/page.tsx`, `app/admin/components/LoginForm.tsx`, `app/admin/components/AdminPanel.tsx`, `app/admin/components/StockTable.tsx` (stub), `app/admin/components/AddProductForm.tsx` (stub), `app/admin/components/AddCategoryForm.tsx` (stub), `app/admin/lib/helpers.ts`

**Interfaces:**
- Produces: `slugify(s: string): string` and `uploadImages(files: File[], folder: string): Promise<string[]>` in `app/admin/lib/helpers.ts`; `AdminPanel` renders the three tab components with no props. Tasks 5-7 replace the stubs' contents; their default exports must keep the same names.

- [ ] **Step 1: Create `app/admin/lib/helpers.ts`:**

```ts
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
```

- [ ] **Step 2: Create `app/admin/page.tsx`:**

```tsx
"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import LoginForm from "./components/LoginForm";
import AdminPanel from "./components/AdminPanel";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <main className="min-h-screen bg-white" />;
  }
  return session ? <AdminPanel /> : <LoginForm />;
}
```

- [ ] **Step 3: Create `app/admin/components/LoginForm.tsx`:**

```tsx
"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Wrong email or password");
    setBusy(false);
  };

  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-3xl font-black italic tracking-wider uppercase">Admin</h1>
        <input
          type="email"
          placeholder="EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-b border-black/30 focus:border-black transition-colors py-2 text-xs tracking-widest outline-none"
          required
        />
        <input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-b border-black/30 focus:border-black transition-colors py-2 text-xs tracking-widest outline-none"
          required
        />
        {error && <p className="text-xs text-red-600 tracking-widest uppercase">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="bg-black text-white py-3 text-[11px] font-bold tracking-[0.2em] uppercase disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
```

- [ ] **Step 4: Create `app/admin/components/AdminPanel.tsx`:**

```tsx
"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabase";
import StockTable from "./StockTable";
import AddProductForm from "./AddProductForm";
import AddCategoryForm from "./AddCategoryForm";

const TABS = ["Stock", "Add product", "Add category"] as const;
type Tab = (typeof TABS)[number];

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("Stock");

  return (
    <main className="min-h-screen bg-white text-black px-6 md:px-10 py-10">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-8">
          <h1 className="text-3xl font-black italic tracking-wider uppercase">YZS Admin</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-colors"
          >
            Sign out
          </button>
        </div>
        <div className="flex gap-6 mb-10 text-[11px] font-bold tracking-[0.2em] uppercase">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-1 border-b-2 transition-colors ${
                tab === t ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "Stock" && <StockTable />}
        {tab === "Add product" && <AddProductForm />}
        {tab === "Add category" && <AddCategoryForm />}
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Create the three stubs** (identical shape; replaced in Tasks 5-7). `StockTable.tsx`:

```tsx
"use client";

export default function StockTable() {
  return <p className="text-xs tracking-widest uppercase text-gray-400">Coming in Task 5</p>;
}
```

`AddProductForm.tsx` / `AddCategoryForm.tsx`: same with names `AddProductForm` / `AddCategoryForm` and texts "Coming in Task 6" / "Coming in Task 7".

- [ ] **Step 6: Verify:** `npm run build` passes. In the browser at `/admin`: wrong password shows "Wrong email or password"; the real admin credentials land in the panel with three tabs; Sign out returns to the login form.

- [ ] **Step 7: Commit:**

```bash
git add app/admin
git commit -m "feat: admin login gate and panel shell"
```

### Task 5: Stock & prices table

**Files:**
- Modify: `app/admin/components/StockTable.tsx` (replace stub)

**Interfaces:**
- Consumes: `supabase` client; RLS from Task 2.
- Produces: default export `StockTable` (no props).

- [ ] **Step 1: Replace `StockTable.tsx` with the full implementation:**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

interface SizeRow {
  id: string;
  size_label: string;
  stock_quantity: number;
  sku: string;
}
interface VariantRow {
  id: string;
  color_name_en: string;
  variant_sizes: SizeRow[];
}
interface ProductRow {
  id: string;
  slug: string;
  name_en: string;
  category: string;
  price: number;
  currency: string;
  product_variants: VariantRow[];
}

export default function StockTable() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, name_en, category, price, currency, product_variants(id, color_name_en, variant_sizes(id, size_label, stock_quantity, sku))")
      .order("category")
      .order("name_en");
    if (!error && data) {
      const rows = data as unknown as ProductRow[];
      setProducts(rows);
      const p: Record<string, string> = {};
      const q: Record<string, number> = {};
      for (const prod of rows) {
        p[prod.id] = String(prod.price);
        for (const v of prod.product_variants) {
          for (const s of v.variant_sizes) q[s.id] = s.stock_quantity;
        }
      }
      setPrices(p);
      setQuantities(q);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (prod: ProductRow) => {
    setStatus((s) => ({ ...s, [prod.id]: "saving" }));
    try {
      const newPrice = Number(prices[prod.id]);
      if (Number.isFinite(newPrice) && newPrice !== prod.price) {
        const { error } = await supabase.from("products").update({ price: newPrice }).eq("id", prod.id);
        if (error) throw error;
      }
      for (const v of prod.product_variants) {
        for (const s of v.variant_sizes) {
          const q = quantities[s.id];
          if (q !== s.stock_quantity) {
            const { error } = await supabase.from("variant_sizes").update({ stock_quantity: q }).eq("id", s.id);
            if (error) throw error;
          }
        }
      }
      setStatus((s) => ({ ...s, [prod.id]: "saved" }));
      load();
    } catch (e) {
      setStatus((s) => ({ ...s, [prod.id]: `error: ${e instanceof Error ? e.message : "failed"}` }));
    }
  };

  if (loading) return <p className="text-xs tracking-widest uppercase text-gray-400">Loading…</p>;

  return (
    <div className="flex flex-col gap-10">
      {products.map((prod) => (
        <div key={prod.id} className="border border-gray-200 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">{prod.category}</span>
              <h2 className="text-lg font-black italic tracking-wider uppercase">{prod.name_en}</h2>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prices[prod.id] ?? ""}
                onChange={(e) => setPrices((p) => ({ ...p, [prod.id]: e.target.value }))}
                className="w-24 border border-gray-300 px-2 py-1 text-sm text-right"
              />
              <span className="text-xs text-gray-500">{prod.currency}</span>
            </div>
          </div>
          {prod.product_variants.map((v) => (
            <div key={v.id} className="flex flex-wrap items-center gap-6 mb-2">
              <span className="text-[10px] tracking-widest uppercase text-gray-500 w-20">{v.color_name_en}</span>
              {[...v.variant_sizes]
                .sort((a, b) => a.size_label.localeCompare(b.size_label))
                .map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <span className="text-xs font-bold w-6">{s.size_label}</span>
                    <button
                      type="button"
                      onClick={() => setQuantities((q) => ({ ...q, [s.id]: Math.max(0, (q[s.id] ?? 0) - 1) }))}
                      className="w-7 h-7 border border-gray-300 hover:bg-black hover:text-white transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={quantities[s.id] ?? 0}
                      onChange={(e) => setQuantities((q) => ({ ...q, [s.id]: Math.max(0, Number(e.target.value) || 0) }))}
                      className="w-14 border border-gray-300 px-1 py-1 text-sm text-center"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantities((q) => ({ ...q, [s.id]: (q[s.id] ?? 0) + 1 }))}
                      className="w-7 h-7 border border-gray-300 hover:bg-black hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                ))}
            </div>
          ))}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => save(prod)}
              disabled={status[prod.id] === "saving"}
              className="bg-black text-white px-6 py-2 text-[10px] font-bold tracking-[0.2em] uppercase disabled:opacity-50"
            >
              {status[prod.id] === "saving" ? "Saving…" : "Save"}
            </button>
            {status[prod.id] === "saved" && <span className="text-[10px] tracking-widest uppercase text-green-600">Saved</span>}
            {status[prod.id]?.startsWith("error") && (
              <span className="text-[10px] tracking-widest uppercase text-red-600">{status[prod.id]}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify:** `npm run build` passes. In the browser: log in at `/admin`, change one size's quantity (e.g. Luffy M 2 → 3) and its price, Save, see "Saved". Confirm in DB via `execute_sql`: `select sku, stock_quantity from variant_sizes where sku = 'LUFFY-TS-M';` shows the new value. Change it back in the panel afterward.

- [ ] **Step 3: Commit:**

```bash
git add app/admin/components/StockTable.tsx
git commit -m "feat: admin stock and price editing"
```

### Task 6: Add-product form

**Files:**
- Modify: `app/admin/components/AddProductForm.tsx` (replace stub)

**Interfaces:**
- Consumes: `slugify`, `uploadImages` from `app/admin/lib/helpers.ts`; `Category` from `app/types.ts`.
- Produces: default export `AddProductForm` (no props).

- [ ] **Step 1: Replace `AddProductForm.tsx` with the full implementation:**

```tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import type { Category } from "../../types";
import { slugify, uploadImages } from "../lib/helpers";

interface SizeInput {
  label: string;
  qty: number;
}

export default function AddProductForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nameEn, setNameEn] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [colorEn, setColorEn] = useState("Black");
  const [colorRu, setColorRu] = useState("Чёрный");
  const [colorHex, setColorHex] = useState("#000000");
  const [sizes, setSizes] = useState<SizeInput[]>([
    { label: "M", qty: 0 },
    { label: "L", qty: 0 },
    { label: "XL", qty: 0 },
  ]);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.from("categories").select("*").order("display_order").then(({ data }) => {
      setCategories(data ?? []);
      if (data?.length) setCategory(data[0].slug);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const slug = slugify(nameEn);
      if (!slug) throw new Error("Name (EN) is required");
      const priceNum = Number(price);
      if (!Number.isFinite(priceNum) || priceNum <= 0) throw new Error("Price must be a positive number");

      const urls = files.length ? await uploadImages(files, `products/${slug}`) : [];
      const fallbackCover = categories.find((c) => c.slug === category)?.image_url ?? "";
      const cover = urls[0] ?? fallbackCover;

      const { data: prod, error: prodErr } = await supabase
        .from("products")
        .insert({ slug, name_en: nameEn, name_ru: nameRu || nameEn, category, price: priceNum, currency })
        .select("id")
        .single();
      if (prodErr) throw prodErr;

      const { data: variant, error: varErr } = await supabase
        .from("product_variants")
        .insert({ product_id: prod.id, color_name_en: colorEn, color_name_ru: colorRu, color_hex: colorHex, cover_image: cover })
        .select("id")
        .single();
      if (varErr) throw varErr;

      const sizeRows = sizes
        .filter((s) => s.label.trim())
        .map((s) => ({
          variant_id: variant.id,
          size_label: s.label.trim().toUpperCase(),
          stock_quantity: s.qty,
          sku: `${slug.toUpperCase()}-${s.label.trim().toUpperCase()}`,
        }));
      if (sizeRows.length) {
        const { error: sizeErr } = await supabase.from("variant_sizes").insert(sizeRows);
        if (sizeErr) throw sizeErr;
      }

      if (urls.length) {
        const { error: imgErr } = await supabase
          .from("variant_images")
          .insert(urls.map((url, i) => ({ variant_id: variant.id, image_url: url, display_order: i + 1 })));
        if (imgErr) throw imgErr;
      }

      setMessage(`Added "${nameEn}" — it is live in ${category}.`);
      setNameEn("");
      setNameRu("");
      setPrice("");
      setFiles([]);
      setSizes([{ label: "M", qty: 0 }, { label: "L", qty: 0 }, { label: "XL", qty: 0 }]);
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : "failed"}`);
    }
    setBusy(false);
  };

  const input = "border-b border-black/30 focus:border-black transition-colors py-2 text-sm outline-none w-full";

  return (
    <form onSubmit={submit} className="flex flex-col gap-6 max-w-xl">
      <div className="grid grid-cols-2 gap-6">
        <input className={input} placeholder="NAME (EN) *" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
        <input className={input} placeholder="NAME (RU)" value={nameRu} onChange={(e) => setNameRu(e.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <select className={input} value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.title_en}</option>
          ))}
        </select>
        <input className={input} type="number" min="0" step="0.01" placeholder="PRICE *" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <select className={input} value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="AMD">AMD</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <input className={input} placeholder="COLOR (EN)" value={colorEn} onChange={(e) => setColorEn(e.target.value)} />
        <input className={input} placeholder="COLOR (RU)" value={colorRu} onChange={(e) => setColorRu(e.target.value)} />
        <input className="h-10 w-16 border border-gray-300" type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)} />
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-3">Sizes & starting stock</p>
        <div className="flex flex-col gap-2">
          {sizes.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                className="w-16 border border-gray-300 px-2 py-1 text-sm text-center uppercase"
                value={s.label}
                onChange={(e) => setSizes((arr) => arr.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
              />
              <input
                className="w-20 border border-gray-300 px-2 py-1 text-sm text-center"
                type="number"
                min="0"
                value={s.qty}
                onChange={(e) => setSizes((arr) => arr.map((x, j) => (j === i ? { ...x, qty: Math.max(0, Number(e.target.value) || 0) } : x)))}
              />
              <button type="button" className="text-gray-400 hover:text-black text-xs" onClick={() => setSizes((arr) => arr.filter((_, j) => j !== i))}>
                remove
              </button>
            </div>
          ))}
          <button type="button" className="self-start text-[10px] font-bold tracking-[0.2em] uppercase underline" onClick={() => setSizes((arr) => [...arr, { label: "", qty: 0 }])}>
            + size
          </button>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-3">Photos (first = cover)</p>
        <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} className="text-xs" />
      </div>
      {message && (
        <p className={`text-xs tracking-widest uppercase ${message.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>
      )}
      <button type="submit" disabled={busy} className="bg-black text-white py-3 text-[11px] font-bold tracking-[0.2em] uppercase disabled:opacity-50">
        {busy ? "Adding…" : "Add product"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Verify:** `npm run build` passes. In the browser: add a test product "Test Tee" (category t-shirts, price 10, size M qty 1, no photo). Expect success message; `http://localhost:3001/t-shirts` shows it (cover = category image). Then delete the test data via `execute_sql` (postgres role bypasses RLS):

```sql
delete from variant_sizes where variant_id in (select pv.id from product_variants pv join products p on p.id = pv.product_id where p.slug = 'test-tee');
delete from product_variants where product_id in (select id from products where slug = 'test-tee');
delete from products where slug = 'test-tee';
```

- [ ] **Step 3: Commit:**

```bash
git add app/admin/components/AddProductForm.tsx
git commit -m "feat: admin add-product form"
```

### Task 7: Add-category form

**Files:**
- Modify: `app/admin/components/AddCategoryForm.tsx` (replace stub)

**Interfaces:**
- Consumes: `slugify`, `uploadImages` from `app/admin/lib/helpers.ts`.
- Produces: default export `AddCategoryForm` (no props).

- [ ] **Step 1: Replace `AddCategoryForm.tsx` with the full implementation:**

```tsx
"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabase";
import { slugify, uploadImages } from "../lib/helpers";

export default function AddCategoryForm() {
  const [titleEn, setTitleEn] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState("5");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const finalSlug = slugify(slug || titleEn);
      if (!finalSlug) throw new Error("Title (EN) is required");
      if (!file) throw new Error("A photo is required");
      const [imageUrl] = await uploadImages([file], "categories");
      const { error } = await supabase.from("categories").insert({
        slug: finalSlug,
        title_en: titleEn,
        title_ru: titleRu || titleEn,
        image_url: imageUrl,
        display_order: Number(order) || 99,
      });
      if (error) throw error;
      setMessage(`Added category "${titleEn}" — it is live at /${finalSlug}.`);
      setTitleEn("");
      setTitleRu("");
      setSlug("");
      setFile(null);
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : "failed"}`);
    }
    setBusy(false);
  };

  const input = "border-b border-black/30 focus:border-black transition-colors py-2 text-sm outline-none w-full";

  return (
    <form onSubmit={submit} className="flex flex-col gap-6 max-w-xl">
      <div className="grid grid-cols-2 gap-6">
        <input className={input} placeholder="TITLE (EN) *" value={titleEn} onChange={(e) => { setTitleEn(e.target.value); setSlug(slugify(e.target.value)); }} required />
        <input className={input} placeholder="TITLE (RU)" value={titleRu} onChange={(e) => setTitleRu(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <input className={input} placeholder="URL SLUG" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input className={input} type="number" min="0" placeholder="ORDER" value={order} onChange={(e) => setOrder(e.target.value)} />
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-3">Tile photo *</p>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-xs" />
      </div>
      {message && (
        <p className={`text-xs tracking-widest uppercase ${message.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>
      )}
      <button type="submit" disabled={busy} className="bg-black text-white py-3 text-[11px] font-bold tracking-[0.2em] uppercase disabled:opacity-50">
        {busy ? "Adding…" : "Add category"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Verify:** `npm run build` passes. In the browser: add category "Test Cat" with any small image. Expect success; homepage Collections shows a 5th tile, navbar and footer show the link, `/test-cat` opens ("Collection arriving soon." — no products, correct). Then remove test data via `execute_sql`:

```sql
delete from public.categories where slug = 'test-cat';
delete from storage.objects where bucket_id = 'product-images' and name like 'categories/%';
```

(Only run the second statement if the test image is the only object under `categories/`.)

- [ ] **Step 3: Commit:**

```bash
git add app/admin/components/AddCategoryForm.tsx
git commit -m "feat: admin add-category form"
```

### Task 8: Final verification pass

**Files:** none

- [ ] **Step 1:** `npm run build` — passes with zero type errors.
- [ ] **Step 2:** Full browser pass on `http://localhost:3001`: homepage (hero, tiles), a category page, `/admin` login → adjust one real stock number → verify on the category page → set it back.
- [ ] **Step 3:** RLS spot check via `execute_sql` (as in Task 2 Step 5) — anon insert still denied.
- [ ] **Step 4:** Report the admin credentials (email + generated password) to the owner with instruction to change the password in Supabase dashboard → Authentication → Users.
