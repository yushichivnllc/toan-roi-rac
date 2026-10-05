import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

/* Font tự host (không phụ thuộc Google Fonts): Anton cho tiêu đề khổng lồ,
   Archivo cho giao diện, IBM Plex Mono cho nhãn kỹ thuật. Bản vietnamese
   đảm bảo dấu tiếng Việt hiển thị đúng. */
import '@fontsource/anton/latin-400.css';
import '@fontsource/anton/vietnamese-400.css';
import '@fontsource/archivo/latin-400.css';
import '@fontsource/archivo/latin-500.css';
import '@fontsource/archivo/latin-600.css';
import '@fontsource/archivo/latin-700.css';
import '@fontsource/archivo/latin-800.css';
import '@fontsource/archivo/vietnamese-400.css';
import '@fontsource/archivo/vietnamese-500.css';
import '@fontsource/archivo/vietnamese-600.css';
import '@fontsource/archivo/vietnamese-700.css';
import '@fontsource/archivo/vietnamese-800.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/vietnamese-400.css';
import '@fontsource/ibm-plex-mono/vietnamese-500.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/views.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
