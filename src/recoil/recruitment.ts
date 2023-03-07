import { collection, getDocs, query } from "firebase/firestore";
import { atom, DefaultValue, RecoilState, StoreID } from "recoil";
import { db } from "../firebase/firebase";

export interface ProjectType {
  id: string,
  writer: string,
  state: boolean,
  pic: string,
  title: string,
  intro: string,
  genre: string,
  team: string,
  teamNum: string
  pay: string,
  schedule: string,
  location: string,
  note: string[],
  applicant: string[],
  confirmed: string[]
}


const defaultRecruitmentState: ProjectType = {
  id: '',
  writer:'',
  state: true,
  pic: '',
  title: '',
  intro: '',
  genre: '',
  team: '',
  teamNum: '',
  pay: '',
  schedule: '',
  location: '',
  note: [],
  applicant: [],
  confirmed: []
}


export const getRecruitmentData = async(initialState: ProjectType[]):Promise<ProjectType[]> => {
  // const list:ProjectType[] = []
  try {
    const docRef = collection(db, 'recruitment')
    const q = query(docRef)
    const docSnap = await getDocs(q)
    docSnap.docs.map((doc) => {
      initialState.push({
        id: doc.data().id,
        writer: doc.data().writer,
        state: doc.data().state,
        pic: doc.data().pic,
        title: doc.data().title,
        intro: doc.data().intro,
        genre: doc.data().genre,
        team: doc.data().team,
        teamNum: doc.data().teamNum,
        pay: doc.data().pay,
        schedule: doc.data().schedule,
        location: doc.data().location,
        note: doc.data().note,
        applicant: doc.data().applicant,
        confirmed: doc.data().confirmed
      })
    })
  } catch(err) {
    console.log(err + "No such document!");
  }
  return initialState
}


export const recruitment = atom<ProjectType[]>({
  key: 'recruitment',
  default: [defaultRecruitmentState],
})


