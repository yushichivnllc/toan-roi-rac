import { useEffect, useState } from 'react';
import { useProgress, todayKey, TOTAL_EXERCISES } from '../../state/progress.jsx';
import { useUi } from '../../state/ui.jsx';
import { getExerciseCatalog } from '../../api/exercises.js';
import { days } from '../../data/days.js';
import { quizBank } from '../../data/quizBank.js';
import { hero, editionLine, tickerItems, metricCards, topics, viewLabels } from '../../data/overview.js';
import { Barcode, Button, Chip, CircleArrows, CountUp, Icon, Sparkle, Stamp } from '../../components/ui.jsx';

const todayLabel = () => new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })
  .format(new Date()).toLocaleUpperCase('vi-VN');

const shortDate = () => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());

/** Tổng quan — bố cục collage theo ảnh tham chiếu: panel "học hôm nay" bên trái,
 *  khối tiêu đề khổng lồ ở giữa, cụm số liệu bên phải, thẻ thư viện + vé xé ở dưới. */
export function OverviewView() {
  const { state, solvedCount, solvedPercent, nextDay, answerChallenge } = useProgress();
  const { go, openLesson, openQuiz } = useUi();
  const [total, setTotal] = useState(TOTAL_EXERCISES);

  useEffect(() => {
    let alive = true;
    getExerciseCatalog().then((catalog) => { if (alive) setTotal(catalog.length); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const challenge = quizBank[0];
  const answeredToday = state.challengeDate === todayKey() && Number.isInteger(state.challengeAnswer);
  const remaining = Math.max(0, total - solvedCount);

  return (
    <div className="rr-frame rr-ov">
      <div className="rr-ov-edition">
        <Barcode seed={`rr-${editionLine.brand}`} className="rr-barcode--sm" />
        <CircleArrows />
        <span className="rr-label rr-ov-ready">BẠN SẴN SÀNG CHƯA? · KHÔNG GIAN HỌC TẬP KHÔNG GIỚI HẠN</span>
        <span className="rr-label rr-ov-edition-right">{editionLine.volume}</span>
      </div>

      {/* ------------------------- HERO COLLAGE ------------------------- */}
      <section className="rr-hero" aria-labelledby="rrHeroTitle">
        {/* Panel "học hôm nay" — kiểu Meet Me trong ảnh */}
        <article className="rr-meet">
          <header className="rr-meet-head">
            <span className="rr-label">HỌC HÔM NAY</span>
            <span className="rr-meet-time">{shortDate()}</span>
          </header>
          <h2 className="rr-meet-title">Ngày<br />{String(nextDay.id).padStart(2, '0')}</h2>
          <p className="rr-meet-topic">{nextDay.title}</p>
          <p className="rr-mono rr-dim" style={{ fontSize: 'var(--fs-label)' }}>
            {nextDay.range} · {nextDay.time}
          </p>

          <div className="rr-meet-progress">
            <div className="rr-row-between">
              <span className="rr-label">TIẾN ĐỘ</span>
              <span className="rr-mono">{solvedPercent}%</span>
            </div>
            <span className="rr-bar"><span style={{ width: `${Math.max(2, solvedPercent)}%` }} /></span>
          </div>

          <div className="rr-inline">
            <Button tone="solid" size="sm" onClick={() => openLesson(nextDay.id)}>Vào bài học</Button>
            <Button size="sm" onClick={() => go('roadmap')}>Lộ trình</Button>
          </div>
          <span className="rr-meet-sticker" aria-hidden="true">R</span>
        </article>

        {/* Chữ dọc viền ngoài — như chữ VESPERBELL trong ảnh */}
        <span className="rr-vertical rr-vertical--outline rr-hero-vertical" aria-hidden="true">
          RỜI RẠC · ELECTRIC STUDY STUDIO
        </span>

        {/* Khối tiêu đề khổng lồ — 歌枠 / 雑談 của poster */}
        <div className="rr-hero-title">
          <span className="rr-hero-chip">{hero.titleEm.replace('.', '')}</span>
          <h1 className="rr-display rr-hero-line" id="rrHeroTitle">{hero.titleTop}</h1>
          <h2 className="rr-display rr-hero-line">RỜI RẠC.</h2>
          <p className="rr-hero-subline">HỌC <b>✦</b> LUYỆN <b>✦</b> THỰC CHIẾN</p>
          <Sparkle className="rr-hero-spark rr-hero-spark--a" />
          <Sparkle className="rr-hero-spark rr-hero-spark--b" />
          <Sparkle className="rr-hero-spark rr-hero-spark--c" />
          <p className="rr-hero-manifesto">
            {hero.manifesto.map((line) => <span key={line}>{line}</span>)}
          </p>
          <div className="rr-hero-strip">
            <div>
              <span className="rr-zigzag" aria-hidden="true" />
              <p className="rr-mono rr-hero-micro">
                HƯỚNG TỚI SÂN KHẤU MỚI — GIẢI TRỌN 200 BÀI TẬP CHƯƠNG 3. MẮT DÁN VÀO MỤC TIÊU!
              </p>
            </div>
            <span className="rr-lines" aria-hidden="true" />
          </div>
        </div>

        {/* Cụm số liệu — kiểu "004 → / 03" */}
        <aside className="rr-hero-stats" aria-label="Quy mô nội dung">
          <div className="rr-hero-stat">
            <span className="rr-hero-num"><CountUp value={total} /></span>
            <span className="rr-arrow" aria-hidden="true" />
            <span className="rr-label">BÀI GIẢI</span>
          </div>
          <div className="rr-hero-stat rr-hero-stat--sub">
            <span className="rr-hero-num rr-hero-num--outline">{String(days.length).padStart(2, '0')}</span>
            <span className="rr-label">NGÀY LỘ TRÌNH</span>
          </div>
          <button type="button" className="rr-hero-mail" onClick={() => go('practice')}>
            <Icon.mail />
            <span>Còn <b>{remaining}</b> bài chưa mở</span>
            <span className="rr-arrow rr-arrow--side" aria-hidden="true" />
          </button>
        </aside>

        <p className="rr-lead rr-hero-lede">{hero.lede}</p>

        <div className="rr-inline rr-hero-cta">
          <Button tone="accent" onClick={() => openLesson(nextDay.id)}>
            Bắt đầu ôn tập <span aria-hidden="true">↗</span>
          </Button>
          <Button tone="outline" onClick={openQuiz}><Icon.play /> Mini quiz 5 câu</Button>
        </div>

        <ul className="rr-hero-badges">
          {hero.badges.map((badge) => (
            <li key={badge.label}>
              <b>{badge.value}</b>
              <span className="rr-label">{badge.label}</span>
            </li>
          ))}
        </ul>

        {/* Thẻ thư viện + chồng vé — mảng collage dưới cùng của ảnh */}
        <article className="rr-library">
          <span className="rr-library-seal" aria-hidden="true">03<small>CHƯƠNG</small></span>
          <div className="rr-row-between">
            <span className="rr-label rr-label--on-dark">THƯ VIỆN BÀI TẬP</span>
            <span className="rr-label rr-label--on-dark">MB · CM</span>
          </div>
          <Barcode seed={`roi-rac-${total}`} />
          <div className="rr-library-meta">
            <span className="rr-qr" aria-hidden="true"><i /></span>
            <div>
              <strong>{total} BÀI · 5 MỨC</strong>
              <span className="rr-label rr-label--on-dark">README.MD · CHƯƠNG 03 · SS20</span>
            </div>
          </div>
        </article>

        <div className="rr-tickets">
          {[
            { id: 'quiz', kind: 'VÉ 01', title: 'Mini quiz', note: '5 câu · 1 phút', action: openQuiz, stamp: '✳' },
            { id: 'roadmap', kind: 'VÉ 02', title: 'Lộ trình 7 ngày', note: '2–3 giờ/ngày', action: () => go('roadmap'), stamp: '07' },
            { id: 'bank', kind: 'VÉ 03', title: 'Ngân hàng 200 bài', note: 'Tìm & lọc theo mức', action: () => go('practice'), stamp: '200' },
          ].map((ticket) => (
            <button key={ticket.id} type="button" className="rr-ticket-card" onClick={ticket.action}>
              <div className="rr-row-between">
                <span className="rr-label">{ticket.kind}</span>
                <span className="rr-ticket-stamp">{ticket.stamp}</span>
              </div>
              <strong className="rr-ticket-title">{ticket.title}</strong>
              <span className="rr-mono rr-dim" style={{ fontSize: 'var(--fs-label)' }}>{ticket.note}</span>
              <span className="rr-ticket-perf" aria-hidden="true" />
              <span className="rr-ticket-go">MỞ <b aria-hidden="true">↗</b></span>
            </button>
          ))}
        </div>
      </section>

      {/* --------------------------- CHỈ SỐ --------------------------- */}
      <section className="rr-metrics" aria-label="Tổng quan tài liệu">
        {metricCards.map((card) => (
          <article className="rr-metric" key={card.id}>
            <span className="rr-metric-index" aria-hidden="true">✳</span>
            <span className="rr-label">{card.overline}</span>
            <p className="rr-metric-value">
              <CountUp value={card.value} pad={card.pad || 0} />
            </p>
            <p className="rr-metric-unit">{card.unit}</p>
            <p className="rr-label rr-dim">{card.note}</p>
          </article>
        ))}
      </section>

      {/* --------------------------- TICKER --------------------------- */}
      <div className="rr-ticker" aria-hidden="true">
        <div className="rr-ticker-track">
          {[0, 1].map((copy) => (
            <span className="rr-ticker-group" key={copy}>
              {tickerItems.map((item, index) => (
                <span key={`${copy}-${item}`}>
                  {item}
                  <b>{index % 2 === 0 ? '✳' : '→'}</b>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ------------------ LỘ TRÌNH NGẮN + THỬ THÁCH ------------------ */}
      <section className="rr-dash">
        <article className="rr-panel rr-panel--raised rr-dash-roadmap">
          <div className="rr-panel-head">
            <div>
              <span className="rr-label">LỘ TRÌNH HỌC</span>
              <h2 className="rr-h2" style={{ marginTop: 6 }}>Bảy ngày, vững một chương.</h2>
            </div>
            <Button size="sm" onClick={() => go('roadmap')}>Xem toàn bộ</Button>
          </div>
          <ul className="rr-preview-days">
            {days.slice(0, 3).map((day) => {
              const done = state.completedDays.includes(day.id);
              const current = !done && day.id === nextDay.id;
              return (
                <li key={day.id}>
                  <button type="button" className={`rr-preview-day${done ? ' is-done' : ''}${current ? ' is-current' : ''}`} onClick={() => openLesson(day.id)}>
                    <span className="rr-preview-no">{done ? '✓' : String(day.id).padStart(2, '0')}</span>
                    <span className="rr-preview-copy">
                      <strong>{day.title}</strong>
                      <span className="rr-mono rr-dim" style={{ fontSize: 'var(--fs-label)' }}>{day.subtitle}</span>
                    </span>
                    <span className="rr-label">{done ? 'XONG' : current ? 'ĐANG HỌC' : day.time}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="rr-row-between rr-dash-foot">
            <span className="rr-label">GỢI Ý HÔM NAY · {nextDay.title.toLocaleUpperCase('vi-VN')}</span>
            <button type="button" className="rr-mini-link" onClick={() => openLesson(nextDay.id)}>Mở ↗</button>
          </div>
        </article>

        <article className="rr-panel rr-panel--block rr-dash-challenge">
          <div className="rr-panel-head">
            <Chip tone="on-dark">✳ THỬ THÁCH HÔM NAY</Chip>
            <span className="rr-label rr-label--on-dark"><Icon.clock /> 1 PHÚT</span>
          </div>
          <h2 className="rr-h3">{challenge.question}</h2>
          <div className="rr-challenge-options">
            {challenge.options.map((option, index) => {
              const isAnswer = index === challenge.answer;
              const isPicked = answeredToday && index === state.challengeAnswer;
              const classes = ['rr-challenge-option'];
              if (answeredToday && isAnswer) classes.push('is-correct');
              if (isPicked && !isAnswer) classes.push('is-wrong');
              return (
                <button
                  key={option}
                  type="button"
                  className={classes.join(' ')}
                  disabled={answeredToday}
                  onClick={() => answerChallenge(index)}
                >
                  <span className="rr-challenge-letter">{String.fromCharCode(65 + index)}</span>
                  {option}
                </button>
              );
            })}
          </div>
          {answeredToday && (
            <p className="rr-callout rr-callout--on-dark">
              <b aria-hidden="true">{state.challengeCorrect ? '✓' : '!'}</b>
              <span>{state.challengeCorrect ? 'Chính xác! Mọi ký tự phải thuộc bảng chữ cái Σ.' : 'Chưa đúng — chữ c không nằm trong Σ = {a, b}.'}</span>
            </p>
          )}
          <div className="rr-row-between rr-dash-foot">
            <span className="rr-label rr-label--on-dark">ĐÚNG MỘT CÂU NHỎ, TIẾN MỘT BƯỚC DÀI.</span>
            <button type="button" className="rr-mini-link rr-mini-link--on-dark" onClick={openQuiz}>Làm quiz ↗</button>
          </div>
        </article>
      </section>

      {/* --------------------------- CHỦ ĐỀ --------------------------- */}
      <section className="rr-topics">
        <div className="rr-row-between">
          <div>
            <span className="rr-label">BẢN ĐỒ KIẾN THỨC</span>
            <h2 className="rr-h2" style={{ marginTop: 6 }}>Chọn một chủ đề để bắt đầu.</h2>
          </div>
          <Button size="sm" onClick={() => go('notes')}>Mở sổ tay</Button>
        </div>
        <div className="rr-grid rr-grid--4 rr-topic-grid">
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className={`rr-topic rr-topic--${topic.tone}`}
              onClick={() => openLesson(topic.dayId)}
            >
              <span className="rr-label">{topic.number}</span>
              <span className="rr-topic-symbol" aria-hidden="true">{topic.symbol}</span>
              <strong className="rr-topic-title">{topic.title}</strong>
              <span className="rr-topic-desc">{topic.description}</span>
              <span className="rr-ticket-perf" aria-hidden="true" />
              <span className="rr-row-between rr-topic-foot">
                <span className="rr-label">{topic.count} BÀI TẬP</span>
                <b aria-hidden="true">↗</b>
              </span>
            </button>
          ))}
        </div>
      </section>

      <p className="rr-label rr-ov-foot">
        {viewLabels.overview.toLocaleUpperCase('vi-VN')} · {todayLabel()} · NỘI DUNG TỪ README.MD
      </p>
    </div>
  );
}
