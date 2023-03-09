import { AuthProvider, signInWithPopup, UserCredential, GoogleAuthProvider, getAuth } from "firebase/auth";
// import { auth } from "../firebase/firebase";



// export const SignInWithSocialMedia = (provider:AuthProvider) => {

//   new Promise<UserCredential>((resolve, reject) => {
//     signInWithPopup(auth, provider)
//       .then(result => resolve(result))
//       .then(() => alert('로그인 되었습니다.'))
//       .catch(error => reject(error))
//   })
// }

const provider = new GoogleAuthProvider();
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
const auth = getAuth();
// auth.languageCode = 'it';
// To apply the default browser preference instead of explicitly setting it.
// firebase.auth().useDeviceLanguage();


export const signInWithGoogle = async() => {
  await signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    console.log(token)
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    console.log(user)
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(credential)
  })
};
