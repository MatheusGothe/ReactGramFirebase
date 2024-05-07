import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import photoService from "../services/photoService";
import { dispatchAction } from "../utils/functions/dispatchActions";
import { auth } from "../lib/firebase";

const initialState = {
  photos: [],
  photo: {},
  currentUser: {},
  error: false,
  success: false,
  loading: false,
  message: null,
  loadingPequeno: false,
  uploadProgress: 0,
};

// Ação para atualizar o progresso do upload
export const setUploadProgress = createAction("photo/setUploadProgress");

export const publishPhoto = async (photo, dispatch, photos) => {
  dispatchAction(dispatch, "SET_LOADING", { isLoading: true });

  const res = await photoService.publishPhoto(photo, dispatch, photos);
  
  dispatchAction(dispatch, "SET_LOADING", { isLoading: false });
  if(res.error) {
    console.log('caiu')
    return res.error.message;
  }
};

// Get photo likes
export const getPhotoLikes = async (photo,dispatch) => {


    try {
      const data = await photoService.getPhotoLikes(photo);

      // Check for errors
      if (data?.error) {

        return data
      }
      
      dispatch({
        type:"GET_LIKES",
        payload:{
          likes:data,
          photo
        }
      })

      
    } catch (error) {
      console.error(error);
      return error
    }
  }

// Get user photos
export const getUserPhotos = createAsyncThunk(
  "photo/userphotos",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.getUserPhotos(id, token);

    return data;
  }
);
// Delete a photo
export const deletePhoto = async (id, dispatch, photos) => {
  dispatch({
    type: "SET_LOADING",
    payload: {
      isLoading: true,
    },
  });
  

  const data = await photoService.deletePhoto(id, dispatch, photos);

  dispatch({
    type: "SET_LOADING",
    payload: {
      isLoading: false,
    },
  });

  dispatchAction(dispatch, "SET_MESSAGE", "Foto excluida.");
  // Check for erros
  if (data) {
    return data;
  }

  return data;
};

// Update a photo
export const updatePhoto = async(data) => {
 

  const res = await photoService.updatePhoto(data)
  

}
// Get photo by id

export const getPhoto = async (id, dispatch) => {
  console.log('entrou')
  dispatch({
    type: "SET_LOADING",
    payload: {
      isLoading: true,
    },
  });
  const data = await photoService.getPhoto(id);

  if (data?.error) {
    console.log(data.error);
  }

  const photo = [data.post]
  dispatch({
    type: "SET_PHOTOS",
    payload: {
      photos:photo ,
    },
  });
  dispatch({
    type:"SET_USER",
    payload: {
      user:data.user
      
    }
  })
  dispatch({
    type: "SET_LOADING",
    payload: {
      isLoading: false,
    },
  });
  return data;
};

export const like = async (photo, dispatch) => {
  const id = photo.photoId;

  const data = await photoService.like(photo, dispatch);

  // Check for erros
  if (data.error) {
    return data.error;
  }

  dispatch({
    type: "UPDATE_PHOTO_LIKES",
    payload: {
      photoId: id,
      likes: data,
    },
  });

  return data;
};

// Deslike a photo
export const deslike = async (photo, dispatch) => {
  const { photoId: id } = photo;

  const data = await photoService.deslike(id, dispatch);

  // Check for erros
  if (data.error) {
    console.log(data.error);
  }

  dispatch({
    type: "UPDATE_PHOTO_DESLIKE",
    payload: {
      photoId: id,
      userId: auth.currentUser.uid,
    },
  });
};

// Add Comment to a photo
export const comment = async (commentData, dispatch) => {
  const { id } = commentData;
 /* dispatch({
    type: "SET_LOADING",
    payload: {
      isLoading: true,
    },
  });*/
  const data = await photoService.comment(commentData);
  const { user } = data;
  // Check for erros
  if (data?.error) {
    console.log("error");
    return data.error;
  }
  dispatch({
    type: "SET_COMMENT",
    payload: {
      comment: data.newComment,
      id,
      user,
    },
  });
  /*dispatch({
    type: "SET_LOADING",
    payload: {
      isLoading: false,
    },
  });*/
  return data;
};

export const getComments = async (photo, dispatch) => {
  dispatch({
    type: "SET_LOADING1",
    payload: {
      loading: true,
    },
  });
  const data = await photoService.getComments(photo);

  // Check for erros
  if (data?.error) {
    return data.error;
  }

  dispatch({
    type: "SET_LOADING1",
    payload: {
      loading: false,
    },
  });

  dispatch({
    type: "SET_PHOTO_COMMENTS",
    payload: {
      id: photo.photoId,
      comment: data,
    },
  });

  return data;
};

// Remove Comment to a photo
export const removeComment = async (commentData, dispatch) => {
  /*dispatch({
    type: "SET_LOADING",
    payload: {
      isLoading: true,
    },
  });*/

  const data = await photoService.removeComment(commentData);

  // Check for erros
  if (data?.error) {
    console.log(data);
    return data.error;
  }

 /* dispatch({
    type: "SET_LOADING",
    payload: {
      isLoading: false,
    },
  });*/

  dispatch({
    type: "DELETE_COMMENT",
    payload: {
      comments: data,
      commentId: commentData.commentId,
      id: commentData.photoId,
    },
  });

  return data;
};

