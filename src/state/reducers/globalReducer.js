import { auth } from "../../lib/firebase";


export const globalReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":{

      return {
        ...state,
        user: action.payload.user,
        currentUser: action.payload.user
      };
    }
    case "SET_CURRENT_USER":{
      return {
        ...state,
        currentUser: action.payload.currentUser,
      };
    }
    case "SET_LOADING":{
      return {
        ...state, 
        isLoading: action.payload.isLoading,
      };
    }
    case "SET_IS_AUTHENTICATED":{
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
      }
     }
    case "SET_IS_ONBOARDED": {
      return {
        ...state,
        isOnboarded: action.payload.isOnboarded,
      }
    }
    case "SET_IS_UPLOAD_POST_MODAL_OPEN": {
      return {
        ...state,
        isUploadPostModalOpen: action.payload.isOnboarded,
      }
    }
    case "SET_INFO": {
      return {
        ...state,
        info: action.payload.info
      }
    }
    case "SET_MESSAGE": {
      return {
        ...state,
        message: action.payload
      }
    }
    case "SET_ERROR": {
      return {
        ...state,
        error: action.payload
      }
    }
    case "SET_PHOTOS": {
      return {
        ...state,
        photos: action.payload.photos
      }
    }
    case "UPDATE_PHOTO_LIKES": {

      const updatedPosts = state.photos.map((photo) => {
        if(photo.photoId === action.payload.photoId){
          return { ...photo,likes:action.payload.likes}
        } else{
          return photo
        }
      })
      
      return {...state,photos: updatedPosts}
    }
    
    case "UPDATE_PHOTO_DESLIKE": {

      const updatedPhotos = state.photos.map((photo) => {
        if(photo.photoId === action.payload.photoId){
          const updatedLikes = photo.likes.filter((userId) => {
           return userId !== action.payload.userId
          })
            
          return {...photo,likes:updatedLikes}
        }else {
          return photo
        }
      })
      
      return {...state,photos: updatedPhotos}
    }
    
    
    case "SET_LOADING1": {
      return {
        ...state,
        loading: action.payload.loading
      }
    }
    case "SET_PHOTO": {
      return {
        ...state,
        photo: action.payload.photo
      }
    }
    case "SET_PHOTO_COMMENTS": {
      const updatedPhotos = state.photos.map((photo) => {
        if(photo.photoId === action.payload.id) {
          return {
            ...photo,
            comments: action.payload.comment
          };
        } else {
          return photo;
        }
      });
    
      return {
        ...state,
        photos: updatedPhotos
      };
    }
    
    case "SET_COMMENT": {
        const updatedPhotos = state.photos.map((photo) => {
          if(photo.photoId == action.payload.id){
            const newComment = {
              commentId: action.payload.comment.commentId,
              comment:action.payload.comment.comment,
              user:action.payload.user
            }
            return {
              ...photo,
              comments: [...photo.comments, newComment]
            }
          } else {
            return photo
          }
        })
        return {
          ...state,
          photos: updatedPhotos
        }
  
    }
    case "DELETE_COMMENT": {
      // Encontre a foto que está sendo atualizada
      const updatedPhotos = state.photos.map((photo) => {
        if (photo.photoId === action.payload.id) {
         
          const updatedComments = photo.comments.filter((comment) => {
            return comment.commentId !== action.payload.commentId;
          });
          // Retorne a foto com os comentários atualizados
          return { ...photo, comments: updatedComments };
        } else {
          // Se a foto não está sendo atualizada, retorne-a como está
          return photo;
        }
      });
    
      // Retorne o novo estado com as fotos atualizadas
      return { ...state, photos: updatedPhotos };
    }
    case "SET_FOLLOW": {
      const { user, userAuth } = action.payload;

      // Atualize o estado do usuário
      const updatedUser = {
        ...user,
        followers: [...user.followers, userAuth.id]
      };
    
      // Atualize o estado do userAuth
      const updatedUserAuth = {
        ...userAuth,
        following: [...userAuth.following, user.id]
      };
    
      // Atualize a lista de usuários no estado
      return {
        ...state,
        user:updatedUser,
        currentUser:updatedUserAuth
      };
    }
    case "SET_UNFOLLOW": {
      const { user, currentUser } = action.payload;

      // Atualize o estado do usuário
      const updatedUser = {
        ...user,
        followers: user.followers.filter(uid => uid !== currentUser.id)
      };
    
      // Atualize o estado do userAuth
      const updatedUserAuth = {
        ...currentUser,
        following: currentUser.following.filter(id => id !== user.id)
      };
    
      // Atualize a lista de usuários no estado
      return {
        ...state,
        user: updatedUser,
        currentUser: updatedUserAuth
      };
    }
    case "SET_FOLLOWERS_INFO": {
      if(!state.user.followersInfo) {
        state.user.followersInfo = [];
        state.user.followersInfo = state.user.followersInfo.concat(action.payload.followers)
        return {...state,}
      }

      
      
      return {...state,}
    }
    case "SET_FOLLOWING_INFO": {

      state.user.followingInfo = []
      state.user.followingInfo = state.user.followingInfo.concat(action.payload.following)
      return {...state,}
    }

    case "CLEAR_PHOTOS": {
      return {...state,photos:[]}
    }
        
    case "SMALL_LOADING": {
      return {
        ...state,
        smallLoading: action.payload.smallLoading
      }
    }
    case "SET_FOLLOW_CONTAINER": {

      if(state.user.id === state.currentUser.id){
        // quer dizer que o o currentUser esta é igual ao user que esta na tela
        state.user.following.push(action.payload.userAuth.id)
        
      }
      // Se nao cair aqui quer dizer que estou atualizando likes
      //  state.user.following.push(action.payload.user.id)



        state.currentUser.following.push(action.payload.user.id)



      return {...state}
    }
    
    case "SET_UNFOLLOW_CONTAINER": {

      if(state.user.id === state.currentUser.id){
        state.user.following = state.currentUser.following.filter((id) => {
          return id !== action.payload.user.id
        })
      }

        state.currentUser.following = state.currentUser.following.filter((id) => {
          return id !== action.payload.user.id
 
      })
      /*
      state.user.following = state.user.following.filter((id) => {
        return id !== action.payload.user.id
      })*/

      return {...state}
    }
    case "GET_LIKES": {

      state.photos = state.photos.map((photo) => {
        if(photo.photoId === action.payload.photo.photoId){
          return {...photo,likesInfo: action.payload.likes}
        }else{
          return photo
        }
      })


      return {...state}
    }

    case "UPDATE_PHOTO" : {
      

      const updatedPhotos = state.photos.map((photo)=> {
        if(photo.photoId === action.payload.data.id){
          return {
            ...photo,
            title: action.payload.data.title
          }
        }
        return photo

      })


      return { ...state, photos: updatedPhotos };


    }
    default: {
      throw Error(`unknown action: ${action.type} `);
    }
  }
};
