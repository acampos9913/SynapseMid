import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import { MemoryManager } from './components/MemoryManager';
import { Billing } from './components/Billing/index';
import { Settings } from './components/Settings/index';
import { AppRoute } from './types';
import { db } from './services/surrealService';
import './i18n/config';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = db.getUserFromStorage();
  const location = useLocation();

  if (!user) {
    return <Navigate to={AppRoute.LOGIN} state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!db.getUserFromStorage());

  useEffect(() => {
    const checkAuth = () => {
       setIsAuthenticated(!!db.getUserFromStorage());
    }
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path={AppRoute.LOGIN} element={<Auth />} />
        
        <Route 
          path={AppRoute.DASHBOARD} 
          element={
            <ProtectedRoute>
              <ChatInterface />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path={AppRoute.MEMORY} 
          element={
            <ProtectedRoute>
              <MemoryManager />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path={AppRoute.BILLING} 
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          } 
        />

        <Route 
          path={AppRoute.SETTINGS} 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to={AppRoute.DASHBOARD} replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;