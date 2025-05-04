import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  orderBy,
} from "firebase/firestore";
import { api, requestConfig } from "../utils/config";
import { auth, db } from "../lib/firebase";
import { uploadImage } from "../utils/functions/UploadPhoto";
import { deleteObject, getStorage, ref } from "firebase/storage";
import {v4 as uuidv4} from 'uuid'
import { useRef } from "react";
import { dispatchAction } from "../utils/functions/dispatchActions";

// Função para obter as dimensões da imagem
const getImageDimensions = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = (error) => {
      reject(error);
    };
  });
};

// Publicar uma foto
const publishPhoto = async (photo, dispatch, photos) => {
  const { title, image } = photo;
  const user = auth.currentUser;

  // Crie o documento primeiro
  const userDocRef = doc(db, "users", user.uid);

  const document = {
    title,
    likes: [],
    comments: [],
    username: user.displayName,
    userId: user.uid,
    user: userDocRef,
    timestamp: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, "posts"), document);

  const photoId = docRef.id;
  document.photoId = docRef.id;

  try {
    // Depois faça o upload da imagem
    const url = await uploadImage({ photo: image, title: docRef.id }, (progress) => {
    });

    // Obtenha as dimensões da imagem
    const { width, height } = await getImageDimensions(url);

    // Atualize o documento com a URL da imagem e as dimensões
    await updateDoc(docRef, { photoUrl: url, photoId, width, height });

    document.photoUrl = url; // Atualize a URL da foto no objeto do documento local
    document.width = width; // Adicione a largura da imagem ao objeto do documento local
    document.height = height; // Adicione a altura da imagem ao objeto do documento local

    dispatch({
      type: "SET_PHOTOS",
      payload: {
        photos: [document, ...photos],
      },
    });

    return { title, url };
  } catch (error) {
    console.log(error);

    // Se o upload falhar, delete o documento
    await deleteDoc(docRef);
    return { error: error };
  }
};

