# System Architecture & Technical Specifications (`agent.md`)
**Project:** Eden Leaf Botanicals - Living Showcase, Centered Hero & Admin Control Terminal  
**Role:** Senior Creative Developer & Frontend Architect  
**Brand Identity:** Eden Leaf Botanicals ("Growing Beauty, Naturally")  
**Target Environment:** React 18+ (Vite), Tailwind CSS, GSAP + ScrollTrigger, Three.js, Framer Motion, Zustand

---

## 1. Brand Color System (Matched to Official Logo Card)

```
┌────────────────────────────────────────────────────────────────────────┐
│ OFFICIAL EDEN LEAF COLOR TOKENS                                        │
├────────────────────────────────┬─────────────────┬────────────────────┤
│ Token Role                     │ Hex Code        │ Tailwind Utility   │
├────────────────────────────────┼─────────────────┼────────────────────┤
│ Primary Canvas / Background    │ #F8F6F0         │ bg-[#F8F6F0]       │
│ Primary Brand Text             │ #0F2E1E         │ text-[#0F2E1E]     │
│ Luxury Accent Gold             │ #C59B27         │ bg/text-[#C59B27]  │
│ Gold Hover Highlight           │ #DFB847         │ hover:text-[#DFB847]│
│ Dark Containers / Admin / Foot │ #0A1C13         │ bg-[#0A1C13]       │
│ Botanical Accent Leaf Green    │ #4B6E4A         │ text-[#4B6E4A]     │
└────────────────────────────────┴─────────────────┴────────────────────┘
```

---

## 2. Hero Section Architecture (Full-Width Immersive & Centered Layout)

Inspired by luxury editorial botanical experiences (e.g., CoderPlace nursery reference):

### A. Visual & Overlay Layering
- **Full-Width Botanical Canvas:** High-resolution luxury greenhouse/botanical photography backdrop (`object-cover w-full h-full`).
- **Luminance & Legibility Gradient:** Multi-stop linear gradient (`linear-gradient(to bottom, rgba(10, 28, 19, 0.72) 0%, rgba(5, 19, 13, 0.55) 50%, rgba(15, 46, 30, 0.85) 100%)`) accented with warm metallic gold radial flares (`rgba(197, 155, 39, 0.15)`).
- **Strict Center Alignment:**
  * Top Brand Emblem & Centered Monogram.
  * Curated Badge: `BOTANICALS • LANDSCAPING • NURSERY`.
  * Headline: *"Growing Beauty, Naturally."* in Playfair Display serif with satin gold gradient text.
  * Centered Call-to-Action Group: "Explore Full Catalog (106)" & "Plant Matchmaker (5-Steps)".
  * Centered Micro-Trust Matrix: 100% Organic • White Glove Dispatch • Bespoke Landscaping.

### B. GSAP ScrollTrigger Curtain Slide-Up Effect
- As the user scrolls downward:
  ```javascript
  gsap.to(heroContainerRef.current, {
    yPercent: -40,
    opacity: 0.35,
    scale: 0.96,
    ease: "none",
    scrollTrigger: {
      trigger: heroContainerRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
      pin: false
    }
  });
  ```
- The subsequent Catalog section (`#catalog`) advances smoothly upward with an elevation shadow (`shadow-2xl z-30`), creating a seamless curtain reveal transition.

---

## 3. 3D WebGL Surface Text Mesh Standards
To prevent clipping and depth fighting on the 3D plant node:
1. **Polygon Offset:** `polygonOffset = true; polygonOffsetFactor = -4.0; polygonOffsetUnits = -4.0;`
2. **Normal Offset:** Programmatic `+0.01` unit outward offset along the face normal.
3. **Bounding Volume Integrity:** `geometry.computeBoundingBox()` and `geometry.computeBoundingSphere()` executed immediately on creation.

---

## 4. Admin Management Center (`/admin`) Architecture
- **Protected Access:** Passkey authentication dialog (`eden2026`) with `sessionStorage` persistence.
- **Obsidian Evergreen Sidebar (`#0A1C13`):** Collapsible navigation between Overview, Inventory CRUD, Order Queue, and Storefront return.
- **Inventory CRUD:** Add new product, delete/archive, and inline quick updater for Price ($) and Stock count.
- **Order Lifecycle Log:** Real-time table tracking Customer Name, Phone, Email, Address, Items, Value, and Dispatch Method (WhatsApp/Email) with status toggles (`Pending` -> `Confirmed` -> `Dispatched` -> `Delivered` -> `Cancelled`).
- **Direct Communication:** One-tap `wa.me` and `mailto:` action triggers with pre-filled status notifications.
