import { doc, getDoc } from "firebase/firestore";
import { useContext } from "react";
import { useQuery } from "react-query"
import { useRecoilState } from "recoil";
import { db } from "../firebase/firebase";
import { UserDataType } from "../recoil/user";
import { AuthContext } from "../store/AuthContext";


// const getUserData = async(uid: string) => {
//   // const userInfo = useContext(AuthContext)
//   try {
//     const docRef = doc(db, 'userInfo', uid)
//     const docSnap = await getDoc(docRef)
//     if(docSnap.exists()) {
//       console.log("Document data:", docSnap.data())
//       return docSnap.data()
//     } 
//   } catch(err) {
//     // doc.data() will be undefined in this case
//     console.log(err + "No such document!");
//   }
// }

// export const queryUserData = () => {
//   const userInfo = useContext(AuthContext)
//   const { isLoading, isError, data, error } = useQuery('userData', () => getUserData(userInfo!.uid))
//   console.log(data)
//   // const [loginUser, setLoginUser] = useRecoilState<UserDataType>(null)

//   return(<>
  
//   </>)
// }