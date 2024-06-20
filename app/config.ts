import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmz8Va4RD6kF7Ts4cvnG0qYbqHYFv59RA",
  authDomain: "phygital-trial.firebaseapp.com",
  projectId: "phygital-trial",
  storageBucket: "phygital-trial.appspot.com",
  messagingSenderId: "36881079428",
  appId: "1:36881079428:web:e3eefb1a39a8a193d5f6d1",
};

const firebase_app = initializeApp(firebaseConfig);

const db = getFirestore(firebase_app);

export { firebase_app, db };
