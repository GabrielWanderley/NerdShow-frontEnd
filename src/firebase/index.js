import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAzkebGXaHPznelYg_HXCAvaRqcGVzcx5c",
  authDomain: "cashpilot-ae884.firebaseapp.com",
  projectId: "cashpilot-ae884",
  storageBucket: "cashpilot-ae884.appspot.com",
  messagingSenderId: "1063408979935",
  appId: "1:1063408979935:web:f0eca00e7daeff9bf93e6a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)



