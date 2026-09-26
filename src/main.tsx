import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './fonts';
import './index.css';
import { initPublicBaseUrl } from './utils/lookStorage';

void initPublicBaseUrl();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
