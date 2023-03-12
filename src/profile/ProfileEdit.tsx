import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { AiFillCheckCircle, AiFillSetting, AiOutlineLogout, AiOutlineOrderedList, AiOutlineRight } from 'react-icons/ai'
import { BsFilm } from 'react-icons/bs'
import { useMediaQuery } from 'react-responsive'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { auth } from '../firebase/firebase'
import { Default } from '../mediaQuery'
import useUserQuery from '../reactQuery/userQuery'
import { AuthContext } from '../store/AuthContext'
import BasicInfoEdit from './BasicInfoEdit'
import UserProfileInfoEdit from './UserProfileInfoEdit'

export default function ProfileEdit() {

  const navigate = useNavigate()
  const handleLogout = () => {
    if(confirm('로그아웃 하시겠습니까?') ) {
      signOut(auth)
      .then(() => navigate('/'))
    }
  }

  //auth
  const userInfo = useContext(AuthContext)
  const userId = userInfo?.uid

  //recoil
  // const data = useRecoilValue(user).find(i => i.id === userId)

  //react-query
  const {isLoading:userLoading, data:userData} = useUserQuery()
  const curUser = userData?.map(i => ({...i})).find(i => i.id === userId)

  const location = useLocation().pathname
  const isDefault: boolean = useMediaQuery({
    query: "(min-width:768px)",
  });

  return (
    <div className='flex min-h-screen justify-between'>
      <Default><>
      <div className='fixed w-[40vw] min-h-screen bg-zinc-800 text-white flex flex-col '>
        <div className='flex items-center justify-center w-[100%] mt-[200px]'>
          <div className='text-2xl font-bold mb-12'>{`마이페이지`}</div>
        </div>
        <div className='flex flex-col items-end mr-10'>
          <button onClick={() => navigate(`/${userId}/profileEdit`)}
            className={`flex items-center justify-between w-[62%] border border-white rounded-xl text-lg btn btn--white ml-[15%] py-4 mb-5 ${location.includes('profileEdit') ? 'selected': ''}`}>
            <div className='flex items-center'><AiFillSetting className='mx-2' />프로필 설정</div>
            <div><AiOutlineRight /></div>
          </button>
          <button onClick={() => navigate(`/${userId}`)}
            className={`flex items-center justify-between w-[62%] border border-white rounded-xl text-lg btn btn--white ml-[15%] py-4 mb-5 `}>
            <div className='flex items-center'><AiOutlineOrderedList className='mx-2' />프로필 홈</div>
            <div><AiOutlineRight /></div>
          </button>
          <button onClick={() => navigate(`/${userId}/myApplication`)}
            className={`flex items-center justify-between w-[62%] border border-white rounded-xl text-lg btn btn--white ml-[15%] py-4 mb-5`}>
            <div className='flex items-center'><AiFillCheckCircle className='mx-2' />지원 내역</div>
            <div><AiOutlineRight /></div>
          </button>
          <button onClick={() => navigate(`/${userId}/myWork`)}
            className={`flex items-center justify-between w-[62%] border border-white rounded-xl text-lg btn btn--white ml-[15%] py-4 mb-5 `}>
            <div className='flex items-center'><BsFilm className='mx-2' />프로젝트 관리</div>
            <div><AiOutlineRight /></div>
          </button>
          <button onClick={handleLogout}
            className='flex items-center justify-between w-[62%] rounded-xl text-lg btn btn--white ml-[15%] py-4 mb-5'>
            <div className='flex items-center'><AiOutlineLogout className='mx-2' />로그아웃</div>
          </button>
        </div>
      </div>
      <div className='w-[40vw] min-h-screen'></div></>
      </Default>
      <div className={`${isDefault ? 'w-[60vw]' : 'w-full'} min-h-screen p-16 relative flex flex-col bg-zinc-200`}>
        <h1 className='mt-[150px] text-2xl font-extrabold w-full max-w-[740px] pb-6 border border-transparent border-b-zinc-700 '>회원정보 수정</h1>
        <BasicInfoEdit />
        <UserProfileInfoEdit />
      </div>
    </div>
  )
}
