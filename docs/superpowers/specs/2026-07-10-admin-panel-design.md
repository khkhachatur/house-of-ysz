# YZS Admin Panel — Design Spec

Date: 2026-07-10
Status: Approved by owner (chat, 2026-07-10)

## Goal

A small admin panel at `/admin` where the store owner can:
1. See and adjust stock quantities per product size.
2. Edit product prices.
3. Add new products (name EN/RU, category, price, color, sizes with stock, photos).
4. Add new categories (appear in homepage Collections tiles, navbar, footer, and get a working `/<slug>` page).

Protected by exactly one admin user.

## Authentication

- One Supabase Auth user (email + password), email `khachatryankhachatur57@gmail.com`, created programmatically (signUp with anon key, then email-confirm via SQL if the project requires confirmation). Password: generated, shown to owner once, owner changes it in the Supabase dashboard.
- The panel signs in with `supabase.auth.signInWithPassword`; the session persists in the browser (supabase-js default).
- Authorization lives in Postgres RLS, **scoped to the admin's user UUID**, not to the whole `authenticated` role — so even if public signups are enabled, other accounts cannot write:
  - `products`, `product_variants`, `variant_sizes`, `variant_images`, `categories`: INSERT + UPDATE policies `to authenticated` with `auth.uid() = '<admin-uuid>'`.
  - `storage.objects` (bucket `product-images`): INSERT policy for the admin UUID (photo uploads).
  - Existing public read-only SELECT policies stay as they are; `categories` gets a public SELECT policy too.
- No DELETE policies (deleting is out of scope).

## Database changes

New table:

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
```

Seeded with the current four categories (t-shirts, hoodies, long-sleeves, accessories) using the images the site already uses (`/images/t-shirts.jpg` etc.). RLS enabled: public SELECT; admin INSERT/UPDATE.

## App changes

New files (all under `app/admin/`):
- `page.tsx` — client page: shows `LoginForm` when signed out, `AdminPanel` when signed in.
- `components/LoginForm.tsx` — email + password, error message on failure.
- `components/AdminPanel.tsx` — header with tabs (Stock / Add product / Add category) + sign-out button.
- `components/StockTable.tsx` — all products grouped by category: per-size stock inputs with +/− steppers, price input per product, Save button per product (updates `variant_sizes.stock_quantity` and `products.price`).
- `components/AddProductForm.tsx` — name EN/RU, category select (from `categories`), price + currency, color name EN/RU + hex, size rows (label + starting stock, addable), multi-photo upload. Creates product → variant → sizes → images. Photos upload to `product-images/products/<slug>/…`; first photo becomes `cover_image`, all photos become `variant_images` in order. Slug is generated from the EN name (lowercase, hyphens).
- `components/AddCategoryForm.tsx` — slug (auto from EN title, editable), title EN/RU, display order, one photo upload → inserts into `categories`.

Modified files:
- `app/layout.tsx` — becomes async, fetches categories server-side, passes them to `Navbar` and `Footer` as props.
- `app/page.tsx` — fetches categories, passes to `CategorySection`.
- `app/components/Navbar.tsx`, `Footer.tsx`, `CategorySection.tsx` — render category links/tiles from the prop instead of hardcoded arrays.
- `app/[category]/page.tsx` and `app/page.tsx` — add `export const revalidate = 0` so stock/product/category changes show immediately (small store; freshness beats caching).

Uses the existing `app/utils/supabase.ts` browser client everywhere; no new backend layer — RLS is the security boundary.

## Error handling

- Login failure → inline message ("Wrong email or password").
- Save/insert/upload failures → inline error next to the button, keep entered values.
- Forms disable their submit button while a request is in flight.

## Verification

- `npm run build` passes.
- In the browser: wrong password rejected; login works; stock change persists (visible in DB and on product page after refresh); new product shows on its category page; new category shows on homepage tiles + navbar + footer + `/<slug>` works; signed-out client cannot write (RLS denies).

## Out of scope

Deleting products/categories, editing photos of existing products, order management, multi-admin.
