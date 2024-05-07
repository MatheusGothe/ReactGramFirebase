import "./LikeECommentContainer.css";
import styles from "./LikeECommentContainer.module.css";

import Message from "./Message";

//Hooks
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Icons
import { FaTrashAlt, FaRegComment } from "react-icons/fa";
import { BsHeart, BsHeartFill } from "react-icons/bs";

//Redux
import {
  like,
  deslike,
  getPhotoLikes,
  commentHome,
  comment,
  getComments,
  removeComment,
} from "../slices/photoSlice";
import {
  followUserContainer,
  unFollowUserContainer,
} from "../slices/userSlice";
//React-router-dom
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

// Icons
import { BsComment, BsCommentFill } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { uploads } from "../utils/config";
import Loading from "./Loading";
import {
  GlobalContext,
  GlobalDispatchContext,
} from "../state/context/GlobalContext";
import { auth } from "../lib/firebase";
import { dispatchAction } from "../utils/functions/dispatchActions";

const LikeECommentContainer = ({
  photo,
  user,
  loadingPequeno,
  handleLike,
  handleDeslike,
}) => {

  const dispatch = useContext(GlobalDispatchContext);

  const { error, message, isLoading,loading } = useContext(GlobalContext);

  const currentUser = auth.currentUser.toJSON();

  let { id } = useParams();

  //const liked = useSelector((state) => state.photo.liked)
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showHeart, setShowHeart] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  const handleComment = (e) => {
    e.preventDefault();

    console.log(commentText.trim())
    if(commentText == '' || commentText.trim() == ''){
      dispatchAction(dispatch,"SET_ERROR","Comentário não pode estar vazio.")
      return
    }

    const commentData = {
      comment: commentText,
      id: photo.photoId,
    };

    comment(commentData,dispatch)
    setCommentText("");
  };

  const handleFollowContainer = async(like) => {
  
    const followData= {
      user:like,
      userAuth:user
    }
    

    await followUserContainer(followData,dispatch)

  }

  const handleUnFollowContainer = async(like) => {

    const unFollowData= {
      user:like,
      userAuth:user
    }
    
    await unFollowUserContainer(unFollowData,dispatch)

  }



  const handleRemoveComment = async(comment,photo) => {

    if(loading){
      return;
    }

    const {commentId} = comment
    const {photoId} = photo

    const commentToRemove = {
      commentId,
      photoId
    }

    await removeComment(commentToRemove,dispatch)
    dispatchAction(dispatch,"SET_MESSAGE","Comentário Excluido.")

  };

  const showOrHideComments = async(photo) => {
    
    if (showComments === true) {
      setShowComments(false);

    } else {
      
      await getComments(photo,dispatch)
      setShowComments(true);

    }
  };

  const handleShowLikes = async(photo) => {

    await getPhotoLikes(photo,dispatch)


    setShowLikes(true);

  };

  const closeLikes = () => {
    setShowLikes(false);
  };
  if (photo.likes) {
    var userIds = photo.likes.map((like) => like.id);
  }


  const handleFollow = (like) => {
    const followData = {
      userId: like._id,
    };
  };

  const handleUnFollow = (like) => {
    const unFollowData = {
      userId: like._id,
    };
  };


  return (
    <>
      <div className="like">
        {photo.likes && (
          <>
            {photo.likes.includes(user.id) ? (
              <BsHeartFill
                id="deslike"
                disabled={loadingPequeno}
                onClick={() => handleDeslike(photo)}
              />
            ) : (
              <BsHeart
                id="like"
                disabled={loadingPequeno}
                onClick={() => handleLike(photo)}
              />
            )}
            <p onClick={() => handleShowLikes(photo)} className={styles.likeP}>
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
                  {photo.likesInfo &&
                    photo.likesInfo.map((like) => (
                      <div key={like.id} className={styles.like_item}>
                        <div className={styles.marco0}>
                          <img
                            className={styles.like_profile_image}
                            src={like.profileImage}
                            alt={like.name}
                          />
                          <Link to={`/users/${like.id}`}>
                            <p className={styles.like_name}>{like.username}</p>
                          </Link>
                        </div>
                        {!(user.id == like.id) ? (
                          user.following.some((follower) => {
                            return follower === like.id;
                          }) ? (
                            <button
                              className={styles.btn_seguir}
                              onClick={() => handleUnFollowContainer(like)}
                            >
                              Following
                            </button>
                          ) : (
                            <button
                              className={styles.btn_seguir}
                              onClick={() => handleFollowContainer(like)}
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
              onClick={() =>showOrHideComments(photo)}
            />
          </>
        )}
      </div>
      {showComments && !loading && (
        <div className={showComments ? styles.comments : ''}>
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
              {photo.comments.map((comment,i) => (
                <div key={i} className={styles.comment}>
                  <div className={styles.author}>
                    {comment?.user.profileImage && (
                      <img
                        className={styles.photo_comment}
                        src={comment.user.profileImage}
                        alt={comment.userName}
                      />
                    )}
                    {comment && (
                      <Link to={`/users/${comment.userId}`}>
                        <p className={styles.user_name}>{comment.user.name}</p>
                      </Link>
                    )}
                  </div>
                  <p className={styles.comment_comment}>{comment.comment}</p>
                  {user.id === photo.userId || comment.userId === user.id ? (
                    <FaTrashAlt
                      onClick={() => handleRemoveComment(comment,photo)}
                      className={styles.trash}
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

export default LikeECommentContainer;
