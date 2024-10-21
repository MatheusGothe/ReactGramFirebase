import React, { useContext, useState } from "react";

import "./Home.css";
import styles from './Home.module.css'
// Componets
import { Link, useLocation } from "react-router-dom";
import Loading from "../../components/Loading";
// Hooks
import { useEffect } from "react";

// react ga

// Icons 
import { auth } from "../../lib/firebase";
import { GlobalContext, GlobalDispatchContext } from "../../state/context/GlobalContext";
import { getPhotos } from "../../slices/photoSlice";
import PhotoItem from '../../components/PhotoItem'



const Home = ({storyData}) => {
  
  const dispatch = useContext(GlobalDispatchContext)

  const {user,photos,isLoading:loading} = useContext(GlobalContext)
  const [showHeart, setShowHeart] = useState({});
  const [clicked,setCliked] = useState(false)
  const [imagesLoaded,setImagesLoaded] = useState(false)
  const [storyValue,setStoryValue] = useState('')

  const userAuth = auth.currentUser?.toJSON()

  const handleGetStorieValue = (r) => {
    setStoryValue(r)
    storyData(r)
  }



  useEffect(() => {
    
    getPhotos(userAuth,dispatch).then((photos)=> {
      setImagesLoaded(false)
    })
    
  },[])
  

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };
  


  if(loading && !imagesLoaded){
    return <Loading />
  }

  return (
    <div id="home">
      {/* <StoriesContainer getStorieValue={handleGetStorieValue} stories={stories} /> */}
      {user && (
        <>
          {Array.isArray(photos) && photos.map((photo) => (
            <div className="teste" key={photo.photoId}>
              <PhotoItem
                user={user}
                photo={photo}
                showHeart={showHeart[photo.id]}
                clicked={clicked}
                onImageLoad={handleImageLoad}
              />
              <div className={styles.btn_Link}>
                <Link className={styles.btnLink} to={`/photos/${photo.photoId}`}>
                  Ver mais
                </Link>
              </div>
            </div>
          ))}
          
          {photos.length < 1 && user && (
            <h2 className="no-photos">
              Ainda não há fotos publicadas,{" "}
              <Link to={`/users/${auth.currentUser.uid}`}>clique aqui</Link>
            </h2>
          )}
        </>
      )}
    </div>
  );  
};

export default Home;
