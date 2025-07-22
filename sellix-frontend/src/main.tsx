import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './i18n';
import './index.css';
import { ChatProvider } from './context/ChatContext';


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ChatProvider>
    </BrowserRouter>
  </React.StrictMode>,
);