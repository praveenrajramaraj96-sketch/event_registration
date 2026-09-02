import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDE6SQB-DqimNKMMwZ96FK-ZEli3MXrTL4",
  authDomain: "hackathonevent-39aba.firebaseapp.com",
  projectId: "hackathonevent-39aba",
  storageBucket: "hackathonevent-39aba.firebasestorage.app",
  messagingSenderId: "641439569344",
  appId: "1:641439569344:web:12ac048b4ee0376852e425",
  measurementId: "G-WDNC8PN0V3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
