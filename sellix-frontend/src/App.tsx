import { Routes, Route } from 'react-router-dom';
import Login from './routes/user/Login';
import Register from './routes/user/Register';
import Profile from './routes/user/Profile';
import Navbar from './components/Navbar';
import PublicRoute from './utils/PublicRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { isLoggedIn } = useAuth();

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
    </>
  );
}

export default App;