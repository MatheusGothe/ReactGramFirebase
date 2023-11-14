import React, { useEffect, useRef, useState } from 'react';
import styles from './PostStorie.module.css';
import Message from '../../components/Message';
import { uploads } from '../../utils/config';
import {FaTrash, FaTrashAlt} from 'react-icons/fa'

 const Storie = () => {

  const [confirmDeleteStorie,setConfirmDeleteStorie] = useState(false)

  const [file, setFile] = useState('');
  const newPhotoForm = useRef()

  const fileInputRef = useRef()



  const handleFile = (e) => {

    const image = e.target.files[0]

    setFile(image);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  

  };

  const handleDeleteStorie = (id) => {

  }

  return (
    <>
      <div className={styles.container}>
        <h1>Post a Story</h1>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <input
            style={{ width: "80%", margin: "10px auto" }}
            type="file"
            onChange={handleFile}
          />
          {file && <p>Selected file: {file.name}</p>}
          <div className={styles.divButton}>
            <button style={{ width: "60%" }} type="submit">
              Enviar
            </button>
          </div>
        </form>
        <div style={{ width: "60%", marginTop: "10px" }}>
          {}
          {/* {error && (
            <Message style={{ width: "80%" }} msg={error} type="error" />
          )}
          {success && message && <Message style={{with:"80%" }} msg={message} type="success"/> } */}
        </div>
      </div>
      <div className={styles.storyContainerPai}>
        <p>Stories:</p>
        <div className={styles.stories}>
          {/* {userStories.length > 0 &&
            userStories.map((story) => {
              const timeLeft = new Date(story.expirationDate) - new Date();
              const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
              let timeLeftText;
              if (hoursLeft < 1) {
                // Calcular o tempo restante em minutos
                const minutesLeft = Math.floor(timeLeft / (1000 * 60));
                timeLeftText = `${minutesLeft} minutos`;
              } else {
                timeLeftText = `${hoursLeft} horas`;
              }
              return (
                <div className={styles.storyContainer} key={story.Id}>
                  <img
                    className={styles.storyImg}
                    src={`${uploads}/stories/${story.storyImage}`}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>expira em: {timeLeftText}</p>
                    <FaTrashAlt onClick={() => handleDeleteStorie(story.Id)} />
                  </div>
                </div>
              );
            })} */}
        </div>
      </div>
    </>
  );
};

export default Storie
