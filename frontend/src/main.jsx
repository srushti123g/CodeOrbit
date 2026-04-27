import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './theme.css'
import { AuthProvider } from './authContext.jsx'
import ProjectRoutes from './Routes.jsx';
import { BrowserRouter as Router } from 'react-router-dom'


import { ToastProvider } from './components/common/Toast';

// Add global interceptor


import { ThemeProvider } from './ThemeContext.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ProjectRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  </ToastProvider>
);
