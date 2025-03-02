import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBvOxn2C8D1fHz7iSs6RUbY3piSIXnJO0I",
  authDomain: "juris-dash.firebaseapp.com",
  projectId: "juris-dash",
  storageBucket: "juris-dash.firebasestorage.app",
  messagingSenderId: "443966773473",
  appId: "1:443966773473:web:73ed83952bfad3ee7c7fa0",
  measurementId: "G-WZB4BY72YX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { collection, addDoc, getDocs, deleteDoc, doc };