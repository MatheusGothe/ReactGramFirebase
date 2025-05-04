import React, { useEffect, useState } from 'react'
import styles from './StoriesContainer.module.css'
import { getStories, getUserStories } from '../slices/storeSlice'

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'


import Stories from 'react-insta-stories'

import { useWindowDimensions } from '../hooks/useWindowDimensions'

const StoriesContainer = ({stories,getStorieValue}) => {

  const [showStories, setShowStories] = useState(false);
  const { userStories,loading } = useSelector((state) => state.stories);

  const { width, height } = useWindowDimensions();
  
  useEffect(() => {
    dispatch(getStories());
  }, []);

  useEffect(() =>{
    getStorieValue(showStories)
  },[showStories])


  useEffect(() => {

    if (showStories) {
      document.body.style.overflow = 'hidden';

    } else {
      document.body.style.overflow = 'visible';
    }
  }, [showStories]);

  const uniqueStories = stories.filter((story, index, self) =>
    index === self.findIndex((t) => t.userId === story.userId)
  );

  const handleShowStories = async(id) => {
    setShowStories(true);
    getStorieValue(showStories)
    await dispatch(getUserStories(id));

  };

    const updatedUserStories = userStories.length > 0 && userStories.map((story) => {
      
    const expirationDate = new Date(story.expirationDate);
    expirationDate.setDate(expirationDate.getDate() - 1);
    const currentDate = new Date();
    const timeDifferenceInHours = Math.round((currentDate - expirationDate) / 3600000);
    
    let timeDifferenceString;
    if (timeDifferenceInHours >= 1) {
      timeDifferenceString = `${timeDifferenceInHours} horas`
  } else {
      const timeDifferenceInSeconds = Math.round((currentDate - expirationDate) / 1000);
      if (timeDifferenceInSeconds < 5) {
          timeDifferenceString = ' agora';
      } else if (timeDifferenceInSeconds < 60) {
          timeDifferenceString = `há ${timeDifferenceInSeconds} segundos`;
      } else {
          const timeDifferenceInMinutes = Math.round(timeDifferenceInSeconds / 60);
          timeDifferenceString =
              timeDifferenceInMinutes > 1 ? `há ${timeDifferenceInMinutes} minutos` : `há ${timeDifferenceInMinutes} minuto`;
      }
    
    }
    return {
      ...story,
      duration: 3000,
      header: {
        heading: story.userName,
        subheading: `Postado  ${timeDifferenceString}`,
      },
    };
  });

  const StoryHeader = ({ heading, subheading, profileImage }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={profileImage}
          alt={heading}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "20px",
            marginRight: "10px",
          }}
        />
        <div>
          <h4 style={{ margin: 0 }}>{heading}</h4>
          <p style={{ margin: 0 }}>{subheading}</p>
        </div>
      </div>
      <div></div>
    </div>
  );
  
  return (
    <div className={styles.stories}>
      {loading && <p>Carregando...</p>}
      {showStories && userStories.length > 0 && updatedUserStories && (
        <div className={styles.div_storie}>
                <FontAwesomeIcon
                   icon={faXmark}
                   className={styles.x_icon}
                   onClick={() => {
                    setShowStories(false)
                    getStorieValue(showStories)
                  }}
                 />

        <Stories
          stories={updatedUserStories}
          defaultInterval={1500}
          keyboardNavigation={true}
          width={350}
          height={height - 60}  
          header={StoryHeader}
          onAllStoriesEnd={() => {
            const currentUserIndex = uniqueStories.findIndex(
              (story) => story.userId === userStories[0].userId
            );
            const nextUserIndex = (currentUserIndex + 1) % uniqueStories.length;
            const nextUserId = uniqueStories[nextUserIndex].userId;
            handleShowStories(nextUserId);
            setShowStories(false)
            getStorieValue(showStories)
          }}
        />
      </div>
      )}
      {uniqueStories && !showStories &&
        uniqueStories.map((storie) => (
          <div
          onClick={() => handleShowStories(storie.userId)}
          key={storie.Id}
          className={styles.div_storie}
      >
          <div className={styles.storieImgOuterWrapper}>
              <div className={styles.storieImgWrapper}>
                  <img
                      className={styles.storieImg}
                  />
              </div>
          </div>
          <p style={{ fontSize: "10px" }}> {storie.userName} </p>
      </div>
      
      
        ))}
    </div>
  );
};

export default StoriesContainer;
