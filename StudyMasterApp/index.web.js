import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

if (module.hot) {
  module.hot.accept();
}

const container = document.getElementById('app-root');
const root = createRoot(container);
root.render(<App />);
