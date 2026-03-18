import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handler for runtime crashes
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global Runtime Error:', { message, source, lineno, colno, error });
};

window.onunhandledrejection = (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Fatal: Root element not found in index.html');
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
