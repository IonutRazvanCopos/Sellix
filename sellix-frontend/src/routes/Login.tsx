import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    async function performLogin() {
      try {
        const res = await axios.post('/login', { email, password });
        const token = res.data.token;
        localStorage.setItem('token', token);
        login();
        navigate('/auctions');
      } catch (err: any) {
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError(t('auth.errorUnknown'));
        }
      }
    }

    performLogin();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <div className="text-blue-600 text-5xl font-extrabold tracking-wide">{t('auth.title')}</div>
          <div className="text-gray-500 italic text-sm">{t('auth.subtitleLogin')}</div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={function (e) { setEmail(e.target.value); }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="exemple@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={function (e) { setPassword(e.target.value); }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 font-semibold"
          >
            {t('auth.login')}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}

export default Login;