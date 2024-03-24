import styles from './LikeCommentHome.module.css';

import Message from './Message';

//Hooks
import { useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';

// Icons
import {FaTrashAlt,FaRegComment, FaComment} from 'react-icons/fa'
import { BsHeart, BsHeartFill } from 'react-icons/bs';

//Redux
import {  like,deslike } from '../slices/photoSlice'
import { followUserContainer,unFollowUserContainer } from '../slices/userSlice';
import { useResetComponentMessage} from '../hooks/useResetComponentMessage'
//React-router-dom
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

// Icons
import {BsComment,BsCommentFill} from 'react-icons/bs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { uploads } from '../utils/config';
import Loading from './Loading';
import { getPhotoLikes } from '../slices/photoSlice';




const LikeCommmentHome = ({photo,user,commentHome,removeCommentHome,handleLike}) => {


  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch)

  const {currentUser,loading,loadingPequeno, error, message} = useSelector((state) => state.photo)
  const {user: userAuth} = useSelector((state) => state.auth)

  let {id} = useParams()

  const token = useSelector((state) => state.auth.token )
  const [likes, setLikes] = useState(photo.likes);
  const [showComments,setShowComments] = useState(false)
  const [commentText,setCommentText] = useState('')
  const [photoX, setPhotoX] = useState(null);
  const [showLikes,setShowLikes] = useState(false)

  const handleComment = (e) =>{
    e.preventDefault()
 
    const commentData = {
      comment: commentText,
      id: photo._id,
    }
   
   dispatch(commentHome(commentData))

   setCommentText('')


   resetMessage()
 }
 const closeLikes = () => {
  setShowLikes(false)
}

  


const handleDeslike = () => {
  const DeslikeData = {
    id: photo._id,
    userIdLiked: user._id
  }

  dispatch(deslike(DeslikeData));
};

 

 if(loading){
  return <Loading />
 }


 const handleRemoveComment = (CommentId) => {

    if(loadingPequeno){
      return
    }

    let photoId = photo._id
  const commentData = {
     CommentId,
     photoId,
     token
  }
  
  dispatch(removeCommentHome(commentData))
  
  resetMessage()
    
};

const showOrHideComments = () => {
  if(showComments === true){
    setShowComments(false)
    console.log('fechou')

  } else{
    setShowComments(true)
    console.log('abriu')


  }
}

const handleShowLikes = (photoId) => {

  console.log(photoId)

  setShowLikes(true)

 dispatch(getPhotoLikes(photoId))

}

const handleFollow = (like) => {
  
  const followData = {
    userId: like._id,
    token: userAuth.token
  }

  dispatch(followUserContainer(followData)).then(() => {
    dispatch(getPhotoLikes(photo._id));
  });
  
}

const handleUnFollow = (like) => {

  const unFollowData = {
    userId: like._id ,
    token: userAuth.token
  }

  dispatch(unFollowUserContainer(unFollowData)).then(() => {
    dispatch(getPhotoLikes(photo._id));
  });

}



  return (
    <>
      <div className="like">
        {photo.likes && user && (
          <>
            {photo.likes.includes(user._id) ? (
              <BsHeartFill id="deslike" disabled={loadingPequeno} onClick={handleDeslike} />
            ) : (
              <BsHeart id="like"  disabled={loadingPequeno} onClick={() => handleLike(photo)} />
            )}
            <p onClick={() => handleShowLikes(photo._id)} > 
              {photo.likes.length} {photo.likes.length === 1 ? "like" : "likes"}
            </p>
            {showLikes && (
              <div className={styles.showLikes}>
             <div className={styles.header}>
             <div className={styles.likeTitle}>Likes</div>
               <div className={styles.xIcon}>
                 <FontAwesomeIcon
                   icon={faXmark}
                   onClick={closeLikes}
                   style={{
                     color: "#262626",
                     fontSize: "24px",
                     cursor: "pointer",
                   }}
                 />
               </div>
             </div>
             <div className={styles.likes_container}>
                 {loadingPequeno && (
                  <p styles={{ position:"absolute",fontSize:"45px",zIndex:"55" }} >Carregando...</p>
                 )}
                  {photo.likesInfo && !loadingPequeno &&
                    photo.likesInfo.map((like) => (
                      <div key={like._id} className={styles.like_item}>
                        <div className={styles.marco0}>
                          <img
                            className={styles.like_profile_image}
                            src={`${uploads}/users/${like.profileImage}`}
                            alt={like.name}
                          />
                          <Link to={`/users/${like._id}`}>
                            <p className={styles.like_name}>{like.name}</p>
                          </Link>
                        </div>
                        {!(user._id == like._id) ? (
                          currentUser.following.some((follower) => {
                            
                            return follower._id === like._id;
                          }) ? (
                            <button
                              className={styles.btn_seguir}
                              onClick={() => handleUnFollow(like)}
                            >
                              Following
                            </button>
                          ) : (
                            <button
                              className={styles.btn_seguir}
                              onClick={() => handleFollow(like)}
                            >
                              Follow
                            </button>
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>
           </div>
            )}
            <FaRegComment
              className="comment-icon"
              onClick={showOrHideComments}
            />
          </>
        )}
      </div>
      {showComments && (
        <div className={showComments ? styles.comments : console.log("Falso")}>
          {photo.comments && (
            <>
              <h3>Comentários {photo.comments.length}</h3>
              <form onSubmit={handleComment}>
                <input
                  type="text"
                  placeholder="Insira seu comentário..."
                  onChange={(e) => setCommentText(e.target.value)}
                  value={commentText || ""}
                />
                <input type="submit" value="Enviar" disabled={loadingPequeno} />
              </form>
              {photo.comments.length === 0 && <p>Não há comentários</p>}
              {photo.comments.map((comment) => (
                <div key={comment.CommentId} className={styles.comment}>
                  <div className={styles.author}>
                    {comment?.userImage && (
                      <img
                        className={styles.photo_comment}
                        src={`${uploads}/users/${comment.userImage}`}
                        alt={comment.userName}
                      />
                    )}
                    {comment && (
                      <Link to={`/users/${comment.userId}`}>
                        <p className={styles.user_name}>{comment.userName}</p>
                      </Link>
                    )}
                  </div>
                  <p className={styles.comment_comment}>{comment.comment}</p>
                  {user._id === photo.userId || comment.userId === user._id ? (
                    <FaTrashAlt
                      onClick={() => handleRemoveComment(comment.CommentId)}
                      className={styles.trash}
                      disabled={loadingPequeno}
                    />
                  ) : null}
                </div>
              ))}
            </>
          )}
          {error && <Message msg={error} type="error" />}
          {message && (
            <Message
              style={{ marginBottom: "12px" }}
              msg={message}
              type="success"
            />
          )}
        </div>
      )}
    </>
  );
};


export default LikeCommmentHome;
