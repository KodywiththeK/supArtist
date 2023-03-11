import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useQuery } from '@tanstack/react-query'

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
  confirmed: string[],
  comments: {
    id: string,
    text: string
  } | null
}


const getRecruitmentData = async():Promise<ProjectType[]> => {
  const list:ProjectType[] = []
  try {
    const docRef = collection(db, 'recruitment')
    const q = query(docRef)
    const docSnap = await getDocs(q)
    docSnap.docs.map((doc) => {
      list.push({
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
        confirmed: doc.data().confirmed,
        comments: doc.data().comments
      })
    })
  } catch(err) {
    console.log(err + "No such document!");
  }
  return list
}

// { onSuccess, onError }: {onSuccess: ((data:ProjectType[]) => void) | undefined, onError:((err:unknown) => void) | undefined}
export default function useRecruitmentQuery() {
  return useQuery(['recruitment'], getRecruitmentData, {
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
    retry: 3, // 실패시 재호출 몇번 할지
  })
}
