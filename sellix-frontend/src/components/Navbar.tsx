import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentLang = i18n.language;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    if (storedName) {
      setUsername(storedName);
    }
  }, [isLoggedIn]);

  function getNavLinkClass(path: string) {
    const isActive = location.pathname === path;
    return `${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-blue-600'} 
      px-4 py-1.5 rounded-full font-medium transition`;
  }

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
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center relative">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Sellix
      </Link>

      <button
        className="md:hidden text-2xl"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>

      <div className="hidden md:flex items-center space-x-4">
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              {username || 'My Account'} ⌄
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white shadow rounded-md z-10">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  {t('navbar.profile')}
                </Link>
                <Link to="/my-auctions" className="block px-4 py-2 hover:bg-gray-100">
                  My Auctions
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left text-red-600 px-4 py-2 hover:bg-gray-100"
                >
                  {t('navbar.logout')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/auctions" className={getNavLinkClass('/auctions')}>
              My Auctions
            </Link>
            <Link to="/register" className={getNavLinkClass('/register')}>
              {t('navbar.register')}
            </Link>
            <Link to="/login" className={getNavLinkClass('/login')}>
              {t('navbar.login')}
            </Link>
          </>
        )}
        <div className="space-x-2">
          <button onClick={() => handleLanguageChange('ro')} className={getLangButtonStyle('ro')}>
            RO
          </button>
          <button onClick={() => handleLanguageChange('en')} className={getLangButtonStyle('en')}>
            EN
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-start px-6 py-4 space-y-2 md:hidden z-50">
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="w-full py-2" onClick={() => setIsMobileMenuOpen(false)}>
                {t('navbar.username')}
              </Link>
              <Link to="/my-auctions" className="w-full py-2" onClick={() => setIsMobileMenuOpen(false)}>
                My Auctions
              </Link>
              <button onClick={logout} className="text-red-600 py-2">
                {t('navbar.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/auctions" className="w-full py-2" onClick={() => setIsMobileMenuOpen(false)}>
                {t('navbar.auctions')}
              </Link>
              <Link to="/register" className="w-full py-2" onClick={() => setIsMobileMenuOpen(false)}>
                {t('navbar.register')}
              </Link>
              <Link to="/login" className="w-full py-2" onClick={() => setIsMobileMenuOpen(false)}>
                {t('navbar.login')}
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;