import styles from './ProjectCard.module.scss';
import { Project } from '../../types';

interface Props {
  project: Project;
}

export const ProjectCard = ({ project }: Props) => {
  return (
    <div className={styles.card}>
      <h3>{project.name}</h3>
      
      <div className={styles.progressLabel}>
        <span>Прогресс проекта</span>
        <span>{Math.round(project.completion_percent)}%</span>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${project.completion_percent}%` }}
        >
          <span className={styles.thumb} />
        </div>
      </div>

      <p className={styles.tasks}>Задач по проекту: {project.user_tasks_remaining}</p>
      <div className={styles.footer}>
        <span>Дедлайн: {new Date(project.deadline).toLocaleDateString()}</span>
        <a className={styles.link} href={`/projects/${project.id}`}>Подробнее</a>
      </div>
    </div>
  );
};
