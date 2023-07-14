import { Outlet } from 'react-router-dom';
import React from 'react';
import LoginForm from '../modules/login/form';

/**
 * Hook customizado para verificar se o usuário está autenticado.
 *
 * @returns {boolean} - `true` se o usuário estiver autenticado, `false` caso contrário.
 */

const useAuth = () => {
  const auth = localStorage.getItem('responseData');

  if (auth) {
    return true;
  }
  return false;
};

/**
 * Componente que protege as rotas da aplicação, redirecionando para o login se o usuário não estiver autenticado.
 *
 * @component
 * @returns {JSX.Element} - O componente ProtectedRoutes.
 */

function ProtectedRoutes() {
  const isAuth = useAuth();

  if (isAuth) {
    return <Outlet />;
  }
  return <LoginForm />;
}

export default ProtectedRoutes;
