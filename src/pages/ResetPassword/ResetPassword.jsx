import { useEffect, useState } from "react";
import Message from '../../components/Message'
import { RecaptchaVerifier,sendPasswordResetEmail } from 'firebase/auth';
import {auth} from '../../lib/firebase'
import'./ResetPassword.css'
import { useDispatch, useSelector } from "react-redux";
import { resetMessage, resetPassword } from "../../slices/authSlice";
import { useContext } from "react";
import { GlobalContext, GlobalDispatchContext } from "../../state/context/GlobalContext";
import { dispatchAction } from "../../utils/functions/dispatchActions";


const ResetPassword = () => {

  const [email, setEmail] = useState("");
  const [loading,setLoading] = useState(false)
  const dispatch = useContext(GlobalDispatchContext)

  const {message,error,success} = useContext(GlobalContext)

  const handleSubmit = async(e) => {
    setLoading(true)
    e.preventDefault();
    
        // Habilita a reCAPTCHA.
        const recaptchaVerifier = new RecaptchaVerifier(auth,'recaptcha-container');

        // Renderiza a reCAPTCHA.
        await recaptchaVerifier.render();
        await recaptchaVerifier.verify();

        const res = await resetPassword(email)
        if(res){
          let errorMessage = res.split('(')[1].split(')')[0].split('/')[1];
          errorMessage = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1) + ".";
          dispatchAction(dispatch,'SET_ERROR',errorMessage)
        } else{
          dispatchAction(dispatch,'SET_MESSAGE',"Email de recuperação enviado.")
        }




        recaptchaVerifier.clear()

    
      setLoading(false)

  };


  return (
    <div id="reset-form">
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ marginBottom: "10px" }}>E-mail:</label>
        <input
          style={{ marginBottom: "10px" }}
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div
          className="mb-4 w-full text-center flex items-center justify-center"
          id="recaptcha-container"
        ></div>
        {!loading && <input type="submit" className="button1" value="Enviar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </form>
    </div>
  );
};

export default ResetPassword;
