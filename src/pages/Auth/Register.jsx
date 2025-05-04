
// Components
import {Link, useLocation } from 'react-router-dom'
import Message from '../../components/Message'
import ReactGa4 from 'react-ga4'
import {useSelector,useDispatch} from 'react-redux'
// Hooks
import { useState,useEffect, useContext } from 'react'


// React icons
import { FaUser,FaLock, } from 'react-icons/fa'
import { MdAlternateEmail } from 'react-icons/md'


// Redux

// Styles
import './Auth.css'
import { register, reset, setError, setMessage } from '../../slices/authSlice'
import GlobalContextProvider, { GlobalContext, GlobalDispatchContext } from '../../state/context/GlobalContext'
import { dispatchAction } from '../../utils/functions/dispatchActions'


const Register = () => {

  const dispatch = useContext(GlobalDispatchContext)

  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassoword] = useState('')

  const location = useLocation()

  const {loading,message,error,success} = useContext(GlobalContext)


  const handleSubmit = async(e) => {
    e.preventDefault()

    
    if(!name){
      dispatchAction(dispatch,'SET_ERROR','Por favor insira seu nome.')
      return
    }


    if(password != confirmPassword){
      dispatchAction(dispatch,'SET_ERROR','As senhas não conferem')
      return
    }

    const user = {
      email,
      name,
      password
    }

    const res = await register(user,dispatch)

    if(res.error){
      dispatchAction(dispatch,'SET_ERROR',res.error)
      return
    }
    
  
  }
  useEffect(() => {
    ReactGa4.send('pageview', location.pathname);
  }, [location]);


  return (
    <div id="register">
      <h2>ReactGram</h2>
      <p className="subtitle">Cadastre-se para ver as fotos dos seus amigos</p>
      <form onSubmit={handleSubmit}>
        <FaUser className='icon' />
        <input className='input'
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Nome"
          value={name}
        />
        <MdAlternateEmail className="icon" />
        <input className='input'
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="E-mail"
          value={email}
        />
        <FaLock className="icon" />
        <input className='input'
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Senha"
          value={password}
        />
        <FaLock className="icon" />
        <input className='input'
          onChange={(e) => setConfirmPassoword(e.target.value)}
          type="password"
          placeholder="Confirme a senha"
          value={confirmPassword}
        />
        {!loading && <input type="submit" value="Cadastrar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />} 
        {error && <Message msg = {error} type="error" />}
        {success && <Message msg={message} type='success' /> }  
      </form>
      <p>
        Já tem conta? <Link to="/login">Entre aqui.</Link>
      </p>
    </div>
  );
}

export default Register