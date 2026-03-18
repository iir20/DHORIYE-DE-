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

console.log('Main.tsx starting');
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'display:flex;min-height:100vh;flex-direction:column;align-items:center;justify-content:center;padding:1rem;text-align:center;font-family:sans-serif;';
  errorDiv.innerHTML = '<h1 style="color:#ef4444;font-size:1.5rem;font-weight:bold;margin-bottom:1rem;">Fatal: Root element not found</h1><p style="color:#71717a;">The application could not be initialized. Please check the index.html file.</p>';
  document.body.appendChild(errorDiv);
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
