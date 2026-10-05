const puppeteer = require('puppeteer-core');
const chromiumModule = require('@sparticuz/chromium');
const chromium = chromiumModule.default || chromiumModule;
const BASE = 'http://127.0.0.1:5173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const step = (label, ok, extra = '') => console.log(`${ok ? 'OK  ' : 'FAIL'} ${label}${extra ? ' → ' + extra : ''}`);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: await chromium.executablePath(),
    args: [...chromium.args, '--no-sandbox', '--disable-dev-shm-usage'],
    headless: true, defaultViewport: { width: 1440, height: 900 },
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  // 1) Mở ngân hàng bài tập và tìm kiếm
  await page.goto(`${BASE}/#/practice`, { waitUntil: 'networkidle2' });
  await wait(900);
  const totalRows = await page.$$eval('.rr-exercise', (n) => n.length);
  step('danh sách bài tập phân trang (12 dòng)', totalRows === 12, `${totalRows} dòng`);

  await page.type('#rrExerciseSearch', 'pumping');
  await wait(600);
  const filtered = await page.$$eval('.rr-exercise', (n) => n.length);
  step('tìm kiếm "pumping" lọc được kết quả', filtered > 0 && filtered < 200, `${filtered} kết quả`);

  await page.click('.rr-filter:nth-child(2)');
  await wait(500);
  const afterFilter = await page.$eval('.rr-filter[aria-pressed="true"]', (el) => el.textContent.replace(/\s+/g, ' ').trim());
  step('bộ lọc mức hoạt động', afterFilter.includes('01'), afterFilter);

  // 2) Mở bài tập, đánh dấu đã ôn (đặt lại bộ lọc trước cho chắc chắn)
  await page.click('.rr-filter:first-child');            // "Tất cả"
  await page.evaluate(() => {   // xoá ô tìm kiếm theo cách React hiểu được
    const input = document.querySelector('#rrExerciseSearch');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await wait(700);
  const resetRows = await page.$$eval('.rr-exercise', (n) => n.length);
  step('bỏ lọc trở lại đủ 12 dòng', resetRows === 12, `${resetRows} dòng`);
  await page.click('.rr-exercise');
  await wait(900);
  const modalTitle = await page.$eval('.rr-modal .rr-h2', (el) => el.textContent.slice(0, 40));
  step('modal bài tập mở với tiêu đề', modalTitle.length > 5, modalTitle);

  const hasSolution = await page.$$eval('.rr-answer .rr-prose', (n) => n.length > 0);
  step('lời giải markdown render', hasSolution);

  const markBtn = await page.$$('.rr-modal-foot .rr-btn');
  await markBtn[markBtn.length - 1].click();
  await wait(700);
  const toast = await page.$eval('.rr-toast', (el) => el.className.includes('is-visible') + '|' + el.textContent.trim());
  step('toast xác nhận đánh dấu', toast.startsWith('true'), toast.slice(0, 60));

  await page.click('.rr-modal-close');
  await wait(700);
  const chip = await page.$eval('.rr-nav-count b', (el) => el.textContent);
  step('bộ đếm trên thanh điều hướng cập nhật', chip === '001', chip);

  // 3) Bền vững sau khi tải lại
  await page.reload({ waitUntil: 'networkidle2' });
  await wait(800);
  const chipAfter = await page.$eval('.rr-nav-count b', (el) => el.textContent);
  step('tiến độ lưu vào localStorage', chipAfter === '001', chipAfter);

  // 4) Tiến độ + quiz
  await page.goto(`${BASE}/#/progress`, { waitUntil: 'networkidle2' });
  await wait(800);
  const percent = await page.$eval('.rr-progress-percent', (el) => el.textContent.replace(/\s/g, ''));
  step('trang tiến độ phản ánh số bài', percent.startsWith('1%') || percent.startsWith('0%'), percent);

  await page.goto(`${BASE}/#/overview`, { waitUntil: 'networkidle2' });
  await wait(800);
  await page.evaluate(() => document.querySelector('.rr-hero-cta .rr-btn:last-child').click());
  await wait(900);
  const optionCount = await page.$$eval('.rr-quiz-option', (n) => n.length);
  step('mini quiz mở với 4 đáp án', optionCount === 4, `${optionCount} đáp án`);
  await page.click('.rr-quiz-option');
  await wait(500);
  const answered = await page.$eval('.rr-callout', (el) => el.textContent.slice(0, 30));
  step('phản hồi sau khi chọn đáp án', answered.length > 3, answered);

  // 5) Điều hướng bàn phím ⌘K
  await page.keyboard.down('Control'); await page.keyboard.press('k'); await page.keyboard.up('Control');
  await wait(700);
  const hash = await page.evaluate(() => window.location.hash);
  step('phím tắt Ctrl/⌘+K mở ngân hàng bài tập', hash === '#/practice', hash);

  // 6) Điều hướng menu toàn màn hình
  await page.click('.rr-icon-btn--burger');
  await wait(500);
  const menuItems = await page.$$eval('.rr-menu-item', (n) => n.length);
  step('menu toàn màn hình có 5 mục', menuItems === 5, `${menuItems} mục`);

  // 7) Sổ tay: tìm kiếm
  await page.goto(`${BASE}/#/notes`, { waitUntil: 'networkidle2' });
  await wait(700);
  await page.type('.rr-search--compact input', 'pumping');
  await wait(500);
  const notesVisible = await page.$$eval('.rr-note', (n) => n.length);
  step('tìm kiếm trong sổ tay', notesVisible === 1, `${notesVisible} thẻ`);

  console.log(errors.length ? `LỖI RUNTIME:\n${errors.slice(0, 5).join('\n')}` : 'không có lỗi runtime');
  await browser.close();
})();
