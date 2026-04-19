import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⚠️ IMPORTANT: Replace these with your Firebase credentials
// Get these from: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "AIzaSyCuGFGXoeuwaIGa9cBe4VU8hJlOJSnofas",
  authDomain: "smart-life-manager-25923.firebaseapp.com",
  projectId: "smart-life-manager-25923",
  storageBucket: "smart-life-manager-25923.firebasestorage.app",
  messagingSenderId: "111059725957",
  appId: "1:111059725957:web:4e64d41e8103bd59c543ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
