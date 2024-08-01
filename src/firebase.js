// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBEriUaWCdikF6WQlgpBncu3emufIuJp-w",
    authDomain: "simple-notes-firebase-8e9dd.firebaseapp.com",
    projectId: "simple-notes-firebase-8e9dd",
    storageBucket: "simple-notes-firebase-8e9dd.appspot.com",
    messagingSenderId: "756362317650",
    appId: "1:756362317650:web:13b1ea524c0e9a52b2748b",
    measurementId: "G-E1K242B2GV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };
