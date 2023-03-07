import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { ProjectType } from "../recoil/recruitment";
import { UserDataType } from "../recoil/user";



const firebaseConfig = {
  apiKey: "AIzaSyCVpqTyGOwfJ1Ngi595GUnFOQkcRvHwHtI",
  authDomain: "karrot-60a0c.firebaseapp.com",
  projectId: "karrot-60a0c",
  storageBucket: "karrot-60a0c.appspot.com",
  messagingSenderId: "426595842338",
  appId: "1:426595842338:web:5ccc5508c8d89cc2e7cd7b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);
export const storage = getStorage(app);

export const updateDocData = async(key:string, id:string, obj:Partial<ProjectType | UserDataType>) => {
  const docData = doc(db, key, id)
  await updateDoc(docData, obj)
}