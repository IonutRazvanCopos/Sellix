import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Plus, User, LogOut, List } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  username: string;
}

function Navbar() {
  const { isLoggedIn, logout, token } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentLang = i18n.language;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUsername(decoded.username);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUsername(null);
      }
    }
  }, [token]);

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
                <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl w-56 z-50 overflow-hidden border border-gray-200 animate-fade-in">
                <Link
                  to="/profile"
                  className="flex items-center px-5 py-3 hover:bg-blue-50 text-sm gap-2 transition-colors duration-150"
                >
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700">{t('navbar.profile')}</span>
                </Link>
                <Link
                  to="/profile/my-listings"
                  className="flex items-center px-5 py-3 hover:bg-blue-50 text-sm gap-2 transition-colors duration-150"
                >
                  <List className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-700">{t("profile.myListings")}</span>
                </Link>
                <Link
                  to="/add-listing"
                  className="flex items-center px-5 py-3 hover:bg-blue-50 text-sm gap-2 transition-colors duration-150"
                >
                  <Plus className="w-4 h-4 text-pink-500" />
                  <span className="text-gray-700">{t('listings.addListing')}</span>
                </Link>
                {isLoggedIn && (
                  <Link
                  to="/messages"
                  className="flex items-center px-5 py-3 text-blue-600 font-semibold hover:bg-blue-50 text-sm gap-2 transition-colors duration-150"
                  >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  Mesajele mele
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left text-red-600 flex items-center px-5 py-3 hover:bg-red-50 text-sm gap-2 transition-colors duration-150 border-t border-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('navbar.logout')}</span>
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

        <div className="space-x-1">
          <button onClick={() => handleLanguageChange('ro')} className={getLangButtonStyle('ro')}>
            RO
          </button>
          <button onClick={() => handleLanguageChange('en')} className={getLangButtonStyle('en')}>
            EN
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700">
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

     {isMobileMenuOpen && (
      <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-6 px-4 space-y-4 z-50 rounded-b-xl transition-all">
        <Link to="/" className="block text-gray-800 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
          {t('navbar.home')}
        </Link>
        <Link to="/profile" className="block text-gray-800 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
          {t('navbar.profile')}
        </Link>
        <Link to="/profile/my-listings" className="block text-gray-800 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
          {t('profile.myListings')}
        </Link>
        <Link to="/add-listing" className="block text-gray-800 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
          {t('listings.addListing')}
        </Link>
        {isLoggedIn && (
          <Link to="/messages" className="text-blue-500 font-semibold">
            Mesajele mele
          </Link>
        )}
        <button onClick={logout} className="block w-full text-left text-red-500 font-semibold">
          {t('navbar.logout')}
        </button>
      </div>
    )}
    </nav>
  );
}

export default Navbar;