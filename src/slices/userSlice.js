import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/userService";
import { auth, db } from "../lib/firebase";
import imageCompression from 'browser-image-compression';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { EmailAuthProvider, updateEmail, updatePassword } from "firebase/auth";
import { reauthenticateUser } from "../utils/functions/reauthenticathedUser";
import { dispatchAction } from "../utils/functions/dispatchActions";
import { uploadImage } from "../utils/functions/UploadPhoto";

const initialState = {
  user: {},
  currentUser: {},
  users: [],
  error: false,
  success: false,
  loading: false,
  message: null,
  loadingPequeno: false,
};

// Get user details, for edit data
export const profile = async (id, dispatch) => {
  dispatchAction(dispatch, "SET_LOADING", { isLoading: true });

  const data = await userService.profile(id, dispatch);

  dispatchAction(dispatch, "SET_LOADING", { isLoading: false });

  return data;
};

// Função para atualizar os detalhes do usuário
export const updateProfile = async (user, dispatch) => {
  
  const {
    username,
    uid: id,
    bio,
    email,
    profileImage: file,
    password,
    oldPassword,
  } = user;

  try {
    
    // Se a senha ou o email foram alterados, reautenticar o usuário
    if (password || auth.currentUser.email !== email) {
      const res = await reauthenticateUser(auth.currentUser.email, oldPassword);
      // Se houver um erro na reautenticação, retorne o erro
      if (res.error) {

        return { error: res.error, errorCode: res.code };
      }
    }
    // Preparar os dados para atualizar no Firestore
    const userDoc = doc(db, "users", id);
    const updateData = {
      bio: bio || '',           
      username: username || '', 
      email: email || '',       
    };
    // Se um arquivo foi fornecido, faça o upload e adicione o URL aos dados de atualização
    if(file) {

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 128,
        useWebWorker: true,
      });

      const url = await uploadImage({ photo: compressedFile, title: userDoc.id}, (progress) =>
        console.log(`Upload progress: ${progress}%`)
      );
      updateData.profileImage = url;
    }
     
    // Atualizar os dados do usuário no Firestore
     await updateDoc(userDoc, updateData);

    // Se uma nova senha foi fornecida, atualizar a senha do usuário
    if (password) {
      await updatePassword(auth.currentUser, password);
    }

    // Se o email foi alterado, atualizar o email do usuário
    if (auth.currentUser.email !== email) {
      await updateEmail(auth.currentUser, email);
    }
  } catch (error) {
    console.log(error);
    return { error: error.message, errorCode: error.code };
  }
};

export const getUserDetails = async (id, dispatch) => {
  dispatch({
    type: "SET_LOADING1",
    payload: {
      loading: true,
    },
  });

  const data = await userService.getUserDetails(id, dispatch);

  const { user, photos, userAuth } = data;

  dispatch({
    type: "SET_USER",
    payload: {
      user: user,
    },
  });
  dispatch({
    type: "SET_PHOTOS",
    payload: {
      photos: photos,
    },
  });

  dispatch({
    type: "SET_CURRENT_USER",
    payload: {
      currentUser: userAuth,
    },
  });

  if (data?.error) {
  }

  dispatch({
    type: "SET_LOADING1",
    payload: {
      loading: false,
    },
  });
};

export const resetPassword = createAsyncThunk(
  "user/password",
  async (email, thunkAPI) => {
    try {
      const res = await userService.resetPassword(email);

      // Verificar se houve erro na resposta
      if (res.errors) {
        return thunkAPI.rejectWithValue(res.errors[0]);
      }
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Ocorreu um erro ao redefinir a senha");
    }
  }
);
export const followUser = async (followData, dispatch) => {
  try {
    const res = await userService.followUser(followData);

    // Verificar se houve erro na resposta
    dispatch({
      type: "SET_FOLLOW",
      payload: {
        user: followData.user,
        userAuth: followData.userAuth,
      },
    });

    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const unFollowUser = async (unfollowData, dispatch) => {
  const { user, userAuth } = unfollowData;
  try {
    const res = await userService.unFollowUser(unfollowData);

    if (res?.error) {
      return res;
    }
    dispatch({
      type: "SET_UNFOLLOW",
      payload: {
        user,
        currentUser: userAuth,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const followUserContainer = async (data,dispatch) => {


  try {
    const res = await userService.followUserContainer(data);
    const { user, userAuth } = res;
    // Verificar se houve erro na resposta
    dispatch({
      type: "SET_FOLLOW_CONTAINER",
      payload: {
        user,
        userAuth
      },
    });


    // Verificar se houve erro na resposta
    if (res?.errors) {
      return res;
    }
  } catch (error) {
    console.log(error);
  }
};

export const unFollowUserContainer = async (data, dispatch) => {
  
    try {
      const res = await userService.unFollowUserContainer(data);

      // Verificar se houve erro na resposta
      if (res?.errors) {
        return res
      }
      dispatch({
        type:"SET_UNFOLLOW_CONTAINER",
        payload: {
          user: data.user,
          userAuth: data.userAuth
        }
      })
      return res;
    } catch (error) {
      console.log(error);
    }
  }


export const getUserFollowers = async (data, dispatch) => {
  try {
    const res = await userService.getUserFollowers(data);

    // Verificar se houve erro na resposta
    if (res?.error) {
      return res;
    }

    dispatch({
      type: "SET_FOLLOWERS_INFO",
      payload: {
        followers: res,
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getUserFollowing = async (data, dispatch) => {
  try {
    const res = await userService.getUserFollowing(data);

    // Verificar se houve erro na resposta
    if (res?.error) {
      return res;
    }

    dispatch({
      type: "SET_FOLLOWING_INFO",
      payload: {
        following: res,
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const searchUsers = createAsyncThunk(
  "photo/search",
  async (query, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await userService.searchUsers(query, token);

    return data;
  }
);
