import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  function getLangButtonStyle(lang: string) {
    return `text-sm px-2 py-1 rounded transition ${
      currentLang === lang
        ? 'bg-blue-600 text-white font-semibold'
        : 'text-gray-600 hover:text-blue-600'
    }`;
  }

  function handleLanguageChange(lang: string) {
    i18n.changeLanguage(lang);
  }

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Sellix
      </Link>

      <div className="flex items-center space-x-4">
        <div className="space-x-4">
          {isLoggedIn ? (
            <>
              <Link to={`/profile`} className="text-gray-700 hover:text-blue-600 font-medium">
                {t('navbar.profile')}
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-1.5 rounded-full shadow hover:bg-red-600 transition"
              >
                {t('navbar.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/auctions" className="text-gray-700 hover:text-blue-600 font-medium">
                {t('navbar.auctions')}
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium">
                {t('navbar.register')}
              </Link>
              <Link
                to="/login"
                className="bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-full shadow hover:bg-blue-700 transition"
              >
                {t('navbar.login')}
              </Link>
            </>
          )}
        </div>

        <div className="space-x-2">
          <button
            onClick={() => handleLanguageChange('ro')}
            className={getLangButtonStyle('ro')}
          >
            RO
          </button>
          <button
            onClick={() => handleLanguageChange('en')}
            className={getLangButtonStyle('en')}
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;