// main.jsx — Entry point của React app
// Render component gốc App vào DOM
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import CSS toàn cục — áp dụng cho toàn bộ ứng dụng
import './styles/global.css';

// Sử dụng createRoot API (React 18+) để render
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
