import { AuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import { auth } from "../firebase/firebase";

export const SignInWithSocialMedia = (provider:AuthProvider) => {

  new Promise<UserCredential>((resolve, reject) => {
    signInWithPopup(auth, provider)
      .then(result => resolve(result))
      .then(() => alert('로그인 되었습니다.'))
      .catch(error => reject(error))
  })
}