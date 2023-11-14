import React, { useContext, useEffect } from 'react'
import styles from './ShowFollowers.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { GlobalDispatchContext } from '../state/context/GlobalContext'
import { getUserFollowers } from '../slices/userSlice'

const ShowFollows = ({
  showFollowers,
  setShowFollowers,
  handleFollowContainer,
  currentUser,
  user,
  handleUnFollowContainer,
  loadingPequeno,
  showFollowing,
  setShowFollowing
}) => {

  const dispatch = useContext(GlobalDispatchContext)
   

    return (
      <>
        {showFollowers && (
            <div className="container_followers">
              <div className="cont">
                <div
                  className="follow_title"
                  style={{ color: "black", fontWeight: "500" }}
                >
                  Followers
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faTimes}
                    onClick={() => setShowFollowers(false)}
                    style={{
                      color: "#262626",
                      fontSize: "24px",
                      cursor: "pointer",
                    }}
                    />
                </div>
              </div>
              <div>
                <div className={styles.followers}>
                  {user.followersInfo && user.followersInfo.map((follower,index) => (
                    <div className={styles.follower} key={index}>
                      <div className={styles.img_name}>
                        <img
                          src={follower.profileImage}
                          alt={follower.username}
                          />
                        <span>
                          <Link
                            className="ltf"
                            to={`/users/${follower.id}`}
                            onClick={() => setShowFollowers(false)}
                            >
                            @{follower.username}
                          </Link>
                        </span>
                      </div>
                      <div className="btn_seguir_followers">
                        {currentUser &&
                          !(follower.id === currentUser.id) && (
                            <>
                              {currentUser.following.some(
                                (following) => {
                                  return following === follower.id
                                }
                                ) ? (
                                  <button
                                  className={styles.unfollow_btn}
                                  disabled={loadingPequeno}
                                  onClick={() =>
                                    handleUnFollowContainer(follower)
                                  }
                                  >
                                  Following
                                </button>
                              ) : (
                                <button
                                className={styles.follow_btn}
                                disabled={loadingPequeno}
                                onClick={() =>
                                  handleFollowContainer(follower)
                                }
                                >
                                  Follow
                                </button>
                              )}
                            </>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
          }
           {showFollowing && (
            <div className="container_followers">
              <div className="cont">
                {console.log(user)}
                <div
                  className="follow_title"
                  style={{ color: "black", fontWeight: "500" }}
                >
                  Following
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faXmark}
                    onClick={() => setShowFollowing(false)}
                    style={{
                      color: "#262626",
                      fontSize: "24px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="followers">
                  {user.followingInfo && user.followingInfo.map((following) => (
                    <div className="follower" key={following.id}>
                      <div className="img_name">
                        <img
                          src={following.profileImage}
                          alt={following.userName}
                        />
                        <span>
                          <Link
                            className="ltf"
                            to={`/users/${following.id}`}
                            onClick={() => setShowFollowing(false)}
                          >
                            @{following.username}
                          </Link>
                        </span>
                      </div>
                      <div className="btn_seguir_followers" >
                        {currentUser &&
                          currentUser.following &&
                          !(following.id === currentUser.id) && (
                            <>
                              {currentUser.following.some(
                                (follower) => {
                                 return follower  === following.id
                                }
                              ) ? (
                                <button
                                 className={styles.unfollow_btn}
                                  onClick={() =>
                                    handleUnFollowContainer(following)
                                  }
                                >
                                  Following
                                </button>
                              ) : (
                                <button
                                  className={styles.follow_btn}
                                  onClick={() =>
                                    handleFollowContainer(following)
                                  }
                                >
                                  Follow
                                </button>
                              )}
                            </>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )
};

export default ShowFollows