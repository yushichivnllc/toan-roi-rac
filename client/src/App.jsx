import { ProgressProvider } from './state/progress.jsx';
import { Backdrop } from './components/Backdrop.jsx';
import { UiProvider, useUi } from './state/ui.jsx';
import { ToastHost } from './app/ToastHost.jsx';
import { TopNav, MenuOverlay } from './components/TopNav.jsx';
import { CropMarks } from './components/ui.jsx';
import { ModalHost } from './app/modals/index.jsx';
import { OverviewView } from './app/views/overview.jsx';
import { RoadmapView } from './app/views/roadmap.jsx';
import { PracticeView } from './app/views/practice.jsx';
import { NotesView } from './app/views/notes.jsx';
import { ProgressView } from './app/views/progress.jsx';
import { viewLabels } from './data/overview.js';

/* Mỗi màn hình mang một màu nhấn như hai poster tham chiếu: cam (ấm) / tím (lạnh). */
const ACCENTS = {
  overview: { tone: 'warm', color: '#ff5a1f' },
  roadmap: { tone: 'warm', color: '#ff5a1f' },
  practice: { tone: 'cool', color: '#7b78f4' },
  notes: { tone: 'cool', color: '#7b78f4' },
  progress: { tone: 'warm', color: '#ff5a1f' },
};

const VIEWS = {
  overview: OverviewView,
  roadmap: RoadmapView,
  practice: PracticeView,
  notes: NotesView,
  progress: ProgressView,
};

function Workspace() {
  const { view } = useUi();
  const View = VIEWS[view] || OverviewView;
  const accent = ACCENTS[view] || ACCENTS.overview;

  return (
    <div className="rr-app" data-accent={accent.tone}>
      {/* Lớp giấy xám + vân nhiễu, phủ toàn trang */}
      <div className="rr-paper" aria-hidden="true" />
      {/* Lớp wireframe Three.js */}
      <Backdrop accent={accent.color} />
      <CropMarks />

      <div className="rr-shell">
        <a className="skip-link" href="#rrContent">Đến nội dung chính</a>
        <TopNav />
        <main className="rr-main" id="rrContent" tabIndex={-1}>
          <View key={view} />
        </main>
        <footer className="rr-footer">
          <span className="rr-label">RỜI RẠC · HỌC CHẮC TỪNG BƯỚC</span>
          <span className="rr-label">{viewLabels[view].toLocaleUpperCase('vi-VN')} · NỘI DUNG TỪ README.MD ↗</span>
        </footer>
      </div>

      <MenuOverlay />
      <ModalHost />
      <ToastHost />
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <UiProvider>
        <Workspace />
      </UiProvider>
    </ProgressProvider>
  );
}
