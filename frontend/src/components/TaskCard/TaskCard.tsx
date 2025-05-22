import styles from './TaskCard.module.scss';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Task } from '../../types';
import { Clock } from 'lucide-react'; // Импортируем компонент Clock

interface Props {
  task: Task;
}

export const TaskCard = ({ task }: Props) => {
  const remaining = formatDistanceToNow(new Date(task.deadline), {
    addSuffix: true,
    locale: ru,
  });

  const statusClass = task.status === 'Готово' ? 'done' : 'inProgress';

  return (
    <div className={styles.card}>
      <h3>{task.name}</h3>
      <p className={styles.projectName}>Проект “{task.project.name}”</p>
      <div className={styles.footer}>
        <span className={styles.deadline}>
          <Clock size={16} style={{ marginRight: '4px' }} /> {/* Добавляем иконку часов */}
          {remaining.replace('назад', 'Осталось')}
        </span>
        <button className={`${styles.statusButton} ${styles[statusClass]}`}>
          {task.status}
        </button>
      </div>
    </div>
  );
};