// Get user photos
const getUserPhotos = async (id, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/photos/user/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Delete a photo
const deletePhoto = async (id, dispatch, photos) => {

 // const userDocRef = doc(db, "users", user.uid);
  try {
    const q = query(collection(db, "posts"), where("photoId", "==", id));
    const querySnapShot = await getDocs(q);
    querySnapShot.forEach(async (doc) => {
      const data = doc.data();
      const storage = getStorage();
      const storageRef = ref(storage, `images/${data.photoId}`);
      await deleteObject(storageRef);
      await deleteDoc(doc.ref);
    });
    const updatedPhotos = photos.filter((photo) => photo.photoId !== id);

    dispatch({
      type: "SET_PHOTOS",
      payload: {
        photos: updatedPhotos,
      },
    });
  } catch (error) {}
};

// Update a photo
const updatePhoto = async(data) => {

  try {

    const docRef = doc(db,'posts',data.id)

    await updateDoc(docRef,{ title: data.title})
    
  
  } catch (error) {
    console.log(error);
  }
};

// Get a photo by id
const getPhoto = async (id) => {
  try {
    const userAuthRef = doc(db,'users',auth.currentUser.uid)
    const userAuthSnap = await getDoc(userAuthRef)

    const photoRef = doc(db, "posts", id);

    const photoSnapShot = await getDoc(photoRef);

    if (!photoSnapShot.exists()) {
      return;
    }

    const userRef = photoSnapShot.data().user;

    const userSnap = await getDoc(userRef);

    const user = userSnap.data();

    const post = photoSnapShot.data();

    post.user = user;

    return {post,user:userAuthSnap.data()};
  } catch (error) {
    console.log(error);
  }
};

// Like a photo
const like = async (photo, dispatch) => {
  const id = photo.photoId;
  const currentUserId = auth.currentUser.uid;
  try {
    const postRef = doc(db, "posts", id);

    await updateDoc(postRef, {
      likes: arrayUnion(currentUserId),
    });

    photo.likes.push(currentUserId);
    return photo.likes;
  } catch (error) {
    console.log(error);
    return { error: error };
  }
};

const deslike = async (id) => {
  const currentUserId = auth.currentUser.uid;

  try {
    const postRef = doc(db, "posts", id);

    await updateDoc(postRef, {
      likes: arrayRemove(currentUserId),
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return error;
  }
};

// Add coment to photo
const comment = async (data, dispatch) => {
  const { comment, id } = data;

  const userId = auth.currentUser.uid

  try {
    const postRef = doc(db, "posts", id);

    const post = await getDoc(postRef);

    const userRef = doc(db,'users',userId)

    const user = await getDoc(userRef)


    if (post.exists()) {
      const newComment = {
        commentId: uuidv4(),
        comment,
        userId
      };

      await updateDoc(postRef,{
        comments:arrayUnion(newComment)
      })

      return {newComment,user:user.data()}
     
    }
  } catch (error) {
    console.log(error);
  }
};



const getComments = async (photo) => {
  const id = photo.photoId;

  try {
    const postRef = doc(db, 'posts', id);
    const post = await getDoc(postRef);
    const comments = post.data().comments;

    const userDataCache = {};
    const commentsWithUserData = await Promise.all(
      comments.map(async (comment) => {
        if (!userDataCache[comment.userId]) {
          const userRef = doc(db, 'users', comment.userId);
          const userDoc = await getDoc(userRef);
          userDataCache[comment.userId] = userDoc.data();
        }
        comment.user = userDataCache[comment.userId];
        return comment;
      })
    );


    return commentsWithUserData;
  } catch (error) {
    console.log(error);
  }
};

// Remove coment to photo
const removeComment = async (data) => {


  const {photoId,commentId} = data

  try {
    
    const postRef = doc(db,'posts',photoId)

    const post = await getDoc(postRef)
    
    const udpatedPost = post.data().comments.filter((comment) => {
      
      return comment.commentId !== commentId
    })

    await updateDoc(postRef,{comments:udpatedPost})

    return udpatedPost


  } catch (error) {
    console.log(error);
  }
};
// Remove coment to photo
const removeCommentHome = async (photoId, CommentId, token) => {
  const config = requestConfig("DELETE", photoId, token);

  try {
    const res = await fetch(
      api + `/photos/remove/${photoId}/${CommentId}`,
      config
    )
      .then((res) => res.json())
      .catch((err) => err);

    /*  if(res.errors){
            return res.errors[0]
        }   */
    return [res, CommentId];
  } catch (error) {
    console.log(error);
  }
};
// Get all photos
const getPhotos = async (user) => {
  try {
    const userRef = doc(db,'users',user.uid)
    const userSnap = await getDoc(userRef)

    const photoCollections = collection(db, "posts");

    // Use orderBy to sort the photos by timestamp
    const photoSnapShot = await getDocs(query(photoCollections, orderBy("timestamp", "desc")));

    const photos = await Promise.all(
      photoSnapShot.docs.map(async (doc) => {
        
        const photoData = doc.data();

        const userData = await getDoc(photoData.user);

        photoData.user = userData.data();

        return photoData;
      })
    );

    return { photos,user:userSnap.data()};
  } catch (error) {
    console.log(error);
  }
};


// Get users who liked a photo
const getPhotoLikes = async(photo) => {
  
  
  try {
    const likes  = photo.likes

    const userDocs = await Promise.all(likes.map((id) => {
      const userRef = doc(db,'users',id)
      return getDoc(userRef)
    }))

    const users = userDocs.map((user) => {
      return user.data()
    })
    
    return users
  } catch (error) {
    console.log(error);
  }
};

// Search photo by title
const searchPhotos = async (query, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/photos/search?q=" + query, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const photoService = {
  publishPhoto,
  getUserPhotos,
  deletePhoto,
  updatePhoto,
  getPhoto,
  like,
  deslike,
  comment,
  removeComment,
  getPhotos,
  getComments,
  removeCommentHome,
  getPhotoLikes,
  searchPhotos,
};

export default photoService;
