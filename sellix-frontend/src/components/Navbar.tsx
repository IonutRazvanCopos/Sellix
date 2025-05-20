import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Plus, User, LogOut, List, PlusCircle } from 'lucide-react';

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

      <div className="absolute left-1/2 transform -translate-x-1/2 mt-18">
        <Link
          to="/add-listing"
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition duration-200"
          title="Add Listing"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <Link to="/" className={getNavLinkClass('/')}>
          {t('navbar.home')}
        </Link>

        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">{username || 'Me'}</span>
              <span className="text-sm text-gray-400">▼</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 z-50 overflow-hidden border border-gray-100">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm gap-2"
                >
                  <User className="w-4 h-4" />
                  {t('navbar.profile')}
                </Link>
                <Link
                  to="/my-auctions"
                  className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm gap-2"
                >
                  <List className="w-4 h-4" />
                  {t("profile.myListings")}
                </Link>
                <Link
                  to="/add-listing"
                  className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t('listings.addListing')}
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left text-red-600 flex items-center px-4 py-2 hover:bg-gray-100 text-sm gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t('navbar.logout')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/register" className={getNavLinkClass('/register')}>
              {t('navbar.register')}
            </Link>
            <Link to="/login" className={getNavLinkClass('/login')}>
              {t('navbar.login')}
            </Link>
          </>
        )}

        {/* LANG BUTTONS */}
        <div className="space-x-1">
          <button onClick={() => handleLanguageChange('ro')} className={getLangButtonStyle('ro')}>
            RO
          </button>
          <button onClick={() => handleLanguageChange('en')} className={getLangButtonStyle('en')}>
            EN
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;