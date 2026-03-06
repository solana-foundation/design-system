'use client';

import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './app';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Missing #root element');

createRoot(rootEl).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
