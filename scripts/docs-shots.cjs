const puppeteer = require('puppeteer-core');
const chromiumModule = require('@sparticuz/chromium');
const chromium = chromiumModule.default || chromiumModule;
const BASE = 'http://127.0.0.1:5173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: await chromium.executablePath(),
    args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
    headless: true, defaultViewport: { width: 1280, height: 900 },
  });
  const page = await browser.newPage();
  const shoot = async (view, file) => {
    await page.goto(`${BASE}/#/${view}`, { waitUntil: 'networkidle2' });
    await wait(800);
    await page.screenshot({ path: `docs/screens/${file}.jpg`, type: 'jpeg', quality: 80, fullPage: true });
    console.log('→', file);
  };
  await shoot('overview', 'desktop-overview');
  await shoot('roadmap', 'desktop-roadmap');
  await shoot('practice', 'desktop-practice');
  await shoot('notes', 'desktop-notes');
  await shoot('progress', 'desktop-progress');

  // modal bài tập
  await page.goto(`${BASE}/#/practice`, { waitUntil: 'networkidle2' });
  await wait(800);
  await page.click('.rr-exercise');
  await wait(900);
  await page.screenshot({ path: 'docs/screens/modal-exercise.jpg', type: 'jpeg', quality: 82 });
  console.log('→ modal-exercise');

  // mobile
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await shoot('overview', 'mobile-overview');
  await browser.close();
})();
