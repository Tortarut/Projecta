import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Projects } from '../pages/Projects/Projects';
import { ProjectPage } from '../pages/ProjectPage/ProjectPage';
import { Calendar } from '../pages/Calendar/Calendar';
import Home from '../pages/Home/Home';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../layout/Layout';
import { JSX } from 'react';
import { DashboardProvider } from '../context/DashboardContext';
import { ProjectsProvider } from '../context/ProjectContext';
import { TasksPage } from '../pages/TasksPage/TasksPage';
import { TasksProvider } from '../context/TasksContext';
import { CalendarProvider } from '../context/CalendarContext';
import { TeamPage } from '../pages/TeamPage/TeamPage';
import { TeamProvider } from '../context/TeamContext';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRouter = () => (
  <Router>
    <Routes>
      {/* Без Layout */}
      <Route path="/home" element={<Home />} />

      {/* С Layout */}
      <Route
        path="*"
        element={
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardProvider>
                      <Dashboard />
                    </DashboardProvider>
                  </PrivateRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <PrivateRoute>
                    <ProjectsProvider>
                      <Projects />
                    </ProjectsProvider>
                  </PrivateRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <PrivateRoute>
                    <ProjectPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <PrivateRoute>
                    <TasksProvider>
                      <TasksPage />
                    </TasksProvider>
                  </PrivateRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <PrivateRoute>
                    <CalendarProvider>
                      <Calendar />
                    </CalendarProvider>
                  </PrivateRoute>
                }
              />
              <Route
                path="/team"
                element={
                  <PrivateRoute>
                    <TeamProvider>
                      <TeamPage />
                    </TeamProvider>
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  </Router>
);

export default AppRouter;
