import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Sellix
      </Link>

      <div className="space-x-4">
        {loggedIn ? (
          <>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
              Contul meu
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1.5 rounded-full shadow hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
           <Link to="/licitatii" className="text-gray-700 hover:text-blue-600 font-medium">
              Licitatii
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium">
              Înregistrare
            </Link>
            <Link
              to="/login"
              className="bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-full shadow hover:bg-blue-700 transition"
            >
              Autentificare
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;