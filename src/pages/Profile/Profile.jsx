import './Profile.css'

import { uploads } from '../../utils/config'

// components
import Message from '../../components/Message'
import { Link } from 'react-router-dom'
import { BsFillEyeFill, BsPencilFill, BsXLg } from 'react-icons/bs'

// hooks
import { useState,useEffect,useRef, useContext } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import Loading from '../../components/Loading'

//Icons

import LoadingBall from '../../components/LoadingBall'
import { auth } from '../../lib/firebase'
import { followUser, followUserContainer, getUserDetails, getUserFollowers, getUserFollowing, unFollowUser, unFollowUserContainer } from '../../slices/userSlice'
import { deletePhoto, publishPhoto, updatePhoto } from '../../slices/photoSlice'
import { GlobalContext, GlobalDispatchContext } from '../../state/context/GlobalContext'
import { dispatchAction } from '../../utils/functions/dispatchActions'
import ShowFollows from '../../components/ShowFollows'
import { Slide, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const Profile = () => {

    const dispatch = useContext(GlobalDispatchContext)

    const [showFollowers,setShowFollowers] = useState(false)
    const [showFollowing,setShowFollowing] = useState(false)
    const {user,loading,currentUser,isLoading,loadingPequeno,message,error,photos} = useContext(GlobalContext)
    const {
      loading: loadingPhoto,
      message: messagePhoto,
      error: errorPhoto,
      uploadProgress
    } = useContext(GlobalContext)

    

    const [title,setTitle] = useState('')
    const [image,setImage] = useState('')
    const [dragLink, setDragLink] = useState(null);
    const [editId, setEditId] = useState('')
    const [editImage,setEditImage] = useState('')
    const [editTitle, setEditTitle] = useState('')
    const [titleToEdit,setTitleToEdit] = useState('')
    const fileInput = useRef()
    const [loadingEditForm,setLoadingEditForm] = useState(false)
   
    const {id} = useParams()

    // New form and edit forms ref
    const newPhotoForm = useRef()
    const editPhotoForm = useRef()

    useEffect(()=> {
      const fetchUserDetails = async() => {
        try {
          await getUserDetails(id,dispatch)
        } catch (error) {
          console.log(error)
        }
      }
      fetchUserDetails(id)
    },[dispatch,id])
  

    const handleFile = (e) => {

        const image = e.target.files[0];
        setImage(image)
      };
  
   // show or hide forms
   const hideOrShowForms = () => {
      newPhotoForm.current.classList.toggle("hide")
      editPhotoForm.current.classList.toggle("hide")
   }


   const handleUpdate = (e) => {
    e.preventDefault()
    if(editTitle == titleToEdit){
      dispatchAction(dispatch,'SET_ERROR','Titulo não pode ser o mesmo.')
      return
    }
    setLoadingEditForm(true)
    

    const data = {
      id: editId,
      title: editTitle
    }

    const res = updatePhoto(data,dispatch)


    toast.success('Foto atualizada')
    



    setLoadingEditForm(false)
    hideOrShowForms()

   }

   const handleDelete = async(photoId) => {

      await deletePhoto(photoId,dispatch,photos)

   }

     // Open edit form
     const handleEdit = (photo) => {
      if(editPhotoForm.current.classList.contains("hide")){
          hideOrShowForms()
      }
      setTitleToEdit(photo.title)
      setEditId(photo.photoId)
      setEditTitle(photo.title)
      setEditImage(photo.photoUrl)
   }
  
   const handleCancelEdit = (e) => {
    e.preventDefault()
      hideOrShowForms()
 
   }

   const submitHandle = async(e) => {
    e.preventDefault()

    if(!title){
      dispatchAction(dispatch,'SET_ERROR','O título é obrigatório')
      return
    }
    if(!image){
      dispatchAction(dispatch,'SET_ERROR','É necessário enviar uma imagem')
      return
    }

    const photo = {
      title,
      image
    }

    const res = await publishPhoto(photo,dispatch,photos)
  
      if(res){
        dispatchAction(dispatch,'SET_ERROR',res)
        return
      }
      setTitle('')
      fileInput.current.value = ''
      dispatchAction(dispatch,'SET_MESSAGE','Foto publicada')
    
   }

    
    // SHOW FOLLOWERS
    const handleShowFollowers = async() => {
      await getUserFollowers(user,dispatch)
      
      setShowFollowers(true)

    }

    // SHOW FOLLOWING
    const handleShowFollowing = async() => {
    
      await getUserFollowing(user,dispatch)

      setShowFollowing(true)
    }

    const handleUnFollow = (user) => {

      const unFollowData= {
        user,
        userAuth:currentUser
      }
      
      unFollowUser(unFollowData,dispatch)

    }

    const handleFollow = (user) => {

      const followData = {
        user, 
        userAuth:currentUser
      }

      followUser(followData,dispatch)

    }

    const handleFollowContainer = async(user) => {
  
      const followData = {
        user, 
        userAuth:currentUser
      }

      await followUserContainer(followData,dispatch)

    }
    const handleUnFollowContainer = async(user) => {

      const unFollowData= {
        user,
        userAuth:currentUser
      }
      
      await unFollowUserContainer(unFollowData,dispatch)

    }

const isFollowing = user.followers && user.followers.some((follower) => {
    return follower === currentUser.id

})

  if(loading){
    return <Loading />
  }
 
  return (
    <div id="profile">
      <ToastContainer autoClose={2000} transition={Slide} hideProgressBar draggable />
      <div className="profile-header">
        {user.profileImage && (
          <img
            src={user.profileImage}
            alt={user.name}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        )}
        <div className="profile-description">
          <h2> {user.username} </h2>
          <p>{user.bio}</p>
          {currentUser.id !== user.id &&
            (isFollowing ? (
              <button
                className="btn-foll"
                disabled={loadingPequeno || showFollowers || showFollowing}
                onClick={() => handleUnFollow(user)}
              >
                Following
              </button>
            ) : (
              <button
                disabled={loadingPequeno || showFollowers || showFollowing}
                onClick={() => handleFollow(user)}
                className="btn-foll"
              >
                Follow
              </button>
            ))}
          <p onClick={handleShowFollowers} className="p-foll">
            {" "}
            {user.followers?.length} Followers
          </p>
          <p onClick={handleShowFollowing} className="p-foll">
            {" "}
            {user.following?.length} Following
          </p>
          {loadingPequeno ? <LoadingBall /> : ""}
        </div>
      </div>
      {currentUser.id === user.id && (
        <>
          <div className="new-photo" ref={newPhotoForm}>
            <h3>Compartilhe algum momento seu:</h3>
            <form onSubmit={submitHandle}>
              <label>
                <span>Título para a foto</span>
                <input
                  type="text"
                  placeholder="Insira um título"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title || ""}
                />
              </label>
              <label>
                <span>Imagem:</span>
                <input type="file" accept='image/*' onChange={handleFile} ref={fileInput} />
              </label>
              {!isLoading && <input type="submit" value="Postar" />}
              {isLoading && <input type="submit" disabled value="Aguarde..." />}
              {/* {message && <Message msg={message} type='success' /> } */}
            </form>
          </div>
          <div className="edit-photo hide" ref={editPhotoForm}>
            <p>Editando:</p>
            {editImage && (
              <img
                src={editImage}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                alt={editTitle}
              />
            )}
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder="Insira o novo titulo"
                onChange={(e) => setEditTitle(e.target.value)}
                value={editTitle || ""}
                disabled={loadingEditForm}
              />
              <input type="submit" value="Atualizar" />
              <button className="cancel-btn" onClick={(e) => handleCancelEdit(e)}>
                Cancelar edição
              </button>
            </form>
          </div>
          {error && <Message msg={error} type="error" />}
          {messagePhoto && <Message msg={messagePhoto} type="success" />}
        </>
      )}
      <ShowFollows
        handleShowFollowers={handleShowFollowers}
        showFollowers={showFollowers}
        setShowFollowers={setShowFollowers}
        user={user}
        currentUser={currentUser}
        showFollowing={showFollowing}
        setShowFollowing={setShowFollowing}
        handleFollowContainer={handleFollowContainer}
        handleUnFollowContainer={handleUnFollowContainer}
      />
      <div className="user-photos">
        <h2>Fotos publicadas:</h2>
        <div className="photos-container">
          {photos.length == 0 && (
            <p>Nenhuma foto para ver ainda</p>
          )}
          {photos &&
            photos.map((photo) => (
              <div className="photo" key={photo.photoId}>
                {photo.photoUrl && (
                  <Link to={`/photos/${photo.photoId}`}>
                    <img
                      className="img-t"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                      src={photo.photoUrl}
                      alt={photo.title}
                    />
                  </Link>
                )}
                {id === auth.currentUser.uid ? (
                  <div className="actions">
                    <Link to={`/photos/${photo.photoId}`}>
                      <BsFillEyeFill />
                    </Link>
                    <BsPencilFill onClick={() => handleEdit(photo)} />
                    <BsXLg onClick={() => handleDelete(photo.photoId)} />
                  </div>
                ) : (
                  <Link className="btn btn-ver" to={`/photos/${photo.photoId}`}>
                    <BsFillEyeFill />
                  </Link>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );

}

export default Profile