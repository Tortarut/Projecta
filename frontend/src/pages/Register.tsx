import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    position: '',
    team: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/', form);
      navigate('/login');
    } catch {
      alert('Ошибка регистрации');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-96 p-6 border rounded">
        <h2 className="text-xl mb-4">Регистрация</h2>
        {['email', 'password', 'name', 'position'].map((field) => (
          <input
            key={field}
            name={field}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field}
            value={(form as any)[field]}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
        ))}
        <button type="submit" className="w-full p-2 bg-green-600 text-white rounded">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default Register;
