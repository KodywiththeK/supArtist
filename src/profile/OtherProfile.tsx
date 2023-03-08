import React, { useContext, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../store/AuthContext'
import { BsGenderAmbiguous, BsFilm, BsFillBellFill } from 'react-icons/bs'
import { RiCake2Line, RiTeamLine, RiUserFollowFill } from 'react-icons/ri'
import { useMediaQuery } from 'react-responsive'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { useRecoilValue } from 'recoil'
import { user } from '../recoil/user'
import { recruitment } from '../recoil/recruitment'
import { AiOutlineHeart } from 'react-icons/ai'


export default function OtherProfile() {

  const navigate = useNavigate()
  const userInfo = useContext(AuthContext)
  const userId = userInfo?.uid
  const isDefault: boolean = useMediaQuery({
    query: "(min-width:768px)",
  });
  
  const { profile } = useParams()
  const recruitmentData = useRecoilValue(recruitment)
  const project = recruitmentData.filter(item => item.writer === profile)
  const userData = useRecoilValue(user)
  const data = userData.find(items => items.id === profile)
  const [menu, setMenu] = useState(true)

  const handleLogout = () => {
    if(confirm('로그아웃 하시겠습니까?') ) {
      signOut(auth)
      .then(() => navigate('/'))
    }
  }

  const age = () => {
    const today = new Date();
    const birthDate = new Date(String(data?.bday));
    let age = today.getFullYear() - birthDate?.getFullYear();
    const m = today.getMonth() - birthDate?.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age
  }

  return (
    <>
    <div className='flex min-h-screen justify-center bg-zinc-200'>
      <div className={`w-full max-w-[700px] items-center min-h-screen relative flex flex-col`}>
        <div className={`flex justify-center items-center w-full h-52 mt-20 mr-5`}>
          <div className={`flex justify-center items-center ${isDefault? 'w-60 mr-10' : 'w-40 mx-10'} h-52 `}>
            <img src={data?.pic} alt='My picture' className='w-40 h-40 object-cover border border-[#9ec08c] rounded-[100%]'/>
          </div>
          <div>
            <div className='font-bold text-2xl mb-3'>{`${data?.name}`}</div>
            <div className='flex justify-between w-44 text-lg font-semibold mb-3'>
              <div>팔로우 <span className='font-normal'>56</span></div>
              <div>팔로워 <span className='font-normal'>12</span></div>
            </div>
            <div className='min-w-40 h-14'>
              <div className='w-full max-w-[16rem]'>{data?.intro}</div>
            </div>
          </div>
        </div>
        <div className='flex justify-center items-center w-full'>
          <button 
            className='btn btn--green w-40 flex justify-center items-center mr-2'>팔로우하기<RiUserFollowFill className='ml-2' /></button>
          <button 
            className='btn btn--green w-40 flex justify-center items-center ml-2'>알림설정<BsFillBellFill className='ml-2' /></button>
        </div>
        <div className={`w-[100%] h-72 flex flex-col items-center mt-10`}>
          <table className='flex justify-between w-[90%] max-w-[600px] border-collapse border-spacing-0'>
            <tbody className='w-full'>
              <tr className='w-full flex border-b border-slate-400 p-4'>
                <th className='text-left w-[55%] px-5'><BsGenderAmbiguous className='inline text-xl mr-2'/>성별</th>
                <td>{data?.gender}</td>
              </tr>
              <tr className='w-full flex border-b border-slate-400 p-4'>
                <th className='text-left w-[55%] px-5'><RiCake2Line className='inline text-xl mr-2'/>나이</th>
                <td><>만 { age() }세</></td>
              </tr>
              <tr className='w-full flex border-b border-slate-400 p-4'>
                <th className='text-left w-[55%] px-5'><BsFilm className='inline text-xl mr-2'/>관심분야</th>
                <td>{data?.interest.join(', ')}</td>
              </tr>
              <tr className='w-full flex border-b border-slate-400 p-4'>
                <th className='text-left w-[55%] px-5'><RiTeamLine className='inline text-xl mr-2'/>파트</th>
                <td>{data?.team.join(', ')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='flex justify-center w-[90%] max-w-[700px] text-center text-lg font-semibold mt-5 mb-2 border border-transparent border-t-slate-400'>
          <button onClick={() => setMenu(true)}
            className={`py-5 mr-8 cursor-pointer break-keep border border-transparent ${menu? 'border-t-black border-[1.5px] text-black' : 'text-gray-400' }`}>
              경력사항
          </button>
          <button onClick={() => setMenu(false)}
            className={`py-5 mr-8 cursor-pointer break-keep border border-transparent ${menu? 'text-gray-400' : 'border-t-black border-[1.5px] text-black' }`}>
              프로젝트
          </button>
        </div>
        {menu ?
        <div className='flex flex-col items-center w-full max-w-[600px] pr-10 h-[20%]'>
          <ul className="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-500 text-xl w-full max-w-[600px]">
            {data?.experience.map((t,i) => (
              <div key={i} className='flex justify-between mx-10 my-2 w-full max-w-[430px]'>
                <li className='w-full max-w-[370px]'>{t}</li>
              </div>
            ))}
          </ul>
        </div> : 
        <div className='flex flex-wrap justify-around '>
          {project.map((data, index) => (
            <Link to={`/recruitment/${data.id}`} key={index} className="group drop-shadow-xl mb-10 mx-2">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-w-7 xl:aspect-h-8">
                <img
                  src={data.pic}
                  alt='작품 이미지'
                  className="h-[250px] w-[300px] object-cover object-center object-contain group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-base text-black">{data.title}</h3>
              <div className="flex justify-between items-center">
                <p className="mt-1 text-lg font-medium text-gray-900">{`${data.team} ${data.teamNum}명 모집`}</p>
              </div>
            </Link>
          ))}
        </div>
        }
      </div>

    </div>
    </>
  )
}
