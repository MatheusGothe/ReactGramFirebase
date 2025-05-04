import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import './App.css';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import EditProfile from './pages/EditProfile/EditProfile';
import Photo from './pages/Photo/Photo';
import Search from './pages/Search/Search';
import Storie from './pages/PostStorie/Storie';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Firebase
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { GlobalContext } from './state/context/GlobalContext';

function Layout({ storieValue }) {
  return (
    <div className="App">
      <Navbar storieValue={storieValue} />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children, currentUser }) {
  return currentUser ? children : <Navigate to="/login" />;
}

function PublicOnlyRoute({ children, currentUser }) {
  return !currentUser ? children : <Navigate to="/" />;
}

function App() {
  const { user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [storieValue, setStorieValue] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStorieValue = (r) => {
    setStorieValue(r);
  };

  if (loading) return <p>Carregando...</p>;

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout storieValue={storieValue} />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute currentUser={currentUser}>
              <Home storyData={handleStorieValue} />
            </ProtectedRoute>
          ),
        },
        {
          path: 'login',
          element: (
            <PublicOnlyRoute currentUser={currentUser}>
              <Login />
            </PublicOnlyRoute>
          ),
        },
        {
          path: 'register',
          element: (
            <PublicOnlyRoute currentUser={currentUser}>
              <Register />
            </PublicOnlyRoute>
          ),
        },
        {
          path: 'postStorie',
          element: (
            <ProtectedRoute currentUser={currentUser}>
              <Storie />
            </ProtectedRoute>
          ),
        },
        {
          path: 'profile',
          element: (
            <ProtectedRoute currentUser={currentUser}>
              <EditProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: 'users/:id',
          element: (
            <ProtectedRoute currentUser={currentUser}>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: 'photos/:id',
          element: (
            <ProtectedRoute currentUser={currentUser}>
              <Photo />
            </ProtectedRoute>
          ),
        },
        {
          path: 'search',
          element: (
            <ProtectedRoute currentUser={currentUser}>
              <Search />
            </ProtectedRoute>
          ),
        },
        {
          path: 'reset-password',
          element: <ResetPassword />,
        },
        {
          path: '*',
          element: <Navigate to="/" />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
