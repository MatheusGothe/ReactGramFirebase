import { api, uploads } from '../utils/config';
import { Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { like, deslike,removeComment, comment } from '../slices/photoSlice';
import LikeECommentContainer from './LikeECommentContainer';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { FaComment,FaRegComment } from 'react-icons/fa'
import { useResetComponentMessage } from '../hooks/useResetComponentMessage';
import { useParams } from 'react-router-dom';
import Message from './Message';
import styles from'./PhotoItemHome.module.css'

//Hooks
import { useEffect, useState } from 'react';


// Icons
import {FaTrashAlt,} from 'react-icons/fa'


//React-router-dom

// Icons
import {BsComment,BsCommentFill} from 'react-icons/bs'

import Loading from './Loading';



const PhotoItemHome = ({photo,handleDoubleClick,showHeart,clicked}) => {

    const dispatch = useDispatch();

    const {user} = useSelector((state) => state.auth )
    const { loading, error, message} = useSelector((state) => state.photo)
    const [likes, setLikes] = useState(photo.likes);
   // const [showHeart, setShowHeart] = useState(false);
  
  const resetMessage = useResetComponentMessage(dispatch)


  let {id} = useParams()

  const token = useSelector((state) => state.auth.token )
  const [showComments,setShowComments] = useState(false)
  const [commentText,setCommentText] = useState('')
//  const [clicked,setCliked] = useState(false)

 

  const handleLike = () => {
    dispatch(like(photo._id));
    setLikes([...likes, user._id]);
    console.log('likfdafdasfsae')
  };

  const handleDeslike = () => {
    dispatch(deslike(photo._id));
    setLikes(likes.filter((like) => like !== user._id));
    console.log(deslike);
  };


  const handleComment = (e) =>{
    e.preventDefault()

    
    const commentData = {
      comment: commentText,
      id: photo._id
    }
    
   dispatch(comment(commentData))

   setCommentText('')

   resetMessage()

 }


 if(loading){
  return <Loading />
 }


 const handleRemoveComment = (CommentId) => {

  console.log(id)
  console.log(CommentId)
  const commentData = {
     CommentId,
     id,
     token
  }

  dispatch(removeComment(commentData))
  
  resetMessage()
    
};

  return (
    <div className={styles.photo_item}>
    {showHeart ? (
      <div className={styles.heart_like}>
        <BsHeartFill />
      </div>
    ) : ''}
    <div className={styles.photo_author}>
      {photo.profileImage ? (
        <div className={styles.author_info}>
          <img
            id={styles.photo_pequena}
            src={`${uploads}/users/${photo.profileImage}`}
            alt={user.name}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
          <span className={styles.nome}>
            <Link to={`/users/${photo.userId}`}> {photo.userName}</Link>{" "}
          </span>
        </div>
      ) : (
        <div className={styles.author_info}>
          <img
            className={styles.photo_pequena}
            src={`${uploads}/users/${user.profileImage}`}
            alt={user.name}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
          <span className={styles.nome}>{photo.userName}</span>
        </div>
      )}
    </div>
    {photo.image && (
      <>
        <img
          className={styles.img}
          id="imgPhoto"
          onDoubleClick={() => handleDoubleClick(photo)}
          src={`${uploads}/photos/${photo.image}`}
          alt={photo.title}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          //onDoubleClick={() => handleClick(photo)}
        />
      </>
    )}
    {/* <div className='linha'></div> */}
    
  </div>
);
}

export default PhotoItemHome