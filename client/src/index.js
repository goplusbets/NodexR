import React from 'react';
import ReactDOM from 'react-dom/client';  // Zmiana importu
import App from './App';

// Nowy sposób renderowania korzenia aplikacji w React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
