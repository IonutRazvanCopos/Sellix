import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './routes/user/Login';
import Register from './routes/user/Register';
import Profile from './routes/user/Profile';
import Home from './routes/home/home';
import Navbar from './components/Navbar';
import PublicRoute from './utils/PublicRoute';
import { useAuth } from './context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import AddListing from './routes/user/AddListing';
import Footer from './components/Footer';

function App() {
  const { isLoggedIn, justLoggedIn, setJustLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn && justLoggedIn) {
      toast.success('Login successfully!', {
        position: 'bottom-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setJustLoggedIn(false);
      localStorage.setItem('loginToastShown', 'true');
    }
  }, [isLoggedIn, justLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/" element={<Home />} />
          {isLoggedIn && (
            <Route path="/profile" element={<Profile />} />
          )}
          <Route path="/profile/:id" element={<Profile />} />
          <Route
            path="/add-listing"
            element={isLoggedIn ? <AddListing /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;