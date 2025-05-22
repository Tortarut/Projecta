import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axios';

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  position: string;
  task_count: number;
  is_current_user: boolean;
  image: string | null;
}

interface TeamContextType {
  members: TeamMember[];
  teamName: string;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const TeamContext = createContext<TeamContextType>({
  members: [],
  teamName: '',
  loading: true,
  error: null,
  refresh: async () => {},
});

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/team-members/');
      const { team_name, members } = res.data;
      console.log(team_name);
      const sorted = members.sort((a: TeamMember, b: TeamMember) => {
        return b.is_current_user ? 1 : a.is_current_user ? -1 : 0;
      });

      setTeamName(team_name);
      setMembers(sorted);
    } catch (err) {
      console.error('Ошибка при загрузке команды', err);
      setError('Не удалось загрузить команду');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <TeamContext.Provider
      value={{ members, teamName, loading, error, refresh: fetchMembers }}
    >
      {children}
    </TeamContext.Provider>
  );
};
