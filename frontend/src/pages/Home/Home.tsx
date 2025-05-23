import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../images/projecta_logo.png';
import styles from './Home.module.scss';

export const Home = () => {
  const [showText, setShowText] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    position: '',
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setShowText(true), 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch {
      alert('Ошибка входа');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setIsRegistering(false);
    } catch {
      alert('Ошибка регистрации');
    }
  };

  return (
    <div className={styles.page}>
      <button className={styles.loginButton} onClick={() => setShowModal(true)}>Войти</button>

        <div className={`${styles.shape} ${styles.shape1}`} />
        <div className={`${styles.shape} ${styles.shape2}`} />
        <div className={`${styles.shape} ${styles.shape3}`} />
        <div className={`${styles.shape} ${styles.shape4}`} />
        <div className={`${styles.shape} ${styles.shape5}`} />
        <div className={`${styles.shape} ${styles.shape6}`} />
        <div className={`${styles.shape} ${styles.shape7}`} />
        <div className={`${styles.shape} ${styles.shape8}`} />
        <div className={`${styles.shape} ${styles.shape9}`} />
        <div className={`${styles.shape} ${styles.shape10}`} />

      <div className={styles.logoWrapper}>
        <img src={logo} alt="P" className={styles.logoImage} />
        <span className={`${styles.logoText} ${showText ? styles.show : ''}`}>rojecta</span>
      </div>
      <p className={styles.description}>
        Система управления проектами для небольших команд
      </p>

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
            <h2>{isRegistering ? 'Регистрация' : 'Вход'}</h2>

            <form onSubmit={isRegistering ? handleRegister : handleLogin} className={styles.authForm}>
                <div className={styles.formGroup}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                />
                {isRegistering && (
                    <>
                    <input
                        type="text"
                        name="name"
                        placeholder="Имя"
                        value={form.name}
                        onChange={handleChange}
                        className={styles.formInput}
                    />
                    <input
                        type="text"
                        name="position"
                        placeholder="Должность"
                        value={form.position}
                        onChange={handleChange}
                        className={styles.formInput}
                    />
                    </>
                )}
                </div>
                <button type="submit" className={styles.submitButton}>
                {isRegistering ? 'Зарегистрироваться' : 'Войти'}
                </button>
            </form>

            <div className={styles.formFooter}>
                {isRegistering ? (
                <>
                    Уже есть аккаунт?{' '}
                    <button 
                    className={styles.toggleFormButton}
                    onClick={() => setIsRegistering(false)}
                    >
                    Войти
                    </button>
                </>
                ) : (
                <>
                    Нет аккаунта?{' '}
                    <button
                    className={styles.toggleFormButton}
                    onClick={() => setIsRegistering(true)}
                    >
                    Зарегистрироваться
                    </button>
                </>
                )}
            </div>
            </div>
        </div>
        )}
    </div>
  );
};

export default Home;
