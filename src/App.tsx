import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./common/Footer";
import Header from "./common/Header";
import Home from "./home/Home";
import ProfilePage from './profile/ProfilePage';
import LoginPage from "./login/LoginPage";
import { AuthContext } from "./store/AuthContext";
import MyApplication from "./profile/MyApplication";
import MyWork from "./profile/MyWork";
import MyProfile from "./profile/MyProfile";
import ProfileEdit from "./profile/ProfileEdit";
import Recruitment from "./Recruitment/Recruitment";
import RecruitmentDetail from './Recruitment/RecruitmentDetail';
import NewProject from "./Recruitment/NewProject";
import OtherProfile from "./profile/OtherProfile";
import ProjectEdit from "./Recruitment/ProjectEdit";
import SearchResult from "./Recruitment/SearchResult";
import MessagePage from "./message/MessagePage";
import ChattingRoom from "./message/ChattingRoom";



export const localStorageUserId = (localStorage.getItem('userId') as string)

export default function App() {

  const userInfo = useContext(AuthContext)
  console.log(userInfo)

  // const [userData, setUserData] = useRecoilState(user)
  // const [recruitmentData, setRecruitmentData] = useRecoilState(recruitment)


  // useEffect(() => {
  //   const getData = async() => {
  //     const userResult = await getUserData();
  //     const recruitmentResult = await getRecruitmentData([]);
  //     setUserData(userResult)
  //     setRecruitmentData(recruitmentResult)
  //   }
  //   getData()
  //   .then(() => {
  //     console.log(userData)
  //     console.log(recruitmentData)
  //   })
  // },[db.app])

  return (
    <>
    <Header />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path='/' element={<Home />} />
      <Route path='/recruitment/' element={<Recruitment />} />
      <Route path='/recruitmentSearch/:value' element={<SearchResult />} />

      <Route path='/recruitmentDetail/:id' element={<RecruitmentDetail />} />
      <Route path='/newProject' element={<NewProject />} />
      <Route path='/projectEdit/:id' element={<ProjectEdit />} />

      <Route path="/directMessage" element={<MessagePage />} >
        <Route path="/directMessage/:id" element={<ChattingRoom />} />
      </Route>

      <Route path='/other/:profile' element={<OtherProfile />}/>
      <Route path='/:profile' element={<ProfilePage />}>
        <Route path="/:profile" element={<MyProfile />} />
        <Route path="/:profile/myApplication" element={<MyApplication />} />
        <Route path="/:profile/myWork" element={<MyWork />} />
      </Route>

      <Route path="/:profile/profileEdit" element={<ProfileEdit />} />
    </Routes>
    <Footer />
    </>
  );
}