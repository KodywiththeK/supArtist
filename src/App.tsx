import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./common/Footer";
import Header from "./common/Header";
import ChangePwd from "./profile/ChangePwd";
import Home from "./home/Home";
import Profile from './profile/Profile'
import LoginPage from "./login/LoginPage";
import { AuthContext } from "./store/AuthContext";
import MyApplication from "./profile/MyApplication";
import MyWork from "./profile/MyWork";
import MyProfile from "./profile/MyProfile";
import ProfileEdit from "./profile/ProfileEdit";
import { useRecoilState } from "recoil";
import { getUserData, user, UserDataType } from "./recoil/user";
import { db } from "./firebase/firebase";
import Recruitment from "./Recruitment/Recruitment";
import RecruitmentDetail from './Recruitment/RecruitmentDetail'
import NewProject from "./Recruitment/NewProject";
import { getRecruitmentData, recruitment } from "./recoil/recruitment";
import OtherProfile from "./profile/OtherProfile";
import ProjectEdit from "./Recruitment/ProjectEdit";
import SearchResult from "./Recruitment/SearchResult";


export default function App() {

  const userInfo = useContext(AuthContext)
  console.log(userInfo)

  const [userData, setUserData] = useRecoilState(user)
  const [recruitmentData, setRecruitmentData] = useRecoilState(recruitment)

  useEffect(() => {
    const getData = async() => {
      const userResult = await getUserData();
      const recruitmentResult = await getRecruitmentData([]);
      setUserData(userResult)
      setRecruitmentData(recruitmentResult)
    }
    getData()
    .then(() => {
      console.log(userData)
      console.log(recruitmentData)
    })
  },[db.app])

  return (
    <>
    <Header />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path='/' element={<Home />} />
      <Route path='/recruitment' element={<Recruitment />} />
      <Route path='/recruitmentSearch/:value' element={<SearchResult />} />

      <Route path='/recruitmentDetail/:id' element={<RecruitmentDetail />} />
      <Route path='/newProject' element={<NewProject />} />
      <Route path='/projectEdit/:id' element={<ProjectEdit />} />

      <Route path='/other/:profile' element={<OtherProfile />}/>
      <Route path='/:profile' element={<Profile />}>
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