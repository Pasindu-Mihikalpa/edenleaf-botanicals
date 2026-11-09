# Implementation Plan - Centered Immersive Hero, Curtain Reveal & Admin Center

**Status:** Awaiting User Review & Approval (Step 3 Milestone)  
**Reference Specification:** [`agent.md`](./agent.md)

---

## 1. Project Objectives & Deliverables
1. **Hero Section Redesign (Reference Style):**
   - Immersive full-width botanical conservatory background image.
   - Luxury dark/gold overlay gradient for text legibility.
   - **Strict center-alignment** of all headlines, badges, and action buttons.
   - **GSAP ScrollTrigger Curtain Transition:** Entire hero smoothly slides upward on scroll, cleanly revealing the catalog underneath.
   - Interactive Three.js botanical canvas seamlessly composited with ambient bio-spores and mouse-parallax responsiveness.
2. **Admin Management Center (`/admin`):**
   - Passkey-gated modal (`eden2026`) with `sessionStorage` session tracking.
   - Collapsible Obsidian Evergreen (`#0A1C13`) sidebar with route switching (`/` and `/admin`).
   - **Product Inventory CRUD:** Inline table editor for stock count and pricing, "Add New Cultivar" modal, and archive/delete actions.
   - **Order Lifecycle Center:** Order queue table with status updates (`Pending`, `Confirmed`, `Dispatched`, `Delivered`, `Cancelled`) and direct one-click WhatsApp/Email status notifications.
   - Real-time synchronization between Storefront customer orders and Admin management queue.
3. **Color Tokens & Public Storefront:**
   - Ivory Marble (`#F8F6F0`) canvas, Deep Forest Green (`#0F2E1E`) typography, Warm Metallic Gold (`#C59B27`) CTAs, Antique Gold (`#DFB847`) hover, Obsidian Evergreen (`#0A1C13`) dark containers, and Leaf Green (`#4B6E4A`) accents.
   - 106-item catalog with clean cards (descriptions kept in modal view), 5-step Plant Matchmaker, and dual WhatsApp/Email order dispatch.

---

## 2. Phase-by-Phase Execution Roadmap

### Phase 1: State Management & Router Integration (`useStore.ts`)
- Add dynamic product CRUD (`addProduct`, `updateProductStockPrice`, `deleteProduct`, `resetCatalog`).
- Add order log management (`orders: OrderRecord[]`, `addOrder`, `updateOrderStatus`, `deleteOrder`).
- Add view state (`currentView: 'storefront' | 'admin'`) synced with browser `window.location.pathname` and `history.pushState`.
- Add admin authentication state (`isAdminAuthenticated: boolean`).

### Phase 2: Hero Section Redesign & GSAP Curtain Upward Scroll (`HeroSection.tsx`)
- Implement full-width high-resolution botanical conservatory backdrop.
- Apply deep forest green and warm gold gradient overlays (`from-[#0A1C13]/85 via-[#05130D]/70 to-[#0F2E1E]/90`).
- Align all hero content strictly to the center:
  - Circular Eden Leaf logo emblem with gold ring.
  - Headline: *"Growing Beauty, Naturally."* in Playfair Display serif.
  - Subtitle: *"Living Architecture & Specimen Flora"*.
  - Centered CTA buttons ("Explore Full Catalog (106)" & "Plant Matchmaker (5-Steps)").
  - Centered trust highlights (100% Organic, White Glove Courier, Bespoke Landscaping).
- Setup GSAP ScrollTrigger timeline to slide the entire hero container upward (`yPercent: -40, opacity: 0.35`) as the user scrolls, creating the theater curtain reveal effect over the catalog.

### Phase 3: Admin Management Terminal Components
- `src/components/admin/AdminPasskeyModal.tsx`: Passkey authentication dialog.
- `src/components/admin/AdminDashboard.tsx`: Main layout with collapsible Obsidian Evergreen sidebar, KPI metrics bar (Gross Sales, Orders, Catalog Count, Stock Alerts), and tab switching.
- `src/components/admin/AdminInventoryTable.tsx`: Searchable inventory matrix with inline price/stock adjustments, "Add Cultivar" modal with image preview, and delete actions.
- `src/components/admin/AdminOrdersTable.tsx`: Live order log with status badges and one-click "Reply on WhatsApp" / "Send Email" triggers.

### Phase 4: Storefront Navigation & Order Sync
- Connect Storefront order triggers ("Send via WhatsApp" and "Send via Email") to auto-create and push `OrderRecord` instances to the Admin order queue.
- Add an "Admin Portal" discreet link in the fixed Navbar and Footer.

### Phase 5: Build Verification & Testing
- Execute `tsc && vite build`.
- Verify the GSAP curtain scroll interaction across different screen heights.
- Verify adding/updating a product in Admin reflects instantly in Storefront catalog.
- Verify placing an order in Storefront shows up immediately in Admin order queue.

---

## 3. Verification Checklist
- [ ] Hero section features a full-width botanical background with elegant dark/gold overlay gradient.
- [ ] All hero elements are strictly center-aligned.
- [ ] GSAP ScrollTrigger smoothly slides hero content upward on scroll like a curtain reveal.
- [ ] Admin Dashboard (`/admin`) accessible via passkey (`eden2026`).
- [ ] Inventory CRUD works with live stock/price updates reflected on storefront.
- [ ] Order management tracks customer orders with direct WhatsApp/Email reply triggers.
- [ ] Production build succeeds with 0 errors.
