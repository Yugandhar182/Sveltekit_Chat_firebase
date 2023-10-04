import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyA3bHwT2usgbe7rj4mAJaQuDvPd7J5q_CI",
  authDomain: "sveltekitchat.firebaseapp.com",
  databaseURL: "https://sveltekitchat-default-rtdb.firebaseio.com",
  projectId: "sveltekitchat",
  storageBucket: "sveltekitchat.appspot.com",
  messagingSenderId: "29976047555",
  appId: "1:29976047555:web:a9eda03f8466d669969776"
};

// Initialize Firebase
const firebaseApp= initializeApp(firebaseConfig);
export default firebaseApp;