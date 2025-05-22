import { NavLink } from 'react-router-dom';
import { Folder, ListTodo, CalendarDays, Users } from 'lucide-react';
import styles from './Sidebar.module.scss';
import logo from '../../images/projecta_logo.png'

interface Props {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: Props) => {
  const navItems = [
    { label: 'Проекты', path: '/projects', icon: <Folder size={18} /> },
    { label: 'Задачи', path: '/tasks', icon: <ListTodo size={18} /> },
    { label: 'Календарь', path: '/calendar', icon: <CalendarDays size={18} /> },
    { label: 'Команда', path: '/team', icon: <Users size={18} /> }
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <NavLink 
        to="/dashboard" 
        className={styles.logoLink}
      >
        <div className={styles.logo}>Projecta</div>
      </NavLink>
      <nav>
        {navItems.map(({ label, path, icon }) => (
          <NavLink
            to={path}
            key={path}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};