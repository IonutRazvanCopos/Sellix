import { Routes, Route } from 'react-router-dom';
import Login from './routes/Login';
import Register from './routes/Register';
import Profile from './routes/Profile';
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