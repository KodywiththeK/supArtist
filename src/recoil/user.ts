import { collection, getDocs, query } from "firebase/firestore";
import { atom } from "recoil";
import { db } from "../firebase/firebase";
import { ProjectType } from "./recruitment";

export interface UserDataType {
  id: string
  email: string,
  name: string,
  phone: string,
  pic: string,
  intro: string,
  gender: string,
  bday: string,
  interest: string[],
  team: string[],
  experience: string[],
  heart: string[],
  apply: {id: string, state: null | boolean }[]
}

const defaultUserState: UserDataType = {
  id: '',
  email: '',
  name: '',
  phone: '',
  pic: '',
  intro: '',
  gender: '',
  bday: '',
  interest: [],
  team: [],
  experience: [],
  heart: [],
  apply: []
}

export const user = atom<UserDataType[]>({
  key: 'userInfo',
  default: [defaultUserState]
})

export const getUserData = async():Promise<UserDataType[]> => {
  const list:UserDataType[] = []
  try {
    const docRef = collection(db, 'userInfo')
    const q = query(docRef)
    const docSnap = await getDocs(q)
    docSnap.docs.map((doc) => {
      list.push({
        id: doc.id,
        email: doc.data().email,
        name: doc.data().name,
        phone: doc.data().phone,
        pic: doc.data().pic,
        intro: doc.data().intro,
        gender: doc.data().gender,
        bday: doc.data().bday,
        interest: doc.data().interest,
        team: doc.data().team,
        experience: doc.data().experience,
        heart: doc.data().heart,
        apply: doc.data().apply
      })
    })
  } catch(err) {
    console.log(err + "No such document!");
  }
  return list
}