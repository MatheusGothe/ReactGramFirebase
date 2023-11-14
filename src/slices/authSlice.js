import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
//import defaultImage from '../utils/assets/imagemPadrao.png'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  error: false,
  success: false,
  loading: false,
  message: null,
  response: [],
  errorCode: 0,
};

// Register a user and sign in
export const register = async(user,dispatch) => {

    try {
      const { email, password, name } = user;
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const defaultImage =
        "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

      await updateProfile(firebaseUser, {
        displayName: name,
        photoURL: defaultImage,
      });

      const userCollection = collection(db, "users");

      const userQuery = query(userCollection, where("username", "==", name));

      const usersSnapShot = await getDocs(userQuery);

      if (!usersSnapShot.empty) {
        throw new Error("O email já esta em uso");
      }

      const res = await setDoc(doc(db, "users", firebaseUser.uid), {
        username: name,
        email: email,
        id: auth.currentUser.uid,
        profileImage: defaultImage,
        followers: [],
        following: [],
        createdAt: serverTimestamp(),
      });

      const userCollections = doc(db,'users',auth.currentUser.uid)

      const userDocSnap = await getDoc(userCollections)
      dispatch({
        type:"SET_USER",
        payload:{
          user:userDocSnap.data()
        }
      })

       return userDocSnap.data()

    } catch (error) {

      return {error: error.message,code: error.code}
      // Extrair e retornar apenas a mensagem de erro
    }
  }


// LogOut a user
export const logout = async () => {
  console.log("logout");
  await signOut(auth);
};

// Sign in a user
export const login = async (user, dispatch) => {
  try {
    const { email, password } = user;

    await signInWithEmailAndPassword(auth, email, password);


    const userCollection = collection(db, "users");

    const userQuery = query(
      userCollection,
      where("email", "==", auth.currentUser.email)
    );

    dispatch({
      type: "SET_USER",
      payload: {
        user: auth.currentUser.toJSON(),
      },
    });

    return auth.currentUser.toJSON();

    }catch (error) {
    // Extrair e retornar apenas a mensagem de erro
    console.log(error);
    return {error: error.message,errorCode:error.code};
  }
};

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email, thunkAPI) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.log(error);
      // Extrair e retornar apenas a mensagem de erro
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Sign in a user
export const sendVerificattionEmail = createAsyncThunk(
  "auth/sendEmail",
  async (email, thunkAPI) => {
    console.log(email);
    const [res, error] = await authService.sendVerificattionEmail(email);
    if (error) {
      console.log("error");
      console.log(error);
    }
    // check for erros
    if (res.errors) {
      console.log(res);
      return thunkAPI.rejectWithValue(res.errors[0]);
    }

    return res;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
    },
    resetResponse: (state) => {
      state.response = 0;
    },
    resetMessage: (state) => {
      state.message = null;
    },
    resetSuccess: (state) => {
      state.success = false;
      console.log("entrou");
    },
    setMessage: (state, action) => {
      console.log("caiu");
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.message = action.payload;
        console.log(action.payload);
        //    state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = false;
        state.error = null;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log(action);
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = false;
      })
      .addCase(login.rejected, (state, action) => {
        console.log(action);
        state.loading = false;
        state.user = null;
        state.error = true;
        state.success = false;
        state.message = action.payload;
        // state.error = action.payload
      })
      .addCase(sendVerificattionEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        console.log(action.payload);
      })
      .addCase(sendVerificattionEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        console.log(action.payload);
        state.message = action.payload.message;
        state.error = null;
        state.user = null;
      })
      .addCase(sendVerificattionEmail.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        console.log(action.payload);
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        console.log(action.payload);
        state.message = "Email enviado com sucesso";
        state.error = null;
        state.user = null;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = false;
      });
  },
});

export const {
  reset,
  resetResponse,
  resetMessage,
  resetSuccess,
  setMessage,
  setError,
} = authSlice.actions;
