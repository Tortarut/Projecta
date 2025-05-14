import styles from './Header.module.scss';
import { Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
}

export const Header = ({ title, subtitle, onMenuClick }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <button className={styles.burger} onClick={onMenuClick}>
        <Menu size={24} />
      </button>
      <div className={styles.textContainer}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className={styles.avatar}>
        <span>👤</span>
      </div>
    </header>
  );
};
