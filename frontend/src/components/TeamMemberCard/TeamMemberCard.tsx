import styles from './TeamMemberCard.module.scss';
import { TeamMember } from '../../context/TeamContext';

interface Props {
  member: TeamMember;
}

export const TeamMemberCard = ({ member }: Props) => {
  const isCurrent = member.is_current_user;

  return (
    <div className={`${styles.card} ${isCurrent ? styles.current : ''}`}>
      <div className={styles.avatar}>
        {member.image ? (
          <img src={member.image} alt={member.name} />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>
          {member.name}
          {isCurrent && <span className={styles.you}>&nbsp;(вы)</span>}
        </h3>
        <div className={styles.details}>
          <p className={styles.position}>{member.position}</p>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Задач</span>
              <span className={styles.statValue}>{member.task_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};