// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxIuS1rh_G59whyRldGCbf40tp2RWTJkA",
  authDomain: "prepwise-e880f.firebaseapp.com",
  projectId: "prepwise-e880f",
  storageBucket: "prepwise-e880f.firebasestorage.app",
  messagingSenderId: "542937573483",
  appId: "1:542937573483:web:c4b545451dfd03b970a92e",
  measurementId: "G-PSFFLRNC6T"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);