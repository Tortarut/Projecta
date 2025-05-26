import { useState } from 'react';
import styles from './CreateTaskModal.module.scss';
import api from '../../api/axios';
import { useProjectsContext } from '../../hooks/useProjects';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTaskModal = ({ isOpen, onClose, onSuccess }: CreateTaskModalProps) => {
  const { projects } = useProjectsContext();
  const [name, setName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [deadline, setDeadline] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks/', {
        name,
        project: projectId,
        user: 1,
        deadline,
        status: 'В процессе',
      });
      onSuccess();
      onClose();
      setName('');
      setProjectId('');
      setDeadline('');
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Создание задачи</h2>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Название задачи"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            >
              <option value="">Выберите проект</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="deadline">Дата выполнения</label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={today}
              required
            />
          </div>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={!name || !projectId || !deadline}
          >
            Создать
          </button>
          <button type="button" className={styles.cancelButton} onClick={onClose}>Отмена</button>
        </form>
      </div>
    </div>
  );
};
