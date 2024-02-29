// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-react-auth.firebaseapp.com",
  projectId: "real-estate-react-auth",
  storageBucket: "real-estate-react-auth.appspot.com",
  messagingSenderId: "421288753277",
  appId: "1:421288753277:web:2573a785019e8e089ad914",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
