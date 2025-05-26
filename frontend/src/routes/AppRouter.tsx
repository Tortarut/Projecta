//AppRouter.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Home from '../pages/Home/Home';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Layout } from '../layout/Layout';
import { Projects } from '../pages/Projects/Projects';
import { ProjectPage } from '../pages/ProjectPage/ProjectPage';
import { Calendar } from '../pages/Calendar/Calendar';
import { DashboardProvider } from '../context/DashboardContext';
import { ProjectsProvider } from '../context/ProjectContext';
import { TasksPage } from '../pages/TasksPage/TasksPage';
import { TasksProvider } from '../context/TasksContext';
import { CalendarProvider } from '../context/CalendarContext';
import { TeamPage } from '../pages/TeamPage/TeamPage';
import { TeamProvider } from '../context/TeamContext';

const AppRouter = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Загрузка...</div>; // или спиннер
  }

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />

        {isAuthenticated ? (
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/dashboard" element={
                  <DashboardProvider>
                    <Dashboard />
                  </DashboardProvider>
                } />
                <Route path="/projects" element={
                  <ProjectsProvider>
                    <Projects />
                  </ProjectsProvider>
                } />
                <Route path="/projects/:id" element={<ProjectPage />} />
                <Route path="/tasks" element={
                  <ProjectsProvider>
                  <TasksProvider>
                    <TasksPage />
                  </TasksProvider>
                  </ProjectsProvider>
                } />
                <Route path="/calendar" element={
                  <CalendarProvider>
                    <Calendar />
                  </CalendarProvider>
                } />
                <Route path="/team" element={
                  <TeamProvider>
                    <TeamPage />
                  </TeamProvider>
                } />
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