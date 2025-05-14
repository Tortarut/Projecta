// AppRouter.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import {Dashboard} from '../pages/Dashboard/Dashboard';
import {Projects} from '../pages/Projects/Projects';
import {ProjectPage} from '../pages/ProjectPage/ProjectPage';
import { useAuth } from '../hooks/useAuth';
import {Layout} from '../layout/Layout';
import { JSX } from 'react';
import { DashboardProvider } from '../context/DashboardContext';
import { ProjectsProvider } from '../context/ProjectContext';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRouter = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardProvider>
              <Dashboard />
            </DashboardProvider>
          </PrivateRoute>
        } />
        <Route path="/projects" element={
          <PrivateRoute>
            <ProjectsProvider>
              <Projects />
            </ProjectsProvider>
          </PrivateRoute>
        } />
          <Route path="/projects/:id" element={
            <PrivateRoute>
              <ProjectPage />
            </PrivateRoute>
          } />
      </Routes>
    </Layout>
  </Router>
);

export default AppRouter;