// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIuStSSILx18k7VRbVuy1oC52HsSHGFq4",
  authDomain: "skill-exchange-2dbbb.firebaseapp.com",
  projectId: "skill-exchange-2dbbb",
  storageBucket: "skill-exchange-2dbbb.firebasestorage.app",
  messagingSenderId: "782055917400",
  appId: "1:782055917400:web:a015bc976bb9fcb143472d",
  measurementId: "G-FVRGZ5KXHQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auths = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();

export {auths ,db};