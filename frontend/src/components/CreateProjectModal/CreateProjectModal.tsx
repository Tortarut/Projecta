import { useState } from 'react';
import styles from './CreateProjectModal.module.scss';
import api from '../../api/axios';
import { format } from 'date-fns';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateProjectModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('deadline', deadline);
    if (image) formData.append('image', image);
    formData.append('team', '1'); // всегда команда 1

    try {
      await api.post('/projects/', formData);
      onSuccess();
    } catch (error) {
      console.error('Ошибка при создании проекта:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Создать проект</h2>

          <div className={styles.formGroup}>
            <label>Название проекта</label>
            <input
              type="text"
              placeholder="Название"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Описание</label>
            <textarea
              placeholder="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Дедлайн</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Изображение (необязательно)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>

          <div className={styles.buttonRow}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
