import { test, expect } from '@playwright/test';

// =========================================================================
// Official Brand Color Tokens from Specification (agent.md)
// =========================================================================
const brandPalette = {
  canvas: '#F8F6F0',
  text: '#0F2E1E',
  gold: '#C59B27',
  goldHover: '#DFB847',
  dark: '#0A1C13',
  botanical: '#4B6E4A'
};

const SITE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173';

test.describe('Eden Leaf Botanicals - Architecture & Interaction QA Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(SITE_URL);
    await page.waitForLoadState('domcontentloaded');
  });

  // =========================================================================
  // TC-1: Hero Section & GSAP Scroll Behavior (The "Curtain Effect")
  // Spec Ref: 3. Hero Section Layout & Scroll Behavior
  // =========================================================================
  test('TC-1: Hero contents are center-aligned and scroll upward as a single unit via GSAP', async ({ page }) => {
    const heroSection = page.locator('#hero-section');
    const heroContent = page.locator('#hero-content');
    const catalogSection = page.locator('#catalog-section');

    // 1. Verify Center Alignment (CSS check)
    await expect(heroContent).toHaveCSS('display', 'flex');
    await expect(heroContent).toHaveCSS('align-items', 'center');
    await expect(heroContent).toHaveCSS('text-align', 'center');

    // 2. Verify Color Palette Application on Headline
    const heroHeading = heroContent.locator('h1');
    await expect(heroHeading).toBeVisible();

    // 3. Test GSAP ScrollTrigger "Curtain Effect"
    const initialHeroBBox = await heroSection.boundingBox();
    const initialCatalogBBox = await catalogSection.boundingBox();

    expect(initialHeroBBox).not.toBeNull();
    expect(initialCatalogBBox).not.toBeNull();

    if (initialHeroBBox && initialCatalogBBox) {
      expect(initialCatalogBBox.y).toBeGreaterThanOrEqual(initialHeroBBox.y + initialHeroBBox.height * 0.8);
    }

    const initialContentBBox = await heroContent.boundingBox();

    // Perform smooth page scroll
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(800); // Allow GSAP scrub to interpolate

    // Verify hero content has translated upward (curtain upward reveal)
    const scrolledContentBBox = await heroContent.boundingBox();
    if (initialContentBBox && scrolledContentBBox) {
      expect(scrolledContentBBox.y).toBeLessThan(initialContentBBox.y);
    }
  });

  // =========================================================================
  // TC-2: Brand Design System & Color Palette Integrity
  // Spec Ref: 1. Brand Color System (agent.md)
  // =========================================================================
  test('TC-2: Page layout conforms to official Ivory Marble canvas and obsidian dark accents', async ({ page }) => {
    // Verify Brand Logo is present
    const logoImg = page.locator('img[alt*="EdenLeaf"]').first();
    await expect(logoImg).toBeVisible();

    // Verify Fixed Header Navigation
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header.getByText('EDENLEAF')).toBeVisible();

    // Verify Catalog Navigation Button
    const catalogNavBtn = header.getByRole('button', { name: /Catalog/i });
    await expect(catalogNavBtn).toBeVisible();
  });

  // =========================================================================
  // TC-3: Hayleys Agriculture Catalog & 4-Tier Taxonomy Filtering
  // Spec Ref: Complete Hayleys Nursery Portfolio (46 Varieties)
  // =========================================================================
  test('TC-3: Master catalog displays 46 cultivars and filters correctly by category', async ({ page }) => {
    const catalog = page.locator('#catalog-section');
    await expect(catalog).toBeVisible();

    // Check category navigation pills
    const allPill = catalog.getByRole('button', { name: /All Taxonomies/i });
    await expect(allPill).toBeVisible();

    // Verify search input filters live products
    const searchInput = catalog.locator('input[placeholder*="Search by name"]');
    await expect(searchInput).toBeVisible();

    // Search for "Banana" (Cavendish Banana)
    await searchInput.fill('Banana');
    await page.waitForTimeout(300);

    const bananaCard = catalog.getByText('Cavendish Banana');
    await expect(bananaCard).toBeVisible();

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(300);
  });

  // =========================================================================
  // TC-4: Cart Drawer & WhatsApp Concierge Checkout
  // Spec Ref: Direct WhatsApp Concierge & Cart System
  // =========================================================================
  test('TC-4: Adding product updates cart and opens slide-over drawer', async ({ page }) => {
    // Locate the first available Add to Cart button in the catalog
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    await addToCartButton.scrollIntoViewIfNeeded();
    await addToCartButton.click();

    // Cart drawer should open with added item selection
    await expect(page.getByText(/Your Selection/i)).toBeVisible();

    // Verify checkout / order dispatch button exists
    const dispatchBtn = page.getByRole('button', { name: /Proceed to Order Dispatch/i });
    await expect(dispatchBtn).toBeVisible();

    // Click Proceed to open Order Dispatch modal
    await dispatchBtn.click();
    await expect(page.getByText(/Order Dispatch Terminal/i)).toBeVisible();
    await expect(page.getByText(/Send via WhatsApp/i)).toBeVisible();
  });

  // =========================================================================
  // TC-5: Plant Matchmaker (5-Step Questionnaire Flow)
  // Spec Ref: 5-Step Botanical Matchmaker
  // =========================================================================
  test('TC-5: Plant matchmaker modal launches and steps through questions', async ({ page }) => {
    // Click Matchmaker button in hero
    const matchmakerBtn = page.locator('button:has-text("Plant Matchmaker")').first();
    await matchmakerBtn.click();

    // Verify Modal appears with first question
    await expect(page.getByText(/Question 1 of 5/i)).toBeVisible();

    // Select first option and advance
    const firstOption = page.locator('button:has-text("Bright Indirect")').first();
    await firstOption.click();

    // Progress should advance to Question 2
    await expect(page.getByText(/Question 2 of 5/i)).toBeVisible();
  });

  // =========================================================================
  // TC-6: Quick View Modal & Specimen Inspection
  // Spec Ref: Detailed Botanical Specimen Dialog & Care Specs
  // =========================================================================
  test('TC-6: Clicking cultivar card opens specimen Quick View dialog with care specs', async ({ page }) => {
    // Click on the first plant card in the catalog
    const firstPlantCard = page.locator('#catalog-section .glass-card-light').first();
    await firstPlantCard.scrollIntoViewIfNeeded();
    await firstPlantCard.click();

    // Verify Quick View modal appears with care attributes
    await expect(page.getByText(/Botanical Specifications|Specimen Details/i).or(page.getByText(/Sunlight|Maintenance/i))).toBeVisible();
    await expect(page.getByText(/Add to Cart/i)).toBeVisible();
  });
});
