import { test, expect } from '@playwright/test';

test.describe('Open Campus - Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/en');
    
    // Check that the hero title is visible
    await expect(page.getByRole('heading', { name: /Redefining Learning/i })).toBeVisible();
    
    // Check CTA buttons are present
    await expect(page.getByRole('link', { name: /Explore Fellows/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Browse Courses/i })).toBeVisible();
  });

  test('navigation menu works', async ({ page }) => {
    await page.goto('/en');
    
    // Click on Fellows link
    await page.getByRole('link', { name: /Fellows/i }).first().click();
    await expect(page).toHaveURL(/.*\/fellows/);
    
    // Check Fellows page loaded
    await expect(page.getByRole('heading', { name: /AI Fellows/i })).toBeVisible();
  });

  test('language switcher works', async ({ page }) => {
    await page.goto('/en');
    
    // Find and click language switcher
    const langButton = page.getByRole('button', { name: /en/i });
    await langButton.click();
    
    // Check URL changed to Turkish
    await expect(page).toHaveURL(/.*\/tr/);
  });

  test('newsletter form validation', async ({ page }) => {
    await page.goto('/en');
    
    // Find newsletter form
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const submitButton = page.getByRole('button', { name: /subscribe/i });
    
    // Try submitting empty form - should validate
    await emailInput.fill('');
    await submitButton.click();
    
    // HTML5 validation should prevent submission
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
    
    // Submit valid email
    await emailInput.fill('test@example.com');
    await submitButton.click();
    
    // Should show success message
    await expect(page.getByText(/thanks for subscribing/i)).toBeVisible({ timeout: 5000 });
  });

  test('fellows page displays cards', async ({ page }) => {
    await page.goto('/en/fellows');
    
    // Check that fellows cards are displayed
    await expect(page.getByText(/Math Fellow/i)).toBeVisible();
    
    // Click on a fellow card
    await page.getByRole('link', { name: /view details/i }).first().click();
    
    // Check fellow detail page loaded
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('courses page loads', async ({ page }) => {
    await page.goto('/en/courses');
    
    await expect(page.getByRole('heading', { name: /Courses/i })).toBeVisible();
    await expect(page.getByText(/Calculus/i)).toBeVisible();
  });

  test('contact form exists', async ({ page }) => {
    await page.goto('/en/contact');
    
    await expect(page.getByRole('heading', { name: /Contact/i })).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
  });

  test('mobile navigation works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    
    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /toggle menu/i });
    await menuButton.click();
    
    // Check navigation is visible
    await expect(page.getByRole('link', { name: /Vision/i })).toBeVisible();
  });
});
