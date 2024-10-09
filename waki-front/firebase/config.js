import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVcAr6VxWTNuoh4I_PQDugi6fHG3-1PbY",
  authDomain: "waki-28d2a.firebaseapp.com",
  projectId: "waki-28d2a",
  storageBucket: "waki-28d2a.appspot.com",
  messagingSenderId: "532719213324",
  appId: "1:532719213324:web:da156e9cf801a96da90729"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
