import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { APP_NAME, SUPPORTED_LANGUAGES } from '../constants';
import { AppRoute } from '../types';
import { db } from '../services/surrealService';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    db.logout();
    navigate(AppRoute.LOGIN);
  };

  const navItems = [
    { icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', label: t('common.dashboard'), path: AppRoute.DASHBOARD },
    { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: t('common.memory'), path: AppRoute.MEMORY },
    { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', label: t('common.billing'), path: AppRoute.BILLING },
    { icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', label: t('common.settings'), path: AppRoute.SETTINGS },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
           <div className="w-8 h-8 bg-brand-600 rounded-lg mr-3 flex items-center justify-center text-white font-bold">M</div>
           <h1 className="font-bold text-lg tracking-tight dark:text-white">{APP_NAME}</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800'
                  }
                `}
              >
                <svg className={`w-5 h-5 mr-3 ${isActive ? 'text-brand-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
           <div className="flex items-center justify-between mb-4">
             <span className="text-xs font-semibold text-gray-500 uppercase">Language</span>
             <div className="flex space-x-2">
               {SUPPORTED_LANGUAGES.map(lang => (
                 <button
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={`text-xs px-2 py-1 rounded ${i18n.language === lang.code ? 'bg-gray-200 dark:bg-gray-700 font-bold' : 'text-gray-400'}`}
                 >
                   {lang.code.toUpperCase()}
                 </button>
               ))}
             </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
           >
             <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
             {t('common.logout')}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 dark:bg-dark-900 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-900 flex items-center justify-between px-6 lg:px-8">
           <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
             {navItems.find(i => i.path === location.pathname)?.label}
           </h2>
           <div className="flex items-center space-x-4">
             {/* Mock User Avatar */}
             <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-brand-500 border-2 border-white dark:border-dark-800"></div>
           </div>
        </header>

        <div className="flex-1 overflow-hidden p-6 lg:p-8">
           <div className="h-full w-full max-w-6xl mx-auto">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
};