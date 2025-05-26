import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../ProjectCard';
import { Project } from '../../../types';

describe('Карточка проекта', () => {
  const mockProject: Project = {
    id: 1,
    name: 'Test Project',
    completion_percent: 75,
    user_tasks_remaining: 5,
    deadline: new Date(Date.now() + 86400000).toISOString(),
  };

  const renderProjectCard = (project: Project) => {
    return render(<ProjectCard project={project} />);
  };

  it('корректно отображает информацию о проекте', () => {
    renderProjectCard(mockProject);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Задач по проекту: 5')).toBeInTheDocument();
    expect(screen.getByText(/Дедлайн:/)).toBeInTheDocument();
    expect(screen.getByText('Подробнее')).toHaveAttribute('href', '/projects/1');
  });

  it('отображает правильную ширину прогресс-бара', () => {
    renderProjectCard(mockProject);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ width: '75%' });
  });

  it('корректно обрабатывает 0% выполнения', () => {
    const zeroProgressProject = { ...mockProject, completion_percent: 0 };
    renderProjectCard(zeroProgressProject);
    
    expect(screen.getByText('0%')).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ width: '0%' });
  });

  it('корректно обрабатывает 100% выполнения', () => {
    const completeProject = { ...mockProject, completion_percent: 100 };
    renderProjectCard(completeProject);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  it('отображает правильное количество оставшихся задач', () => {
    const projectWithManyTasks = { ...mockProject, user_tasks_remaining: 10 };
    renderProjectCard(projectWithManyTasks);
    
    expect(screen.getByText('Задач по проекту: 10')).toBeInTheDocument();
  });

  it('правильно форматирует дату дедлайна', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const projectWithTomorrowDeadline = {
      ...mockProject,
      deadline: tomorrow.toISOString(),
    };
    
    renderProjectCard(projectWithTomorrowDeadline);
    
    const deadlineText = screen.getByText(/Дедлайн:/);
    expect(deadlineText).toHaveTextContent(tomorrow.toLocaleDateString());
  });
}); 