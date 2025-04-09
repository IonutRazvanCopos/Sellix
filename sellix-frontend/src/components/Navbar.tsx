import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Sellix
      </Link>

      <div className="space-x-4">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
              Contul meu
            </Link>
            <button
              onClick={logout}
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
