import { Routes, Route } from 'react-router-dom';
import Login from './routes/user/Login';
import Register from './routes/user/Register';
import Profile from './routes/user/Profile';
import Navbar from './components/Navbar';
import PublicRoute from './utils/PublicRoute';
import { useAuth } from './context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useRef } from 'react';

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
    <>
      <Navbar />
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
        {isLoggedIn && (
          <Route
            path="/profile"
            element={<Profile />}
          />
        )}
        <Route
          path="/profile/:id"
          element={<Profile />}
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;