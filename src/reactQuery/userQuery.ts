import { collection, getDocs, query } from "firebase/firestore";
import { db, database } from "../firebase/firebase";
import { useQuery } from '@tanstack/react-query'



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
  apply: {id: string, state: null | boolean }[],
  followers: string[],
  following: string[]
}

const getUserData = async():Promise<UserDataType[]> => {
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
        apply: doc.data().apply,
        followers: doc.data().followers,
        following: doc.data().following
      })
    })
  } catch(err) {
    console.log(err + "No such document!");
  }
  return list
}
// { onSuccess, onError }: {onSuccess: ((data:UserDataType[]) => void) | undefined, onError:((err:unknown) => void) | undefined}
export default function useUserQuery() {
  return useQuery(['userInfo'], getUserData, {
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
    retry: 3, // 실패시 재호출 몇번 할지
  })
}

