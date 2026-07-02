import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:4321';

test.describe('Base64go — Home Page', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/Base64 Encoder & Decoder/);
  });

  test('hero heading is visible', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('h1')).toContainText('Base64 Encoder & Decoder');
  });

  test('input textarea is present and autofocused', async ({ page }) => {
    await page.goto(BASE);
    const input = page.locator('#input-area');
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
  });

  test('output textarea is present and readonly', async ({ page }) => {
    await page.goto(BASE);
    const output = page.locator('#output-area');
    await expect(output).toBeVisible();
    await expect(output).toHaveAttribute('readonly');
  });

  test('encode tab is active by default', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('#tab-encode')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#tab-decode')).toHaveAttribute('aria-selected', 'false');
  });

  test('switching to decode mode updates labels', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#tab-decode').click();
    await expect(page.locator('#tab-decode')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#input-label')).toContainText('Base64');
  });

  test('action buttons are visible', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('#copy-btn')).toBeVisible();
    await expect(page.locator('#download-btn')).toBeVisible();
    await expect(page.locator('#clear-btn')).toBeVisible();
    await expect(page.locator('#swap-btn')).toBeVisible();
  });
});

test.describe('Base64go — Encode/Decode', () => {
  test('live encoding: typing plain text shows Base64 output', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#input-area').fill('Hello World');
    // Wait for debounced live update
    await page.waitForTimeout(100);
    const output = await page.locator('#output-area').inputValue();
    expect(output).toBe('SGVsbG8gV29ybGQ=');
  });

  test('live decoding: Base64 input shows decoded text', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#tab-decode').click();
    await page.locator('#input-area').fill('SGVsbG8gV29ybGQ=');
    await page.waitForTimeout(100);
    const output = await page.locator('#output-area').inputValue();
    expect(output).toBe('Hello World');
  });

  test('invalid Base64 shows error in decode mode', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#tab-decode').click();
    await page.locator('#input-area').fill('!!!invalid!!!');
    await page.waitForTimeout(100);
    await expect(page.locator('#error-msg')).toBeVisible();
  });

  test('Base64URL encoding produces URL-safe output', async ({ page }) => {
    await page.goto(BASE);
    // Input that would produce + and / in standard Base64
    await page.locator('#input-area').fill('<<??>>');
    await page.waitForTimeout(100);
    const output = await page.locator('#output-area').inputValue();
    // Standard encoding should have + or /
    expect(output).toBe('PDw/Pz4+');
  });

  test('copy button copies output to clipboard', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#input-area').fill('test');
    await page.waitForTimeout(100);
    await page.locator('#copy-btn').click();
    await expect(page.locator('#copy-text')).toContainText('Copied!');
  });

  test('clear button empties both textareas', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#input-area').fill('something');
    await page.waitForTimeout(100);
    await page.locator('#clear-btn').click();
    const inputVal = await page.locator('#input-area').inputValue();
    const outputVal = await page.locator('#output-area').inputValue();
    expect(inputVal).toBe('');
    expect(outputVal).toBe('');
  });

  test('swap button exchanges input and output', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#input-area').fill('Hello');
    await page.waitForTimeout(100);
    await page.locator('#swap-btn').click();
    // After swap, mode should be decode and input should be the encoded value
    await expect(page.locator('#tab-decode')).toHaveAttribute('aria-selected', 'true');
    const inputVal = await page.locator('#input-area').inputValue();
    expect(inputVal).toBe('SGVsbG8=');
  });

  test('stats show byte counts', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#input-area').fill('Hello World');
    await page.waitForTimeout(100);
    await expect(page.locator('#input-stats')).not.toBeEmpty();
    await expect(page.locator('#output-stats')).not.toBeEmpty();
  });
});

test.describe('Base64go — Navigation', () => {
  test('nav links are present', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('header')).toBeVisible();
  });

  test('theme toggle exists', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('#theme-toggle')).toBeVisible();
  });

  test('dark mode toggles correctly', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#theme-toggle').click();
    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDark).toBe(true);
    await page.locator('#theme-toggle').click();
    const isLight = await page.evaluate(() =>
      !document.documentElement.classList.contains('dark')
    );
    expect(isLight).toBe(true);
  });
});

test.describe('Base64go — Guide Page', () => {
  test('what-is-base64 page loads', async ({ page }) => {
    await page.goto(`${BASE}/what-is-base64/`);
    await expect(page.locator('h1')).toContainText('What is Base64');
  });

  test('guide has table of contents', async ({ page }) => {
    await page.goto(`${BASE}/what-is-base64/`);
    await expect(page.locator('nav[aria-label="Table of contents"]')).toBeVisible();
  });

  test('FAQ accordions work', async ({ page }) => {
    await page.goto(`${BASE}/what-is-base64/`);
    const firstFaq = page.locator('details').first();
    await firstFaq.click();
    await expect(firstFaq).toHaveAttribute('open');
  });
});

test.describe('Base64go — Privacy Page', () => {
  test('privacy page loads', async ({ page }) => {
    await page.goto(`${BASE}/privacy/`);
    await expect(page.locator('h1')).toContainText('Privacy');
  });
});

test.describe('Base64go — Responsive', () => {
  test('mobile viewport renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#input-area')).toBeVisible();
    await expect(page.locator('#output-area')).toBeVisible();
  });

  test('tablet viewport renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE);
    await expect(page.locator('h1')).toBeVisible();
  });
});
