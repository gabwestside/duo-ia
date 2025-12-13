import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Estou assumindo que seu hook de autenticação está neste caminho

// Definindo os tipos das props que o componente vai receber.
// 'children' representa os componentes filhos que serão renderizados se o usuário estiver logado.
interface ProtectedRouteProps {
  children: ReactNode;
};

/**
 * Componente de Rota Protegida.
 * 
 * Este componente verifica se o usuário está autenticado antes de renderizar
 * os componentes filhos (a página que ele está tentando acessar).
 * 
 * Se o usuário não estiver autenticado, ele é redirecionado para a página de login.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // 1. Usando o hook 'useAuth' para obter o estado de autenticação.
  const { isAuthenticated, loading } = useAuth();

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "loading:", loading);

  // 2. Se ainda estiver carregando, aguarda antes de fazer qualquer verificação
  if (loading) {
    return null; // ou um componente de loading se preferir
  }

  // 3. Verificando o estado de autenticação.
  if (!isAuthenticated) {
    // 4. Se 'isAuthenticated' for falso, o usuário não está logado.
    //    Nesse caso, usamos o componente 'Navigate' do react-router-dom
    //    para redirecioná-lo para a página de login.
    //    A propriedade 'replace' evita que a rota antiga seja mantida no histórico do navegador.
    return <Navigate to="/login" replace />;
  }

  // 5. Se o usuário estiver logado, renderizamos os componentes filhos normalmente.
  return <>{children}</>;
};

export default ProtectedRoute;
