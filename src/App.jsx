import {BrowserRouter, Routes, Route, Navigate,useLocation}  from 'react-router-dom'
import ReactGA4 from 'react-ga4';

// CSS
import './App.css'

// Pages
import Home from './pages/Home/Home'
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';
import ResetPassword from './pages/ResetPassword/ResetPassword';

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Hooks
import EditProfile from './pages/EditProfile/EditProfile';
import Photo from './pages/Photo/Photo';
import Search from './pages/Search/Search';
import Storie from './pages/PostStorie/Storie';
import { useState,useEffect, useContext } from 'react';
// Firebase
import {auth} from './lib/firebase'
import { onAuthStateChanged } from 'firebase/auth';
import { GlobalContext } from './state/context/GlobalContext';




function App() {

  const {user} = useContext(GlobalContext)
  
  const [storieValue, setStorieValue] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser);
      setLoading(false);
    });

    // Limpeza na desmontagem
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }



  const handleStorieValue = (r) => {
    setStorieValue(r)
  }

  return (
    <div className="App">
     <BrowserRouter>
     <Navbar showNavbar={showNavbar} storieValue={storieValue} />
       <div className="container">
        <Routes>
          <Route path='/' element={currentUser ? <Home storyData={handleStorieValue} /> : <Navigate to='/login' />} />
          <Route path='/login' element={!currentUser ? <Login /> : <Navigate to='/' /> } />
          <Route path='/register' element={!currentUser ? <Register /> : <Navigate to='/' /> } />
          <Route path='/postStorie' element={currentUser ? <Storie /> : <Navigate to='/' /> } />
          <Route path='/profile' element={currentUser ? <EditProfile /> : <Navigate to='/login' />} />
          <Route path='/users/:id' element={currentUser ? <Profile /> : <Navigate to='/login' />} />
          <Route path='/photos/:id' element={currentUser ? <Photo /> : <Navigate to='/login' />} />
          <Route path='/search' element={currentUser ? <Search /> : <Navigate to='/login' />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/*' element={<Navigate to='/' />} />
        </Routes>
       </div>
        <Footer />
     </BrowserRouter>
    </div>
  );
}

export default App;
