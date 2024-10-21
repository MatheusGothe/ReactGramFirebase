//import "./PhotoItem.css";
import styles from "./PhotoItem.module.css";
import { uploads } from "../utils/config";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import {
  GlobalContext,
  GlobalDispatchContext,
} from "../state/context/GlobalContext";

// Animations
import Loading from "./Loading";
import Lottie from "react-lottie-player";
import LoadAnimationImage from "../utils/assets/loadAnimationImage.json";
import LikeECommentContainer from "./LikeECommentContainer";
import { deslike, like } from "../slices/photoSlice";
import { auth } from "../lib/firebase";

const PhotoItem = ({ user: currentUser, photo, onImageLoad }) => {
  const dispatch = useContext(GlobalDispatchContext);

  const { isLoading: loading } = useContext(GlobalContext);
  const [likes, setLikes] = useState(photo.likes);
  const [showHeart, setShowHeart] = useState(false);
  const [loadImage, setLoadImage] = useState(false);

  const handleDoubleClick = async (photo) => {
    // Show the heart regardless of whether the user has liked the photo or not
    setShowHeart(true);
    setTimeout(() => {
      setShowHeart(false);
    }, 1500);

    // Check if the user has already liked the photo
    if (photo.likes.includes(currentUser.id)) {
      console.log("User has already liked this photo.");
      return;
    }

    await handleLike(photo);
  };

  const handleLike = async (photo) => {
    await like(photo, dispatch);
  };

  const handleDeslike = async (photo) => {
    await deslike(photo, dispatch);
  };

  const handleImageLoad = () => {
    setLoadImage(true);
    onImageLoad(true);
  };

  return (
    <div className={styles.photo_item}>
      {showHeart && (
        <div className={styles.heart_like}>
          <BsHeartFill />
        </div>
      )}
      <div className={styles.photo_author}>
        {photo.user.profileImage ? (
          <div className={styles.author_info}>
            <img
              className={styles.photo_pequena}
              src={photo.user.profileImage}
              alt={"user.name"}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
            <span className={styles.nome}>
              <Link to={`/users/${photo.userId}`}> {photo.user.username}</Link>
            </span>
          </div>
        ) : (
          <div className={styles.author_info}>
            {photo.user && (
              <>
                <img
                  className={styles.photo_pequena}
                  src={`${uploads}/users/${photo.user.profileImage}`}
                  alt={"user.name"}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
                <span className={styles.nome}>
                  <Link to={`/users/${photo.user._id}`}>
                    {" "}
                    {photo.user.name}
                  </Link>
                </span>
              </>
            )}
          </div>
        )}
      </div>
      {photo.photoUrl && (
        <>
            {loadImage ? null : (
                <div
                  style={{
                    width: "100%",
                    paddingTop: `${(photo.height / photo.width) * 100}%`,
                    backgroundColor: "#121212",
                    position: "relative",
                    borderRadius:'5px'
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Lottie
                      className="lottie"
                      style={{
                        width: 80,
                        height: 80,
                        margin: "0 auto",
                        color:'black'
                      }}
                      loop
                      animationData={LoadAnimationImage}
                      play
                    />
                  </div>
                </div>
              )}
          <img
            className={styles.img}
            id={styles.imgPhoto}
            onDoubleClick={() => handleDoubleClick(photo)}
            src={photo.photoUrl}
            alt={photo.title}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onLoad={() => setLoadImage(true)}
          />
        </>
      )}

      <LikeECommentContainer
        photo={photo}
        user={currentUser}
        handleDeslike={handleDeslike}
        handleLike={handleLike}
      />
    </div>
  );
};
export default PhotoItem;
