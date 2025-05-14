import { useState, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Header } from '../components/Header/Header';
import { PageTitleContext } from '../context/PageTitleContext';
import styles from './Layout.module.scss';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const contextValue = useMemo(() => ({ setTitle, setSubtitle }), []);

  const handleOverlayClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <PageTitleContext.Provider value={contextValue}>
      <div className={styles.layout}>
        <Sidebar isOpen={sidebarOpen} />
        {sidebarOpen && <div className={styles.overlay} onClick={handleOverlayClick} />}
        <div className={styles.content}>
          <Header
            title={title}
            subtitle={subtitle}
            onMenuClick={() => setSidebarOpen((prev) => !prev)}
          />
          <main className={styles.main}>{children}</main>
        </div>
      </div>
    </PageTitleContext.Provider>
  );
};
