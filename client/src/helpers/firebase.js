// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getEnv } from "./getEnv";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API"),
  authDomain: "my-mern-blog-88bf3.firebaseapp.com",
  projectId: "my-mern-blog-88bf3",
  storageBucket: "my-mern-blog-88bf3.firebasestorage.app",
  messagingSenderId: "661377251008",
  appId: "1:661377251008:web:eb6d35536444714dd19f25",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
