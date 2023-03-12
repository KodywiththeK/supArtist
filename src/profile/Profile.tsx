import React, { useContext } from 'react'
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import DefaultImage from '../images/DefaultProfile.jpeg'
import { AuthContext } from '../store/AuthContext'
import { AiFillSetting, AiOutlineRight, AiOutlineOrderedList, AiFillCheckCircle, AiOutlineLogout } from 'react-icons/ai'
import { BsGenderAmbiguous, BsFilm } from 'react-icons/bs'
import { RiCake2Line, RiTeamLine } from 'react-icons/ri'
import { Default, Mobile } from '../mediaQuery'
import { useMediaQuery } from 'react-responsive'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import useUserQuery from '../reactQuery/userQuery'

export const age = (bday:string) => {
  const today = new Date();
  const birthDate = new Date(String(bday));
  let age = today.getFullYear() - birthDate?.getFullYear();
  const m = today.getMonth() - birthDate?.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age
}

export default function Profile() {

  const navigate = useNavigate()
  const userInfo = useContext(AuthContext)
  const userId = userInfo?.uid

  //recoil
  // const data = useRecoilValue(user).find(i => i.id === userId)

  //react-query
  const {isLoading:userLoading, data:userData} = useUserQuery()
  const curUser = userData?.map(i => ({...i})).find(i => i.id === userId)
  console.log(curUser)

  //media-query
  const isDefault: boolean = useMediaQuery({
    query: "(min-width:768px)",
  });

  const handleLogout = () => {
    if(confirm('로그아웃 하시겠습니까?') ) {
      signOut(auth)
      .then(() => navigate('/'))
    }
  }
  const location = useLocation().pathname

  

  return (
    <>
    <div className='flex min-h-screen justify-between'>
      <Default><>
      <div className='fixed w-[40vw] h-screen bg-zinc-800 text-white flex flex-col '>
        <div className='flex items-center justify-center w-[100%] mt-[200px]'>
          <div className='text-2xl font-bold mb-12'>{`마이페이지`}</div>
        </div>
        <div className='flex flex-col items-end mr-10'>
          <button onClick={() => navigate(`/${userId}/profileEdit`)}
            className={`flex items-center justify-between w-[62%] border border-white rounded-xl text-lg btn btn--white py-4 mb-5 `}>
            <div className='flex items-center'><AiFillSetting className='mx-2' />프로필 설정</div>
            <div><AiOutlineRight /></div>
          </button>
          <button onClick={() => navigate(`/${userId}`)}
            className={`flex items-center justify-between w-[62%] border border-white rounded-xl text-lg btn btn--white ml-[15%] py-4 mb-5 ${!location.includes('myWork') && !location.includes('myApplication') ? 'selected': ''}`}>
            <div className='flex items-center'><AiOutlineOrderedList className='mx-2' />프로필 홈</div>
            <div><AiOutlineRight /></div>
          </button>
          <button onClick={() => navigate(`/${userId}/myApplication`)}
            className={`flex items-center justify-between w-[62%] border border-white rounded-xl text-lg btn btn--white ml-[15%] py-4 mb-5 ${location.includes('myApplication') ? 'selected': ''}`}>
            <div className='flex items-center'><AiFillCheckCircle className='mx-2' />지원 내역</div>
            <div><AiOutlineRight /></div>
          </button>
          <button onClick={() => navigate(`/${userId}/myWork`)}
            className={`flex items-center justify-between w-[62%] border border-white rounded-xl text-lg btn btn--white ml-[15%] py-4 mb-5 ${location.includes('myWork') ? 'selected': ''}`}>
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
      <div className={`${isDefault ? 'w-[60vw] pl-[10%] items-start' : 'w-full items-center'} min-h-screen relative flex flex-col bg-zinc-200`}>
        <div className={`flex ${isDefault ? 'justify-start' : 'justify-center'}  items-center w-full h-52 mt-[170px] mr-5`}>
          <div className={`flex justify-center items-center ${isDefault? 'w-60 mr-10' : 'w-40 mx-10'} h-52 `}>
            <img src={curUser?.pic} alt='My picture' className='w-40 h-40 object-cover border border-[#9ec08c] rounded-[100%]'/>
          </div>
          <div>
            <div className='font-bold text-2xl mb-3'>{`${curUser?.name}`}</div>
            <div className='flex justify-between w-44 text-lg font-semibold mb-3'>
              <div>팔로우 <span className='font-normal'>56</span></div>
              <div>팔로워 <span className='font-normal'>12</span></div>
            </div>
            <div className='min-w-40 h-14'>
              <div className='w-full max-w-[16rem]'>{curUser?.intro}</div>
            </div>
          </div>
        </div>
        <div className={`w-[100%] h-72 flex flex-col ${isDefault ? 'items-start' : 'items-center'} mt-10`}>
          <table className='flex justify-between w-[90%] max-w-[600px] border-collapse border-spacing-0'>
            <tbody className='w-full'>
              <tr className='w-full flex border-b border-[#9ec08c] p-4'>
                <th className='text-left w-[55%] px-5'><BsGenderAmbiguous className='inline text-xl mr-2'/>성별</th>
                <td>{curUser?.gender}</td>
              </tr>
              <tr className='w-full flex border-b border-[#9ec08c] p-4'>
                <th className='text-left w-[55%] px-5'><RiCake2Line className='inline text-xl mr-2'/>나이</th>
                <td><>{curUser?.bday ? `만 ${age(curUser?.bday as string)} 세` : ''}</></td>
              </tr>
              <tr className='w-full flex border-b border-[#9ec08c] p-4'>
                <th className='text-left w-[55%] px-5'><BsFilm className='inline text-xl mr-2'/>관심분야</th>
                <td>{curUser?.interest.join(', ')}</td>
              </tr>
              <tr className='w-full flex border-b border-[#9ec08c] p-4'>
                <th className='text-left w-[55%] px-5'><RiTeamLine className='inline text-xl mr-2'/>파트</th>
                <td>{curUser?.team.join(', ')}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <Mobile><>
        <div className='flex'>
        <button onClick={() => navigate(`/${userId}/profileEdit`)}
          className='btn btn--green w-40 flex justify-center items-center mr-2'>프로필 수정<AiFillSetting className='ml-2'/></button>
        <button onClick={handleLogout}
          className='btn btn--green w-40 flex justify-center items-center ml-2'>로그아웃<AiOutlineLogout className='ml-2'/></button>
        </div>
        
        <div className='flex justify-center w-[90%] text-center text-lg font-semibold mt-5 border border-transparent border-t-slate-300'>
          <button onClick={() => navigate(`/${userId}`)}
            className={`py-5 mr-8 cursor-pointer break-keep border border-transparent ${!location.includes('myApplication') && !location.includes('myWork') ? 'border-t-black border-[1.5px] text-black': 'text-gray-400'}`}>경력사항</button>
          <button onClick={() => navigate(`/${userId}/myApplication`)}
            className={`py-5 mx-8 cursor-pointer break-keep border border-transparent ${location.includes('myApplication') ? 'border-t-black border-[1.5px] text-black': 'text-gray-400'}`}>지원내역</button>
          <button onClick={() => navigate(`/${userId}/myWork`)}
            className={`py-5 ml-8 cursor-pointer break-keep border border-transparent ${location.includes('myWork') ? 'border-t-black border-[1.5px] text-black': 'text-gray-400'}`}>내 프로젝트</button>
        </div>
        </></Mobile>

        <Outlet />
      </div>

    </div>
    </>
  )
}