// Remove Comment to a photo
export const removeCommentHome = createAsyncThunk(
  "photo/removeHome",
  async (commentData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.removeCommentHome(
      commentData.photoId,
      commentData.CommentId,
      token
    );

    // Check for erros
    if (data[0].errors) {
      console.log("erro");
      return thunkAPI.rejectWithValue(data[0].errors);
    }

    return { ...data, photoId: commentData.photoId };
  }
);

export const getPhotos = async (user,dispatch) => {

  dispatch({
    type: "SET_LOADING",
    payload: {
      isLoading: true,
    },
  });



  const data = await photoService.getPhotos(user);

  dispatch({
    type: "SET_PHOTOS",
    payload: {
      photos: data.photos,
    },
  });
  
  dispatch({
    type:"SET_USER",
    payload:{
      user: data.user
    }
  })

  dispatch({
    type: "SET_LOADING",
    payload: {
      isLoading: false,
    },
  });

  if (data?.error) {
    return data.error;
  }

  return data;
};

// Search photo by title
export const searchPhotos = createAsyncThunk(
  "photo/search",
  async (query, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.searchPhotos(query, token);

    return data;
  }
);

export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
        state.photos.unshift(state.photo);
        console.log(action.payload);
        state.message = "Foto publicada com sucesso";
      })
      .addCase(publishPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
        console.log(action.payload);
      })
      .addCase(getUserPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.photos = [];
      })
      .addCase(getUserPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.photos = state.photos.filter((photo) => {
          return photo._id !== action.payload.id;
        });

        state.message = action.payload.message;
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.photos.map((photo) => {
          if (photo._id === action.payload.photo._id) {
            return (photo.title = action.payload.photo.title);
          }
          return photo;
        });

        state.message = action.payload.message;
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getPhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
      })
      .addCase(like.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingPequeno = false;
        state.success = true;
        state.error = null;

        if (state.photo.likes) {
          state.photo.likes.push(action.payload.userId);
        }

        state.photos.forEach((photo) => {
          if (photo._id === action.payload.photoId) {
            photo.likes.push(action.payload.userId);
            photo.clicked = true;
          }
        });
      })
      .addCase(like.rejected, (state, action) => {
        state.loading = false;
        state.error = null;
        state.loadingPequeno = false;
        state.photos.forEach((photo) => {
          if (photo._id === action.payload.photoId) {
            photo.clicked.push(true);
          }
        });
      })
      .addCase(like.pending, (state) => {
        state.loadingPequeno = false;
        state.error = false;
      })
      .addCase(deslike.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingPequeno = false;
        state.success = true;
        state.error = null;

        const { photo } = action.payload.data[0];
        const userId = action.payload.data[1];

        // Atualiza o estado da foto individual
        if (state.photo._id === photo._id) {
          console.log("caio primeiro if");
          console.log(photo);
          console.log(userId);
          const newLikes = state.photo.likes.filter((id) => id !== userId);
          state.photo.likes = newLikes;
        }

        // Atualiza o estado das fotos na página inicial
        state.photos.forEach((photo) => {
          if (photo._id === action.payload.id) {
            const newLikes = photo.likes.filter((id) => id !== userId);
            photo.likes = newLikes;
          }
        });
      })
      .addCase(deslike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deslike.pending, (state) => {
        state.loadingPequeno = true;
        state.error = false;
      })
      .addCase(comment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.loadingPequeno = false;

        if (state.photo.comments) {
          console.log("if");
          state.photo.comments.push(action.payload.comment);
        } else {
          console.log("else");
          state.photo.comments = [action.payload.comment];
        }

        //   state.message = action.payload.message
      })
      .addCase(comment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.loadingPequeno = false;
      })
      .addCase(comment.pending, (state, action) => {
        state.loadingPequeno = true;
        state.error = null;
      })
      .addCase(removeComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload[0];
        state.loadingPequeno = false;
      })
      .addCase(removeComment.pending, (state, action) => {
        state.loading = false;
        state.error = null;
        state.loadingPequeno = true;
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.loadingPequeno = false;

        const deletedCommentId = action.payload[1];

        state.photo.comments = state.photo.comments.filter(
          (comment) => comment.CommentId !== deletedCommentId
        );
        state.message = "Comentário Removido";
      })
      .addCase(getPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(removeCommentHome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload[0];
        state.loadingPequeno = false;
      })
      .addCase(removeCommentHome.pending, (state, action) => {
        state.error = null;
        state.loadingPequeno = true;
        console.log(state.loadingPequeno);
      })
      .addCase(removeCommentHome.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingPequeno = false;
        state.success = true;
        state.error = null;

        console.log(action.payload);

        const photoIndex = state.photos.findIndex(
          (photo) => photo._id === action.payload.photoId
        );

        // Verifique se o índice da foto foi encontrado
        if (photoIndex === -1) {
          console.error(
            `Photo with ID ${action.payload.photoId} not found in state.photos`
          );
          return;
        }

        // Verifique se a foto tem uma propriedade comments
        if (!state.photos[photoIndex].hasOwnProperty("comments")) {
          console.error(
            `Photo with ID ${action.payload.photoId} does not have a comments property`
          );
          return;
        }

        // Remova o comentário do array de comentários da foto
        const deletedCommentId = action.payload[1];
        state.photos[photoIndex].comments = state.photos[
          photoIndex
        ].comments.filter((comment) => comment.CommentId !== deletedCommentId);

        state.message = "Comentário removido";
      })
      .addCase(setUploadProgress, (state, action) => {
        state.uploadProgress = action.payload;
      });
  },
});

export const { resetMessage } = photoSlice.actions;
export default photoSlice.reducer;
