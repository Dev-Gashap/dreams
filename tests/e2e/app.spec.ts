import { test, expect } from '@playwright/test';

// ============================================================
// Dreams E2E Test Suite
// ============================================================

test.describe('Landing Page', () => {
  test('should load the landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Dreams/);
    await expect(page.locator('text=Get Critical Tools')).toBeVisible();
  });

  test('should show features section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Sourcing Engine')).toBeVisible();
    await expect(page.locator('text=Fulfillment Engine')).toBeVisible();
    await expect(page.locator('text=Dispatch Engine')).toBeVisible();
  });

  test('should show pricing section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Starter')).toBeVisible();
    await expect(page.locator('text=Professional')).toBeVisible();
    await expect(page.locator('text=Enterprise')).toBeVisible();
  });

  test('should navigate to login', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Sign In');
    await expect(page).toHaveURL(/login/);
  });

  test('should navigate to register', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Get Started');
    await expect(page).toHaveURL(/register/);
  });
});

test.describe('Authentication', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=Welcome back')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show register form with account type selection', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('text=Choose your account type')).toBeVisible();
    await expect(page.locator('text=Personal')).toBeVisible();
    await expect(page.locator('text=Business')).toBeVisible();
    await expect(page.locator('text=Vendor')).toBeVisible();
  });

  test('should navigate to step 2 on register', async ({ page }) => {
    await page.goto('/register');
    await page.click('button:has-text("Continue")');
    await expect(page.locator('text=Create your account')).toBeVisible();
  });
});

test.describe('Dashboard', () => {
  test('should load the dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('text=Recent Orders')).toBeVisible();
  });

  test('should show stats cards', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('text=Active Orders')).toBeVisible();
    await expect(page.locator('text=Avg Delivery Time')).toBeVisible();
  });

  test('should navigate to marketplace', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=Browse Marketplace');
    await expect(page).toHaveURL(/marketplace/);
  });
});

test.describe('Marketplace', () => {
  test('should load marketplace with products', async ({ page }) => {
    await page.goto('/marketplace');
    await expect(page.locator('text=Marketplace')).toBeVisible();
    await expect(page.locator('text=products found')).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    await page.goto('/marketplace');
    await page.click('text=Power Tools');
    // Should filter the results
    await expect(page.locator('text=products found')).toBeVisible();
  });

  test('should toggle urgent filter', async ({ page }) => {
    await page.goto('/marketplace');
    await page.click('button:has-text("Urgent")');
    await expect(page.locator('text=Urgent Only')).toBeVisible();
  });

  test('should open product quick view', async ({ page }) => {
    await page.goto('/marketplace');
    // Hover over first product to reveal Quick View
    const firstProduct = page.locator('[class*="group"]').first();
    await firstProduct.hover();
  });
});

test.describe('Orders', () => {
  test('should load orders page', async ({ page }) => {
    await page.goto('/orders');
    await expect(page.locator('text=Orders')).toBeVisible();
  });

  test('should show order tabs', async ({ page }) => {
    await page.goto('/orders');
    await expect(page.locator('text=All Orders')).toBeVisible();
    await expect(page.locator('text=Active')).toBeVisible();
    await expect(page.locator('text=Delivered')).toBeVisible();
  });
});

test.describe('Tracking', () => {
  test('should show live tracking page', async ({ page }) => {
    await page.goto('/tracking');
    await expect(page.locator('text=Live Tracking')).toBeVisible();
  });
});

test.describe('Admin', () => {
  test('should load admin dashboard', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('text=Platform Overview')).toBeVisible();
    await expect(page.locator('text=All Systems Operational')).toBeVisible();
  });

  test('should load admin users page', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.locator('text=User Management')).toBeVisible();
  });

  test('should load admin vendors page', async ({ page }) => {
    await page.goto('/admin/vendors');
    await expect(page.locator('text=Vendor Management')).toBeVisible();
  });

  test('should load admin analytics page', async ({ page }) => {
    await page.goto('/admin/analytics');
    await expect(page.locator('text=Platform Analytics')).toBeVisible();
  });
});

test.describe('Help', () => {
  test('should load help page', async ({ page }) => {
    await page.goto('/help');
    await expect(page.locator('text=Help & Support')).toBeVisible();
    await expect(page.locator('text=Frequently Asked Questions')).toBeVisible();
  });

  test('should expand FAQ items', async ({ page }) => {
    await page.goto('/help');
    await page.click('text=How fast can I get a delivery?');
    await expect(page.locator('text=Critical orders can arrive')).toBeVisible();
  });
});

test.describe('Responsive', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('text=Dreams')).toBeVisible();
    await expect(page.locator('text=Get Critical Tools')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard');
    await expect(page.locator('text=Recent Orders')).toBeVisible();
  });
});
