import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskCard } from '../TaskCard';
import { Task } from '../../../types';
import api from '../../../api/axios';
import { TasksProvider } from '../../../context/TasksContext';

// Mock the axios api
jest.mock('../../../api/axios', () => ({
  patch: jest.fn(),
}));

// Mock the useTasks hook
jest.mock('../../../hooks/useTasks', () => ({
  useTasks: () => ({
    refresh: jest.fn(),
  }),
}));

describe('Карточка задачи', () => {
  const mockTask: Task = {
    id: 1,
    name: 'Test Task',
    status: 'В процессе',
    deadline: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    project: {
      id: 1,
      name: 'Test Project',
    },
  };

  const renderTaskCard = (task: Task) => {
    return render(
      <TasksProvider>
        <TaskCard task={task} />
      </TasksProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('корректно отображает информацию о задаче', () => {
    renderTaskCard(mockTask);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(
      screen.getByText((content, element) =>
        content.includes('Проект') &&
        content.includes('Test Project')
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Осталось:/)).toBeInTheDocument();
    expect(screen.getByText('В процессе')).toBeInTheDocument();
  });

  it('показывает кнопку "Готово" когда задача выполнена', () => {
    const doneTask = { ...mockTask, status: 'Готово' };
    renderTaskCard(doneTask);
    
    expect(screen.getByText('Готово')).toBeInTheDocument();
    expect(screen.queryByText('В процессе')).not.toBeInTheDocument();
  });

  it('показывает кнопку "Выполнить" при наведении на задачу в процессе', () => {
    renderTaskCard(mockTask);
    
    const card = screen.getByText('Test Task').closest('div');
    fireEvent.mouseEnter(card!);
    
    expect(screen.getByText('Выполнить')).toBeInTheDocument();
    expect(screen.queryByText('В процессе')).not.toBeInTheDocument();
  });

  it('вызывает API и обновляет состояние при клике на задачу в процессе', async () => {
    (api.patch as jest.Mock).mockResolvedValueOnce({ data: {} });
    
    renderTaskCard(mockTask);
    
    const card = screen.getByText('Test Task').closest('div');
    fireEvent.mouseEnter(card!);
    fireEvent.click(screen.getByText('Выполнить'));

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith(`/tasks/${mockTask.id}/`, { status: 'Готово' });
    });
  });

  it('не вызывает API при клике на выполненную задачу', async () => {
    const doneTask = { ...mockTask, status: 'Готово' };
    renderTaskCard(doneTask);
    
    const card = screen.getByText('Test Task').closest('div');
    fireEvent.click(card!);

    expect(api.patch).not.toHaveBeenCalled();
  });

  it('корректно обрабатывает ошибку API', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (api.patch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    renderTaskCard(mockTask);
    
    const card = screen.getByText('Test Task').closest('div');
    fireEvent.mouseEnter(card!);
    fireEvent.click(screen.getByText('Выполнить'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Ошибка при обновлении задачи:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
}); 