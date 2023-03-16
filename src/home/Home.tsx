import { collection, doc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { db } from '../firebase/firebase';
import DefaultImage from '../images/DefaultProfile.jpeg'
import useUserQuery from '../reactQuery/userQuery';
import { AuthContext } from '../store/AuthContext';
import HomeInfo from './HomeInfo';
import HomeVisual from './HomeVisual';

export default function Home() {
  
  const userInfo = useContext(AuthContext)

  //react-query
  const {isLoading:userLoading, data:userData, refetch} = useUserQuery()
  console.log(userData?.find((user) => user.id === userInfo?.uid))
  useEffect(() => {
    const setGoogleUser = async() => {
      if(userData?.find((user) => user.id === userInfo?.uid) === undefined) {
        await setDoc(doc(db, 'userInfo', String(userInfo?.uid)), {
          email: userInfo?.email,
          name: userInfo?.displayName,
          phone: userInfo?.phoneNumber,
          pic: userInfo?.photoURL,
          intro: '프로필 설정에 들어가서 프로필을 작성해보세요!',
          gender: '',
          bday: '',
          interest: [],
          team: [],
          experience: ['완성도 높은 프로필을 작성할수록 합격률이 올라갑니다 :)'],
          heart: [],
          apply: [],
          followers: [],
          following: []
        })
      }
    }
    setGoogleUser();
    refetch();
    console.log(userData)
  },[])

  return (<>
  <div className='w-full min-h-screen relative overflow-x-hidden'>

    <HomeVisual />
    <HomeInfo />
  </div>
  </>
  )
}
