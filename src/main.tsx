/**
 * Entry Point
 * -----------
 * Mounts the React application to the DOM 'root' element.
 * Uses StrictMode for development performance and error detection.
 */

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
