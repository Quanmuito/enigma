import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from 'contexts/AppContext';
import App from 'app';
import { initI18n } from 'libs/i18n';
import 'styles/global.css';

initI18n();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    // <React.StrictMode>
    <AppProvider>
        <App />
    </AppProvider>
    // </React.StrictMode>
);
