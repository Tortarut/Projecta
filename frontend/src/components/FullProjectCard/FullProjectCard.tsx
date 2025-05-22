import { Link } from 'react-router-dom';  // Добавлен импорт Link
import styles from './FullProjectCard.module.scss';

interface FullProjectCardProps {
  id: number;
  name: string;
  deadline: string;
  completion_percent: number;
  user_tasks_remaining: number;
  imageUrl?: string;
}

export const FullProjectCard = ({
  id,  // Добавлен id в параметры
  name,
  deadline,
  completion_percent,
  user_tasks_remaining,
  imageUrl,
}: FullProjectCardProps) => {
  const percent = Math.round(completion_percent);

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add(styles.fallback);
            }}
          />
        ) : (
          <div className={`${styles.imagePlaceholder} ${styles.fallback}`}>
            <span>🖼️</span>
          </div>
        )}
        <div className={styles.fallbackContent}>
          <span>🖼️</span>
        </div>
      </div>

      <div className={styles.content}>
        <h3>{name}</h3>

        <div className={styles.progressRow}>
          <span className={styles.progressText}>Прогресс проекта</span>
          <span className={styles.percent}>{percent}%</span>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${percent}%` }} />
          <div className={styles.thumb} style={{ left: `${percent}%` }} />
        </div>

        <p className={styles.meta}>Задач по проекту: {user_tasks_remaining}</p>
        <div className={styles.footer}>
          <p className={styles.meta}>Дедлайн: {new Date(deadline).toLocaleDateString('ru-RU')}</p>
          <Link className={styles.link} to={`/projects/${id}`}>  {/* Использован Link вместо <a> */}
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
};