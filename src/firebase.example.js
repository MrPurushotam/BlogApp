// create a firebase.js file inside src directory and add your firebase credentials below is a view of how your
// firebase.js should look like 
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const auth= getAuth(app);
export const db=getFirestore(app)
export const storage=getStorage(app)
export const provider=new GoogleAuthProvider();
