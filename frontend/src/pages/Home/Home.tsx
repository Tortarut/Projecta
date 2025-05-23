import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/axios';
import logo from '../../images/projecta_logo.png';
import styles from './Home.module.scss';

const initialForm = {
  email: '',
  password: '',
  name: '',
  position: '',
};

export const Home = () => {
  const [form, setForm] = useState(initialForm);
  const [loginError, setLoginError] = useState('');
  const [restoredFromSession, setRestoredFromSession] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // === Side Effects ===
  useEffect(() => {
    const savedForm = sessionStorage.getItem('authFormData');
    const savedModal = sessionStorage.getItem('showAuthModal');
    const savedLoginError = sessionStorage.getItem('loginError');

    if (savedForm) {
      setForm(JSON.parse(savedForm));
      setRestoredFromSession(true);
    }
    if (savedModal === 'true') setShowModal(true);
    if (savedLoginError) setLoginError(savedLoginError);
  }, []);

  useEffect(() => {
    setTimeout(() => setShowText(true), 500);
  }, []);

  useEffect(() => {
    sessionStorage.setItem('authFormData', JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    sessionStorage.setItem('showAuthModal', JSON.stringify(showModal));
  }, [showModal]);

  useEffect(() => {
    sessionStorage.setItem('loginError', loginError);
  }, [loginError]);

  // === Handlers ===
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openModal = () => {
    if (!restoredFromSession) {
      setForm(initialForm);
      setLoginError('');
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setLoginError('');
    sessionStorage.setItem('loginError', '');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const success = await login(form.email, form.password);
      if (success) {
        sessionStorage.clear();
        navigate('/dashboard');
      } else {
        setLoginError('Неверный email или пароль');
      }
    } catch {
      setLoginError('Неверный email или пароль');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/', form);
      setIsRegistering(false);
      setLoginError('Вы успешно зарегистрированы. Войдите.');
    } catch {
      setLoginError('Ошибка регистрации');
    }
  };

  // === Render ===
  const renderAuthForm = () => (
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
  );

  return (
    <div className={styles.page}>
      <button className={styles.loginButton} onClick={openModal}>Войти</button>

      {/* Background shapes */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`${styles.shape} ${styles[`shape${i + 1}`]}`} />
      ))}

      {/* Logo */}
     <div className={`${styles.logoWrapper} ${showText ? styles.logoAnimated : ''}`}>
        <img src={logo} alt="P" className={`${styles.logoImage} ${showText ? styles.logoImageAnimated : ''}`} />
        <span className={`${styles.logoText} ${showText ? styles.show : ''}`}>rojecta</span>
     </div>

      <p className={styles.description}>
        Система управления проектами для небольших команд
      </p>

      {/* Modal */}
      {showModal && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>×</button>
            <h2>{isRegistering ? 'Регистрация' : 'Вход'}</h2>

            {loginError && (
              <div className={
                loginError.includes('успешно')
                  ? styles.successMessage
                  : styles.errorMessage
              }>
                {loginError}
              </div>
            )}

            {renderAuthForm()}

            <div className={styles.formFooter}>
              {isRegistering ? (
                <>
                  Уже есть аккаунт?{' '}
                  <button className={styles.toggleFormButton} onClick={() => setIsRegistering(false)}>
                    Войти
                  </button>
                </>
              ) : (
                <>
                  Нет аккаунта?{' '}
                  <button className={styles.toggleFormButton} onClick={() => setIsRegistering(true)}>
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
