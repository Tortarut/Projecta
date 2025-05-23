//AppRouter.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Home from '../pages/Home/Home';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Layout } from '../layout/Layout';
import { DashboardProvider } from '../context/DashboardContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
};

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        
        {isAuthenticated ? (
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <DashboardProvider>
                      <Dashboard />
                    </DashboardProvider>
                  </PrivateRoute>
                } />
                {/* Добавьте другие защищенные маршруты здесь */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          } />
        ) : (
          <Route path="*" element={<Navigate to="/home" replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;