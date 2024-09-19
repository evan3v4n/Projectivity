// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2VNzDh_fClkT4DF0XkJz1ZQP76rcIpXQ",
  authDomain: "whiteboard-25d5f.firebaseapp.com",
  projectId: "whiteboard-25d5f",
  storageBucket: "whiteboard-25d5f.appspot.com",
  messagingSenderId: "690858870540",
  appId: "1:690858870540:web:3f227bef0e0a389e882b29",
  measurementId: "G-7RV7YYF8QV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db};