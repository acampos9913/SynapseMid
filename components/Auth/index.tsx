import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../../types';
import { APP_NAME } from '../../constants';
import { Login } from './Login';
import { Register } from './Register';

export const Auth: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSuccess = () => navigate(AppRoute.DASHBOARD);
  const toggle = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg shadow-brand-500/40">M</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{APP_NAME}</h2>
          <p className="text-gray-500">{t('auth.secureLogin')}</p>
        </div>

        {isLogin ? (
            <Login onSuccess={handleSuccess} onToggle={toggle} />
        ) : (
            <Register onSuccess={handleSuccess} onToggle={toggle} />
        )}
      </div>
    </div>
  );
};