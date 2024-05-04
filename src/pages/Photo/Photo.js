import styles from './Photo.module.css'


// hooks
import { useEffect,useState,useRef, useContext } from 'react'
import { useParams } from 'react-router-dom'

import {FaTrashAlt, FaComment} from 'react-icons/fa'

import { BsHeart, BsHeartFill } from "react-icons/bs";
import { GlobalContext, GlobalDispatchContext } from '../../state/context/GlobalContext';
import PhotoItem from '../../components/PhotoItem';
import { getPhoto } from '../../slices/photoSlice';
import { auth } from '../../lib/firebase';
import Loading from '../../components/Loading';



const Photo = () => {

   let {id,CommentId} = useParams()

   const dispatch = useContext(GlobalDispatchContext)

   const {photos,user,isLoading} = useContext(GlobalContext)

   const [commentText,setCommentText] = useState('')
   const [showComments,setShowComments] = useState(false)
   const [divMessage, setDivMessage] = useState(true)
   const [liked,setLiked] = useState(false)
   const [showHeart, setShowHeart] = useState(false);
   const [likeDisabled, setLikeDisabled] = useState(false);

   useEffect(() => {
    const loadPhotos = async(id) => {
  
      await getPhoto(id,dispatch)
    }
    loadPhotos(id)
   },[])
   

   useEffect(() => {
     console.log(isLoading)
   }, [isLoading])
   
   if(isLoading){
    return <Loading />
   }
   

  return (
    <div id="photo">
      {photos && photos.map((photo,index) => (
        <PhotoItem user={user} photo={photo} key={index} />
      )) }
      {showHeart && (
        <div className={styles.heart_like}>
          <BsHeartFill />
        </div>
      )}

      <div className={styles.div_icon}></div>
    </div>
  );
}

export default Photo