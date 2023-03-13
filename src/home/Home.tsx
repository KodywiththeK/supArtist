import { collection, doc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { db } from '../firebase/firebase';
import DefaultImage from '../images/DefaultProfile.jpeg'
import { AuthContext } from '../store/AuthContext';
import HomeInfo from './HomeInfo';
import HomeVisual from './HomeVisual';

export default function Home() {
  
  const userInfo = useContext(AuthContext)
  // const [userData, setUserData] = useRecoilState(user)
  // useEffect(() => {
  //   const reFetch = async() => {
  //     if(userData.find((user) => user.id === userInfo?.uid) === undefined) {
  //       await setDoc(doc(db, 'userInfo', String(userInfo?.uid)), {
  //         email: userInfo?.email,
  //         name: userInfo?.displayName,
  //         phone: userInfo?.phoneNumber,
  //         pic: DefaultImage,
  //         intro: '',
  //         gender: '',
  //         bday: '',
  //         interest: [],
  //         team: [],
  //         experience: [],
  //         heart: [],
  //         apply: []
  //       })
  //       const getData = async() => {
  //         const result = await getUserData();
  //         setUserData(result)
  //       }
  //       getData();
  //       console.log(userData)
  //     }
  //   }
  //   reFetch();
  // },[])

  return (<>
  <div className='w-full min-h-screen relative overflow-x-hidden'>

    <HomeVisual />
    <HomeInfo />
  </div>
  </>
  )
}
