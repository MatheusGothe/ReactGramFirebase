import { useEffect, useState } from "react";
import Message from '../../components/Message'
import { RecaptchaVerifier,sendPasswordResetEmail } from 'firebase/auth';
import {auth} from '../../lib/firebase'
import'./ResetPassword.css'
import { useDispatch, useSelector } from "react-redux";
import { resetMessage, resetPassword } from "../../slices/authSlice";


const ResetPassword = () => {

  const [email, setEmail] = useState("");

  const dispatch = useDispatch()

  const {loading,message,error,success} = useSelector(state => state.auth)

  const handleSubmit = async(e) => {
    e.preventDefault();
    
        // Habilita a reCAPTCHA.
        const recaptchaVerifier = new RecaptchaVerifier(auth,'recaptcha-container');

        // Renderiza a reCAPTCHA.
        await recaptchaVerifier.render();
        await recaptchaVerifier.verify();

        dispatch(resetPassword(email))


        setTimeout(() => {
          recaptchaVerifier.clear()
          dispatch(resetMessage())
        }, 3000);
    


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
