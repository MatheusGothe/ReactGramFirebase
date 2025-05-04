// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "instagramclone-7c9f7.firebaseapp.com",
  projectId: "instagramclone-7c9f7",
  storageBucket: "instagramclone-7c9f7.appspot.com",
  messagingSenderId: "928239404571",
  appId: "1:928239404571:web:bafe90cf8195cfdc555abe"
};

// Initialize Firebase

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp() ;
const db = getFirestore()
const auth = getAuth()
const storage = getStorage()

export { app, db, auth, storage };