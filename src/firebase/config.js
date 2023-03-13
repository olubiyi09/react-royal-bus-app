import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: "royalbus-26fb9.firebaseapp.com",
  projectId: "royalbus-26fb9",
  storageBucket: "royalbus-26fb9.appspot.com",
  messagingSenderId: "317570761343",
  appId: "1:317570761343:web:138ee5feeb0a640bda354a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
