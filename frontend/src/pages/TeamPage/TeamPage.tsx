import { useTeam } from '../../hooks/useTeam';
import { TeamMemberCard } from '../../components/TeamMemberCard/TeamMemberCard';
import styles from './TeamPage.module.scss';
import { usePageTitle } from '../../context/PageTitleContext';
import { useEffect } from 'react';

export const TeamPage = () => {
    const { members, teamName, loading } = useTeam();
    const { setTitle, setSubtitle } = usePageTitle();
      
    useEffect(() => {
          setTitle(`Команда "${teamName}"`);
          setSubtitle(``);
      }, [teamName, setTitle, setSubtitle]);


  if (loading) return <p>Загрузка...</p>;

  return (
    <div className={styles.grid}>
      {members.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
};
