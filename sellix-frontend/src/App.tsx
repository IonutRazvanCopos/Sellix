import { Routes, Route } from 'react-router-dom';
import Login from './routes/Login';
import Register from './routes/Register';
import Navbar from './components/Navbar';
import PublicRoute from './utils/PublicRoute';

function App() {
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
      </Routes>
    </>
  );
}

export default App;