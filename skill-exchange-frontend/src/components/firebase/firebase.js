
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDIuStSSILx18k7VRbVuy1oC52HsSHGFq4",
  authDomain: "skill-exchange-2dbbb.firebaseapp.com",
  projectId: "skill-exchange-2dbbb",
  storageBucket: "skill-exchange-2dbbb.firebasestorage.app",
  messagingSenderId: "782055917400",
  appId: "1:782055917400:web:a015bc976bb9fcb143472d",
  measurementId: "G-FVRGZ5KXHQ"
};


export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auths = getAuth(app);


export {auths ,db};