import React, { useContext, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../store/AuthContext'
import { BsGenderAmbiguous, BsFilm, BsFillBellFill } from 'react-icons/bs'
import { RiCake2Line, RiTeamLine, RiUserFollowFill } from 'react-icons/ri'
import { useMediaQuery } from 'react-responsive'
import { signOut } from 'firebase/auth'
import { auth, db, updateDocData } from '../firebase/firebase'
import { useRecoilValue } from 'recoil'
import useUserQuery from '../reactQuery/userQuery'
import useRecruitmentQuery from '../reactQuery/RecruitmentQuery'
import ProfileModal from './ProileModal'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { FaPaperPlane } from 'react-icons/fa'
import defaultImage from '../images/DefaultProfile.jpeg'


export default function OtherProfile() {

  const isDefault: boolean = useMediaQuery({
    query: "(min-width:768px)",
  });

  const userInfo = useContext(AuthContext)
  const { profile } = useParams()
  const navigate = useNavigate();

  //recoil
  // const recruitmentData = useRecoilValue(recruitment)
  // const userData = useRecoilValue(user)
  // const project = recruitmentData.filter(item => item.writer === profile)
  // const data = userData.find(items => items.id === profile)

  //react-query

  const {isLoading:userLoading, data:userData, refetch} = useUserQuery()
  const {isLoading:recruitmentLoading, data:recruitmentData} = useRecruitmentQuery()
  const otherUser = userData?.map(i => ({...i})).find(i => i.id === profile)
  const curUser = userData?.map(i => ({...i})).find(i => i.id === userInfo?.uid)
  const project = recruitmentData?.map(i => ({...i})).filter(item => item.writer === profile)

  const [menu, setMenu] = useState(true)


  const age = () => {
    const today = new Date();
    const birthDate = new Date(String(otherUser?.bday));
    let age = today.getFullYear() - birthDate?.getFullYear();
    const m = today.getMonth() - birthDate?.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age
  }

  // 팔로우 팔로잉
  const followHandler = async() => {
    if(!curUser?.following.includes(otherUser?.id as string)) {
      await updateDocData('userInfo', curUser?.id as string, {following: [...curUser?.following as string[], otherUser?.id ] as string[]})
      await updateDocData('userInfo', otherUser?.id as string, {followers: [...otherUser?.followers as string[], curUser?.id] as string[]})
    } else {
      await updateDocData('userInfo', curUser?.id as string, {following: curUser?.following.filter(i => i !== otherUser?.id)})
      await updateDocData('userInfo', otherUser?.id as string, {followers: otherUser?.following.filter(i => i !== curUser?.id)})
    }
    refetch();
  }

  //profile Modal
  const [profileModal, setProfileModal] = useState(false)
  const [modalData, setModalData] = useState({
    name: otherUser?.name as string,
    list: '' as string,
    items: [] as string[]
  })
  const profileModalHandler = (list:string, items:string[]) => {
    setModalData({...modalData, list:list, items:items})
    setProfileModal(true)
  }


  // 채팅 시작
  const handleSelect = async(chatUserId:string) => {
    console.log(chatUserId)
    const combinedId = userInfo?.uid as string > chatUserId ? userInfo?.uid as string + chatUserId : chatUserId + userInfo?.uid as string;
    try {
      const res = await getDoc(doc(db, 'chats', combinedId))
      if(!res.exists()) {
        // chatting collection 생성
        await setDoc(doc(db, 'chats', combinedId), {messages:[]})
        
        // 채팅방 목록 생성 및 저장
        await updateDocData('userChats', chatUserId, {
          [combinedId+".userInfo"] : {
            uid: userInfo?.uid as string,
            displayName: curUser?.name,
            photoURL: curUser?.pic
          },
          [combinedId+".date"]: `${String(new Date().getHours())}:${String(new Date().getMinutes())}`
        })
        await updateDocData('userChats', userInfo?.uid as string, {
          [combinedId+".userInfo"] : {
            uid: chatUserId,
            displayName: otherUser?.name,
            photoURL: otherUser?.pic
          },
          [combinedId+".date"]: `${String(new Date().getHours())}:${String(new Date().getMinutes())}`
        })
      }
    } catch (err) {
      console.error(err)
    }
    navigate(`/directMessage/${chatUserId}`)
  }

  return (
    <>
    <ProfileModal profileModal={profileModal} setProfileModal={setProfileModal} data={modalData}/>
    <div className={`w-full items-center min-h-screen relative flex flex-col bg-zinc-200 px-5`}>
      <div className={`w-full max-w-[700px] items-center min-h-screen relative flex flex-col mt-[20px]`}>
        <div className={`flex justify-center items-center w-full h-52 mt-[170px] mr-5 sm:ml-0`}>
          <div className={`flex justify-center items-center shrink-0 ${isDefault? 'w-[160px] h-[160px] ' : 'w-[120px] h-[120px]'} mr-5 sm:mr-10 h-52 `}>
            <img src={otherUser?.pic ? otherUser?.pic : defaultImage} alt='My picture' className='w-full h-full object-cover border border-[#9ec08c] rounded-[100%]'/>
          </div>
          <div>
            <div className='font-bold text-xl sm:text-2xl mb-3'>{`${otherUser?.name}`}</div>
            <div className='flex justify-between w-44 text-base sm:text-lg font-semibold mb-3'>
              <div onClick={() => profileModalHandler('팔로워', otherUser?.followers as string[])}
                className='cursor-pointer'
                >팔로워 <span className='font-normal'>{otherUser?.followers.length}</span></div>
              <div onClick={() => profileModalHandler('팔로잉', otherUser?.following as string[])}
                className='cursor-pointer'
                >팔로잉 <span className='font-normal'>{otherUser?.following.length}</span></div>
            </div>
            <div className='min-w-40 h-14'>
              <div className='w-full max-w-[16rem] text-sm sm:text-base'>{otherUser?.intro}</div>
            </div>
          </div>
        </div>
        <div className='flex justify-center items-center w-full mt-6'>
          <button onClick={followHandler}
            className={`btn ${curUser?.following.includes(otherUser?.id as string) ? 'btn--reverse' : ''} border-[2px] border-black w-40 flex justify-center items-center mr-2`}>{`${curUser?.following.includes(otherUser?.id as string) ? '팔로잉' : '팔로우하기'}`}<RiUserFollowFill className='ml-2' /></button>
          <button onClick={() => handleSelect(otherUser?.id as string)}
            className='btn border-[2px] border-black w-40 flex justify-center items-center ml-2'>채팅하기<FaPaperPlane className='ml-2' /></button>
        </div>
        <div className={`w-[100%] h-72 flex flex-col items-center mt-10`}>
          <table className='flex justify-between w-[90%] max-w-[600px] border-collapse border-spacing-0'>
            <tbody className='w-full'>
              <tr className='w-full flex border-transparent border-b-slate-400 border-[0.5px] p-4'>
                <th className='text-left w-[55%] px-5'><BsGenderAmbiguous className='inline text-xl mr-2'/>성별</th>
                <td>{otherUser?.gender}</td>
              </tr>
              <tr className='w-full flex border-transparent border-b-slate-400 border-[0.5px] p-4'>
                <th className='text-left w-[55%] px-5'><RiCake2Line className='inline text-xl mr-2'/>나이</th>
                <td><>{otherUser?.bday ? `만 ${age()}세` : ''}</></td>
              </tr>
              <tr className='w-full flex border-transparent border-b-slate-400 border-[0.5px] p-4'>
                <th className='text-left w-[55%] px-5'><BsFilm className='inline text-xl mr-2'/>관심분야</th>
                <td>{otherUser?.interest.join(', ')}</td>
              </tr>
              <tr className='w-full flex border-transparent border-b-slate-400 border-[0.5px] p-4'>
                <th className='text-left w-[55%] px-5'><RiTeamLine className='inline text-xl mr-2'/>파트</th>
                <td>{otherUser?.team.join(', ')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='flex justify-center w-[90%] max-w-[700px] text-center text-lg font-semibold mt-10 mb-2 border border-transparent border-t-slate-400'>
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
        <div className='flex flex-col items-center w-full max-w-[600px] mb-20'>
          <ul className="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-500 text-xl w-full max-w-[600px]">
            {otherUser?.experience.map((t,i) => (
              <div key={i} className='flex justify-between mx-10 my-2 w-full'>
                <li className='w-full'>{t}</li>
              </div>
            ))}
          </ul>
        </div> : 
        <div className='flex flex-wrap justify-around w-full max-w-[700px] mb-20 '>
          {project?.map((data, index) => (
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
