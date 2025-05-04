import "./EditProfile.css";

import { uploads } from "../../utils/config";

// Hooks
import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";


// Components
import Message from "../../components/Message";
import { GlobalContext, GlobalDispatchContext } from "../../state/context/GlobalContext";
import { auth } from "../../lib/firebase";
import { getUserDetails, profile, updateProfile } from "../../slices/userSlice";
import { setErrorWithTimeout } from "../../utils/functions/resetError";
import { dispatchAction } from "../../utils/functions/dispatchActions";
// Animations
import loadingAnimation from '../../utils/assets/loadingAnimation.json'
import Lottie from "react-lottie-player";
import Loading from "../../components/Loading";

const EditProfile = () => {

  const {user,isLoading:loading,loading:loadingForm,error,message} = useContext(GlobalContext)
  const dispatch = useContext(GlobalDispatchContext)
 
  const [name, setName] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState(user.bio);
  const [previewImage, setPreviewImage] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [isChanged,setIsChanged] = useState(false)

  useEffect(() => {
     profile(auth.currentUser.uid, dispatch)
  }, []); 
  
    useEffect(() => {
    if(user) {
      setName(user.username);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      uid: user.id,
      email,
      name,
      oldPassword
    }

    if (profileImage) {
      userData.profileImage = profileImage;
    }
    if (email){
      userData.email = email
    }
    if(email == ''){
      dispatchAction(dispatch,'SET_ERROR','E-mail não pode ser vazio')
      return
    }
    if(bio) {
      userData.bio = bio;
    }

    if(email !== auth.currentUser.email && !oldPassword){
      dispatchAction(dispatch,'SET_ERROR','É necessário a senha antiga para alterar o e-mail ou a senha.')
      return
    } 
    if (password) {
      if (password !== confirmNewPassword) {
      dispatchAction(dispatch,'SET_ERROR','As senhas não conferem')
      return;
     }
    if(password.length < 6){
      return
    }
    userData.password = password;
    userData.oldPassword = oldPassword
  }
    dispatch({
      type:'SET_LOADING1',
      payload: {
        loading:true
      }
    })
    const data =  await updateProfile(userData)

    dispatch({
      type:'SET_LOADING1',
      payload: {
        loading:false
      }
    })

    if(data?.error){
      dispatchAction(dispatch,'SET_ERROR',data.error)
      return
    } 
    dispatchAction(dispatch,'SET_MESSAGE','Usuário atualizado com sucesso.')

};



  const handleFile = (e) => {
    const image = e.target.files[0];
    setPreviewImage(image);
    setProfileImage(image);
  };

  if(loading){
    return (
      <Loading />
    )
  }

  const handleChangle = (setter) => (e) => {
    setter(e.target.value)
    setIsChanged(true)
  }
  

  return (
    <div id="edit-profile">
      <h2>Edite seus dados</h2>
      <p className="subtitle">
        Adicione uma imagem de perfil e conte mais sobre você.
      </p>
      {(user.profileImage || previewImage) && (
        <img
          className="profile-image"
          src={
            previewImage
              ? URL.createObjectURL(previewImage)
              : user.profileImage
          }
          alt={user.name}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) =>e.preventDefault()}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          onChange={handleChangle(setName)}
          value={name || ""}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={handleChangle(setEmail)}
          value={email || ""}
        />
        <label>
          <span>Imagem de Perfil</span>
          <input type="file" onChange={handleFile} />
        </label>
        <label>
          <span>Bio</span>
          <input
            type="text"
            placeholder="Descriçao do perfil"
            onChange={handleChangle(setBio)}
            value={bio || ""}
          />
        </label>
        {/* <label>
          <span>Deseja alterar a senha? Digite sua senha antiga</span>
          <input
            type="password"
            placeholder="Digite a sua senha antiga"
            onChange={handleChangle(setOldPassword)}
            value={oldPassword || ""}
          />
        </label>
        <label>
          <span>Digite sua nova senha</span>
          <input
            type="password"
            placeholder="Digite a sua nova senha"
            onChange={handleChangle(setPassword)}
            value={password || ""}
          />
        </label>
        <label>
          <span>Confirme sua nova senha</span>
          <input
            type="password"
            placeholder="Digite a sua nova senha"
            onChange={handleChangle(setConfirmNewPassword)}
            value={confirmNewPassword || ""}
          />
        </label> */}
        {!loadingForm && isChanged && <input type="submit" value="Atualizar" />}
        {loadingForm && <input type="submit" value="Aguarde..." disabled />}
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
        { /*
        {nameError && <Message msg={"O nome precisa ter 2 caracteres "} type="error" />}
        {passwordError && <Message msg={"Senhas nao coincidem"} type="error" />}
        {ErrorTamPassword && <Message msg={"A senha precisa ter no mínimo 6 caracteres"} type="error" /> } */}
      </form>
    </div>
  );
};

export default EditProfile;
