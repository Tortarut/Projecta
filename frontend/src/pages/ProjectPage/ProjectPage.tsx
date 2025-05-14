import { useParams } from 'react-router-dom';
import { ProjectDetailsProvider } from '../../context/ProjectDetailsContext';
import { useProject } from '../../hooks/useProject';
import { TaskCardAlt } from '../../components/TaskCardAlt/TaskCardAlt';
import styles from './ProjectPage.module.scss';

const ProjectContent = () => {
  const { project, loading, error } = useProject();

  if (loading) return <p>Загрузка...</p>;
  if (error || !project) return <p>Проект не найден</p>;

  return (
    <div className={styles.page}>
      <div className={styles.imageWrapper}>
        {project.image ? (
          <img src={project.image} alt={project.name} />
        ) : (
          <div className={styles.imageStub}>🖼️</div>
        )}
      </div>
      <div className={styles.main}>
        <div className={styles.info}>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <div className={styles.progressHeader}>
            <span>Прогресс проекта</span>
            <span>{Math.round(project.progress_percent)}%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${project.progress_percent}%` }}
            />
          </div>
          <p>Дедлайн: {new Date(project.deadline).toLocaleDateString('ru-RU')}</p>
        </div>

        <div className={styles.tasks}>
          <h2>Задачи</h2>
          <div className={styles.taskList}>
            {project.user_tasks.map((task) => (
              <TaskCardAlt key={task.id} {...task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectPage = () => {
  const { id } = useParams();
  return (
    <ProjectDetailsProvider projectId={Number(id)}>
      <ProjectContent />
    </ProjectDetailsProvider>
  );
};