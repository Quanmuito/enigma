import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from 'context/AppContext';
import App from 'app';
import 'styles/global.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <AppProvider>
            <App />
        </AppProvider>
    </React.StrictMode>
);
