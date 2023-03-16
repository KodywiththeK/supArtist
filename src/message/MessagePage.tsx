import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../store/AuthContext'
import { Default, Mobile } from '../mediaQuery'
import { useMediaQuery } from 'react-responsive'
import useUserQuery from '../reactQuery/userQuery'
import { BsChatDots, BsFillPersonFill } from 'react-icons/bs'
import { FaListAlt, FaPaperPlane } from 'react-icons/fa'
import { doc, DocumentData, DocumentSnapshot, getDoc, getDocs, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db, updateDocData } from '../firebase/firebase'
import ChattingModal from './ChattingModal'
import { localStorageUserId } from '../App'
import { AiFillHome, AiOutlineCloseCircle } from 'react-icons/ai'



export default function MessagePage() {

  const navigate = useNavigate()

  const user = useContext(AuthContext)
  // const userId = userInfo?.uid as string

  //react-query
  const {isLoading:userLoading, data:userData} = useUserQuery()
  const curUser = userData?.map(i => ({...i})).find(i => i.id === localStorageUserId)
  console.log(curUser)
  const chatUser = (chatUserId:string) => userData?.map(i => ({...i})).find(i => i.id === chatUserId)

  //media-query
  const isDefault: boolean = useMediaQuery({
    query: "(min-width:768px)",
  });

  // search user
  const [inputValue, setInputValue] = useState('')
  const searchedUser = userData?.map(i => ({...i})).filter(i => i.id !== user?.uid).filter(i => i.name.toLowerCase().includes(inputValue.toLowerCase()))

  // 채팅 시작
  const handleSelect = async(chatUserId:string) => {
    const combinedId = user?.uid as string > chatUserId ? user?.uid as string + chatUserId : chatUserId + user?.uid as string;
    try {
      const res = await getDoc(doc(db, 'chats', combinedId))
      if(!res.exists()) {
        // chatting collection 생성
        await setDoc(doc(db, 'chats', combinedId), {messages:[]})
        
        // 채팅방 목록 생성 및 저장
        await updateDocData('userChats', chatUserId, {
          [combinedId+".userInfo"] : {
            uid: user?.uid as string,
            displayName: curUser?.name,
            photoURL: curUser?.pic
          },
          [combinedId+".date"]: `${String(new Date().getHours())}:${String(new Date().getMinutes())}`
        })
        await updateDocData('userChats', user?.uid as string, {
          [combinedId+".userInfo"] : {
            uid: chatUserId,
            displayName: chatUser(chatUserId)?.name,
            photoURL: chatUser(chatUserId)?.pic
          },
          [combinedId+".date"]: `${String(new Date().getHours())}:${String(new Date().getMinutes())}`
        })
      }
    } catch (err) {
      console.error(err)
    }
    navigate(`/directMessage/${chatUserId}`)
  }

  // Fetch Chats
  const [chats, setChats] = useState<DocumentData[]>([])
  useEffect(() => {
    const getChats = () => {
      const unSub = onSnapshot(doc(db, "userChats", user?.uid as string), (doc:DocumentSnapshot<DocumentData>) => {
        setChats(doc.data() as DocumentData[])
      });
      return () => {
        unSub();
      }
    }
    user?.uid && getChats()
  },[user?.uid])



  //profile Modal
  const [profileModal, setProfileModal] = useState(false)
  const modalData = {
    name: curUser?.name as string,
    list: '팔로잉',
    items: curUser?.following as string[]
  }

  // #34335c
  // #45446c
  // #696699
  // #e1e1f7

  return (
    <>
    <ChattingModal profileModal={profileModal} setProfileModal={setProfileModal} data={modalData} handleSelect={handleSelect}/>
    <div className={`fixed inset-0 overflow-hidden ${isDefault ? 'z-20' : 'z-40'} flex justify-between`}>
        <div className={`${isDefault ? 'w-[40vw] items-end' : 'w-full' } h-full bg-[#34335c] text-white flex flex-col`}>
          <div className={`flex flex-col w-full h-[80px] ${isDefault ? 'items-end' : 'items-center' } mt-[80px] bg-[#34335c]`}>
            <div className='w-full max-w-[450px] h-[80px] pl-6 flex items-center justify-between'>
              <p className='text-2xl font-bold'>{curUser?.name}</p>
              <button onClick={(e) => {
                e.preventDefault();
                setProfileModal(true)
              }}
                className='btn btn--white mr-4 w-[80px] border border-white'>My list</button>
            </div>
          </div>
          <div className={`w-full h-full bg-[#45446c] flex ${isDefault ? 'justify-end' : 'justify-center pr-4' }`}>
            <div className='relative w-full max-w-[450px] h-full pl-3 flex flex-col'>
              <input onChange={(e) => {setInputValue(e.target.value)}} value={inputValue}
                tabIndex={1}
                className='outline-none bg-opacity-10 rounded-lg w-full h-[70px] bg-white text-lg text-gray-200 p-4 placeholder:text-gray-400 placeholder:italic tracking-wide'
                placeholder='다른 이용자의 이름을 검색해보세요'/>
              {inputValue && <AiOutlineCloseCircle className='absolute right-3 top-[22px] text-2xl text-gray-200 cursor-pointer' onClick={() => setInputValue('')}/>}
              <div className='w-full h-0 border-[0.5px] border-transparent border-b-gray-400 mb-[10px] rounded-xl'></div>
              {inputValue && <>
              {searchedUser?.length === 0 ? 
                <>
                <div className='flex items-center w-full h-[80px] pl-3 mb-1 cursor-pointer'>
                  <div className='flex flex-col ml-3'>
                    <p className='text-lg text-gray-300 font-semibold'>검색 결과가 없습니다.</p>
                  </div>
                </div>
                </>
              :  
                <>
                <div className='text-lg font-semibold ml-2 my-[10px] text-gray-200 '>검색 결과</div>
                <div className='mb-2 py-2 w-full' style={isDefault ? {height: 'calc(100% - 150px)'} : {height: 'calc(100% - 220px)'} }>
                  {searchedUser?.map((user, index) => (
                  <div key={index} tabIndex={1}
                    onClick={() => {
                      setInputValue('')
                      handleSelect(user.id)
                      navigate(`/directMessage/${user?.id}`)
                    }}
                    className='flex items-center w-full h-[80px] py-2 pl-3 mb-1 cursor-pointer hover:bg-gray-300 hover:bg-opacity-20 rounded-lg'>
                    <img src={user.pic} alt='profile' className='w-[60px] h-[60px] object-cover rounded-[50%] border border-gray-300' />
                    <div className='flex flex-col ml-3'>
                      <p className='text-lg text-gray-100 font-semibold'>{user.name}</p>
                    </div>
                  </div>
                ))}
                </div>
                </>
              }
              </>}
              {!inputValue && <>
              <div className='text-lg font-semibold ml-2 my-[10px] text-gray-200'>대화 목록</div>
              <div className='w-full py-2 overflow-x-hidden ' style={isDefault ? {height: 'calc(100% - 150px)'} : {height: 'calc(100% - 220px)'} }>
                {chats && Object.entries(chats)?.sort((a,b) => b[1].created - a[1].created).map((chat) => (
                  <div key={chat[0]} className='w-full h-[90px] flex justify-between items-center'>
                    <div 
                      onClick={() => navigate(`/directMessage/${chat[1].userInfo.uid}`)}
                      className='flex items-center w-full h-[80px] pl-3 mb-1 cursor-pointer hover:scale-[1.05] transition'>
                      <img src={chat[1].userInfo.photoURL} alt='profile' className='w-[60px] h-[60px] object-cover rounded-[50%] border border-gray-300' />
                      <div className='flex flex-col ml-4'>
                        <p className='text-lg text-gray-100 font-semibold'>{chat[1].userInfo.displayName}</p>
                        <p className='text-gray-200'>{chat[1].last?.text}</p>
                      </div>
                    </div>
                    <div className='h-full flex items-center mr-6'>{chat[1].date}</div>
                  </div>
                ))}
              </div></>}
            </div>
          </div>
        </div>
      <Mobile>
        <div className='fixed bottom-0 w-full '>
          <div className='flex justify-between items-center w-full h-[90px] bg-[#f6f5f0] flex-1'>
            <button onClick={() => navigate('/')}
              className='flex flex-col w-full pt-2 justify-start items-center bg-[#f6f5f0] text-[#2c2a29] h-full w-1/4 '>
              <AiFillHome className='text-2xl mt-3'/>
              <span>홈</span>
            </button>
            <button onClick={() => { navigate('/recruitment')}}
              className='flex flex-col w-full pt-2 justify-start items-center bg-[#f6f5f0] text-[#2c2a29] h-full w-1/4 '>
              <FaListAlt className='text-2xl mt-3'/>
              <span>모집공고</span>  
            </button>
            <button onClick={() => { navigate('/directMessage')}}
              className='flex flex-col w-full pt-2 justify-start items-center bg-[#f6f5f0] text-[#2c2a29] h-full w-1/4 '>
              <FaPaperPlane className='text-2xl mt-3'/>
              <span>메세지</span>  
            </button>
            <button onClick={() => { navigate(`/${localStorageUserId}`) }}
              className='flex flex-col w-full pt-2 justify-start items-center bg-[#f6f5f0] text-[#2c2a29] h-full w-1/4'>
              <BsFillPersonFill className='text-2xl mt-3'/>
              <span>프로필</span>
            </button>
          </div>
        </div>
      </Mobile>
      <Default>
        <div className='relative w-[60vw] h-full bg-[#45446c] flex flex-col items-start '>
          <div className='absolute z-0 inset-0 w-full bg-[#e1e1f7] px-5 flex flex-col justify-center items-center'>
            <div className='w-[150px] h-[150px] border-[2px] border-gray-500 box-content rounded-[50%] flex justify-center items-center drop-shadow-2xl'>
              <FaPaperPlane className='text-[90px] text-gray-700 mr-3' />
            </div>
            <div className='flex flex-col items-center mt-5'>
              <p className='text-2xl text-gray-700 font-semibold'>내 메세지</p>
              <p className='text-gray-600 mt-2'>함께할 친구에게 비공개 메세지를 보내보세요!</p>
            </div>
          </div>
          <Outlet />
        </div>
      </Default>
      <Mobile>
        <Outlet />
      </Mobile>
    </div>
    </>
  )
}
