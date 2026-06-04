import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Apply saved theme
const saved = localStorage.getItem('theme');
if (saved === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.setAttribute('data-theme', 'school');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
