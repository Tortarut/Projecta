import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { CreateTaskModal } from '../CreateTaskModal';
import api from '../../../api/axios';
import { ProjectsProvider } from '../../../context/ProjectContext';

// Mock the ProjectContext component
jest.mock('../../../context/ProjectContext', () => ({
  ProjectsProvider: ({ children }: { children: React.ReactNode }) => children,
  ProjectsContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}));

// Mock the axios api
jest.mock('../../../api/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    }
  }
}));

// Mock the useProjectsContext hook
jest.mock('../../../hooks/useProjects', () => ({
  useProjectsContext: () => ({
    projects: [
      { id: 1, name: 'Project 1' },
      { id: 2, name: 'Project 2' },
    ],
    loading: false,
    error: null,
    refresh: jest.fn(),
  }),
}));

// Mock date-fns locale to avoid Jest parsing issues
jest.mock('date-fns/locale', () => ({
  ru: {},
}));

describe('Модальное окно создания задачи', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  const renderModal = async (isOpen = true) => {
    let result;
    await act(async () => {
      result = render(
        <ProjectsProvider>
          <CreateTaskModal
            isOpen={isOpen}
            onClose={mockOnClose}
            onSuccess={mockOnSuccess}
          />
        </ProjectsProvider>
      );
    });
    return result;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('не отображается когда isOpen равен false', async () => {
    await renderModal(false);
    expect(screen.queryByText('Создание задачи')).not.toBeInTheDocument();
  });

  it('отображает модальное окно с формой когда isOpen равен true', async () => {
    await renderModal();
    
    expect(screen.getByText('Создание задачи')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Название задачи')).toBeInTheDocument();
    expect(screen.getByText('Выберите проект')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Создать' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();
  });

  it('заполняет выпадающий список проектов доступными проектами', async () => {
    await renderModal();
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('');
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[1]).toHaveTextContent('Project 1');
    expect(options[2]).toHaveTextContent('Project 2');
  });

  it('вызывает onClose при нажатии на кнопку закрытия', async () => {
    await renderModal();
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '×' }));
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('вызывает onClose при нажатии на кнопку отмены', async () => {
    await renderModal();
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Отмена' }));
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('отправляет форму с правильными данными и вызывает onSuccess', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });
    
    await renderModal();
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Название задачи'), {
        target: { value: 'New Task' },
      });
      
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: '1' },
      });
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      fireEvent.change(screen.getByLabelText('Дата выполнения'), {
        target: { value: tomorrowStr },
      });
      
      fireEvent.click(screen.getByRole('button', { name: 'Создать' }));
    });
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/tasks/', {
        name: 'New Task',
        project: '1',
        user: 1,
        deadline: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
        status: 'В процессе',
      });
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('корректно обрабатывает ошибку API', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    await renderModal();
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Название задачи'), {
        target: { value: 'New Task' },
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: '1' },
      });
      fireEvent.change(screen.getByLabelText('Дата выполнения'), {
        target: { value: new Date().toISOString().split('T')[0] },
      });
      
      fireEvent.click(screen.getByRole('button', { name: 'Создать' }));
    });
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Ошибка при создании задачи:', expect.any(Error));
    });
    
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('проверяет обязательные поля', async () => {
    await renderModal();
    
    const submitButton = screen.getByRole('button', { name: 'Создать' });
    expect(submitButton).toBeDisabled();
    
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    expect(api.post).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Название задачи'), {
        target: { value: 'New Task' },
      });
    });
    
    expect(submitButton).toBeDisabled();
  });

  it('активирует кнопку отправки когда все поля заполнены', async () => {
    await renderModal();
    
    const submitButton = screen.getByRole('button', { name: 'Создать' });
    expect(submitButton).toBeDisabled();
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Название задачи'), {
        target: { value: 'New Task' },
      });
      
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: '1' },
      });
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      fireEvent.change(screen.getByLabelText('Дата выполнения'), {
        target: { value: tomorrowStr },
      });
    });
    
    expect(submitButton).not.toBeDisabled();
  });

  it('запрещает выбор прошедших дат', async () => {
    await renderModal();
    
    const dateInput = screen.getByLabelText('Дата выполнения');
    const today = new Date().toISOString().split('T')[0];
    
    await act(async () => {
      fireEvent.change(dateInput, {
        target: { value: today },
      });
    });
    
    const submitButton = screen.getByRole('button', { name: 'Создать' });
    expect(submitButton).toBeDisabled();
  });
}); 