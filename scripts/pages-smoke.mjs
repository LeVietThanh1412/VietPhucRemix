import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173/VietPhucRemix/';
const browser = await chromium.launch({
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  headless: true,
  args: ['--no-sandbox'],
});
const context = await browser.newContext({ acceptDownloads: true });
const page = await context.newPage();
const errors = [];
const apiRequests = [];
const failedAssets = [];
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => {
  if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url());
});
page.on('response', response => {
  if (new URL(response.url()).pathname.includes('/assets/') && !response.ok()) failedAssets.push(response.url());
});
// Keep this test deterministic and prove the packaged font fallback works.
await page.route('https://api.open-meteo.com/**', route => route.abort());
await page.route('https://fonts.googleapis.com/**', route => route.abort());
await page.route('https://fonts.gstatic.com/**', route => route.abort());

try {
  await page.goto(new URL('?look=1-125010-04-3-2-1', base).href);
  await page.getByRole('button', { name: '2. Màu Sắc', exact: true }).click();
  await page.getByRole('textbox', { name: 'Mã màu Hex' }).fill('8B1E3F');
  await page.getByRole('textbox', { name: 'Mã màu Hex' }).press('Enter');
  await page.getByRole('button', { name: 'Lưu look', exact: true }).click();
  await page.getByRole('button', { name: 'So sánh với look hiện tại', exact: true }).click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');

  const assistant = page.locator('#ai-stylist');
  assert.match(await assistant.innerText(), /Chế độ tri thức di sản/);
  assert.doesNotMatch(await assistant.innerText(), /Gemini AI/);
  await assistant.getByRole('textbox').fill('Gợi ý phối đồ cho dịp dạo phố');
  await assistant.getByRole('button', { name: 'Tư vấn', exact: true }).click();
  await assistant.getByText('Lời khuyên từ Stylist Di Sản:', { exact: true }).waitFor();

  await page.getByRole('button', { name: 'Xuất Lookbook', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('img[alt="Xem trước lookbook"]')?.naturalWidth === 1080);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Tải ảnh PNG', exact: true }).click(),
  ]);
  assert.equal(await download.failure(), null);

  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Sao chép link', exact: true }).click();
  const sharedUrl = new URL(await page.evaluate(() => navigator.clipboard.readText()));
  assert.equal(sharedUrl.origin, new URL(base).origin);
  assert.equal(sharedUrl.pathname, new URL(base).pathname);
  assert.ok(sharedUrl.searchParams.get('look'));

  const receiverContext = await browser.newContext();
  const receiver = await receiverContext.newPage();
  await receiver.route('https://api.open-meteo.com/**', route => route.abort());
  await receiver.goto(sharedUrl.href);
  await receiver.getByRole('button', { name: '2. Màu Sắc', exact: true }).click();
  assert.equal(await receiver.getByRole('textbox', { name: 'Mã màu Hex' }).inputValue(), '8B1E3F');
  await receiverContext.close();

  assert.deepEqual(errors, []);
  assert.deepEqual(failedAssets, []);
  assert.deepEqual(apiRequests, []);
  console.log('Pages passed: subpath assets, saved looks, lazy comparison/lookbook, PNG export, local advice without API requests, shared look in a fresh browser.');
} finally {
  await context.close();
  await browser.close();
}
