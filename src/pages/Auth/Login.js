import './Auth.css'

// Components
import {Link, useLocation} from 'react-router-dom'
import Message from '../../components/Message'
import  ReactGa4 from 'react-ga4'
// Hooks
import { useContext, useEffect,useState } from 'react'
import { useReducer } from 'react';
// React Icons
import { FaUnlock,FaEye, FaEyeSlash,  } from 'react-icons/fa'
import { MdAlternateEmail } from 'react-icons/md'

// Animations
import Lottie from 'react-lottie-player'
import AuthAnimation from '../../utils/animationIcon.json'

// Firebase
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'


import {useSelector,useDispatch} from 'react-redux'
import { login, reset } from '../../slices/authSlice'
import GlobalContextProvider, { GlobalContext, GlobalDispatchContext } from '../../state/context/GlobalContext'
import { auth } from '../../lib/firebase'
import { dispatchAction } from '../../utils/functions/dispatchActions'



const Login = () => {
  
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const location = useLocation();
  
  
    const dispatch = useContext(GlobalDispatchContext)

    const {isLoading:loading,message,error,success} = useContext(GlobalContext)
    

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {  
      email,
      password
    }

    dispatch({
      type: "SET_LOADING",
      payload: {
        isLoading: true,
      },
    });

    const res = await login(data,dispatch)

    if(res?.error){
      dispatchAction(dispatch,'SET_ERROR',res.error)
    }

    dispatch({
      type: "SET_LOADING",
      payload: {
        isLoading: false,
      },
    });


  }

  
  const handleShowPassword = () =>{
      if(showPassword == true){
        setShowPassword(false)
      }else{
        setShowPassword(true)
      }
  }



  useEffect(() => {
    ReactGa4.send('pageview', location.pathname);
  }, [location]);


  return (
    <>
      <div id="all">
        <div id="animationInsta">
          <Lottie className="lottie" loop animationData={AuthAnimation} play />
        </div>
        <div id="login">
          <h2>ReactGram</h2>
          <p className="subtitle">Faça o login para ver o que há de novo.</p>
          <form onSubmit={handleSubmit}>
            <MdAlternateEmail className="icon" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="E-mail"
              value={email}
            />
            <FaUnlock className="icon" />
            <div className="input-container">
              {showPassword ? (
                <FaEye
                  className="show-password"
                  onClick={handleShowPassword}
                  style={{ display: password === "" ? "none" : "block" }}
                />
              ) : (
                <FaEyeSlash
                  className="show-password"
                  onClick={handleShowPassword}
                  display={password == "" ? "none" : ""}
                />
              )}
            </div>

            <input
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
            />
            <p>
              Esqueceu sua senha?{" "}
              <Link className="link" to="/reset-password">
                Clique aqui
              </Link>{" "}
            </p>

            
         {!loading && <input type="submit" value="Submit" />   }
         {error && <Message msg={error} type="error" />}
          {loading && <input type="submit" value="Aguarde..." disabled />}
          {success && message && <Message msg={message} type="success" />}
          </form>
          <p>
            Não tem uma conta? <Link to="/register">Clique aqui</Link>{" "}
          </p>
        </div>
      </div>
    </>
  );
}

export default Login