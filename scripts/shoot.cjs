/**
 * Chụp ảnh giao diện phục vụ việc dò khớp thiết kế.
 *
 * Dùng chromium đi kèm npm package `@sparticuz/chromium` (sandbox không tải được Chrome
 * từ CDN của Playwright/Puppeteer) cùng thư viện stub NSS/NSPR tự dựng.
 *
 *   node scripts/shoot.cjs all 1440 900            # ảnh toàn trang từng màn hình
 *   node scripts/shoot.cjs overview 1440 900 .rr-hero   # ảnh cận cảnh theo selector
 */
const puppeteer = require('puppeteer-core');
const chromiumModule = require('@sparticuz/chromium');
const chromium = chromiumModule.default || chromiumModule;
const fs = require('node:fs');

const OUT_DIR = process.env.SHOT_DIR || '/tmp/shots';
const BASE = process.env.SHOT_BASE || 'http://127.0.0.1:5173';
const VIEWS = ['overview', 'roadmap', 'practice', 'notes', 'progress'];

(async () => {
  const requested = (process.argv[2] || 'all').split(',');
  const views = requested[0] === 'all' ? VIEWS : requested;
  const width = Number(process.argv[3] || 1440);
  const height = Number(process.argv[4] || 900);
  const selector = process.argv[5] || '';
  const clickScript = process.argv[6] || '';   // ví dụ: "document.querySelector('.rr-hero-mail').click()"
  const suffix = selector ? selector.replace(/[^a-z0-9-]/gi, '_') : '';

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: await chromium.executablePath(),
    args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
    headless: true,
    defaultViewport: { width, height, deviceScaleFactor: 1 },
  });

  const page = await browser.newPage();
  const problems = [];
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`console: ${message.text().slice(0, 220)}`);
  });
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message.slice(0, 220)}`));

  for (const view of views) {
    await page.goto(`${BASE}/#/${view}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((resolve) => setTimeout(resolve, 700));
    if (clickScript) {
      await page.evaluate(clickScript);
      await new Promise((resolve) => setTimeout(resolve, 900));
    }
    if (selector) {
      const node = await page.$(selector);
      if (!node) { console.log(`không thấy ${selector} trong #/${view}`); continue; }
      const file = `${OUT_DIR}/${view}-${width}${suffix}.png`;
      await node.screenshot({ path: file });
      console.log('shot →', file);
    } else {
      const file = `${OUT_DIR}/${view}-${width}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log('shot →', file);
    }
  }

  console.log(problems.length ? `VẤN ĐỀ:\n${problems.join('\n')}` : 'không có lỗi console');
  await browser.close();
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
