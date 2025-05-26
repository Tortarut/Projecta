import { NavLink } from 'react-router-dom';
import { Folder, ListTodo, CalendarDays, Users } from 'lucide-react';
import styles from './Sidebar.module.scss';
import logo from '../../images/logo_small.png'
import { useEffect, useState } from 'react';

interface Props {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: Props) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const navItems = [
    { label: 'Проекты', path: '/projects', icon: <Folder size={18} /> },
    { label: 'Задачи', path: '/tasks', icon: <ListTodo size={18} /> },
    { label: 'Календарь', path: '/calendar', icon: <CalendarDays size={18} /> },
    { label: 'Команда', path: '/team', icon: <Users size={18} /> }
  ];

  useEffect(() => {
    if (isOpen) {
      setShouldAnimate(true);
    } else {
      // Сбрасываем анимацию при закрытии
      setShouldAnimate(false);
    }
  }, [isOpen]);

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <NavLink 
        to="/dashboard" 
        className={styles.logoLink}
      >
        <div className={styles.logo}>
          <img src={logo} alt="P" className={styles.logoImg} />
          <span className={styles.logoText}>rojecta</span>
        </div>
      </NavLink>
      <nav>
        {navItems.map(({ label, path, icon }, index) => (
          <NavLink
            to={path}
            key={path}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            <span className={`${styles.iconWrapper} ${shouldAnimate ? styles.animate : ''}`} 
                  style={{ animationDelay: `${index * 0.1}s` }}>
              {icon}
            </span>
            <span className={`${styles.labelWrapper} ${shouldAnimate ? styles.animate : ''}`} 
                  style={{ animationDelay: `${index * 0.1 + 0.15}s` }}>
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};