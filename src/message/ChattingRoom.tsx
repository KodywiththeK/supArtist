import { arrayUnion, doc, DocumentData, DocumentSnapshot, onSnapshot, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil';
import { db, updateDocData } from '../firebase/firebase';
import useUserQuery from '../reactQuery/userQuery';

import { AuthContext } from '../store/AuthContext';

export interface MessageType {
  id: string,
  writer: string,
  text: string,
  created: string,
  now: number
}

export default function ChattingRoom() {

  const {id: chatUserId} = useParams();
  const navigate = useNavigate();

  const userInfo = useContext(AuthContext)
  const userId = userInfo?.uid


  //react-query
  const {isLoading:userLoading, data:userData} = useUserQuery()
  const curUser = userData?.map(i => ({...i})).find(i => i.id === userId)
  const chatUser = userData?.map(i => ({...i})).find(i => i.id === chatUserId)
  const chatId = (curUser && chatUser) && curUser.id as string > String(chatUser?.id) ? curUser?.id as string + String(chatUser?.id) : String(chatUser?.id) + curUser?.id as string;
  console.log(chatId)

  //input value
  const [inputValue, setInputValue] = useState<MessageType>({
    id: '',
    writer: curUser?.id as string,
    text: '',
    created: '',
    now: 0
  })
  console.log(inputValue)
  const sendHandler = async() => {
    await updateDoc(doc(db, 'chats', chatId as string), {
      messages: arrayUnion({...inputValue})
    })
    await updateDocData('userChats', userId as string, {
      [chatId+".last"]: {
        text: inputValue.text
      },
      [chatId+".date"]: inputValue.created,
    })
    await updateDocData('userChats', chatUserId as string, {
      [chatId+".last"]: {
        text: inputValue.text
      },
      [chatId+".date"]: inputValue.created,
    })
    setInputValue({
      id: '',
      writer: curUser?.id as string,
      text: '',
      created: '',
      now: 0
    })
  }

  const [messages, setMessages] = useState<MessageType[]>([])
  
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId as string), (doc:DocumentSnapshot<DocumentData>) => {
      doc.exists() && setMessages(doc.data().messages)
    })
    return () => {
      unSub();
    }
  }, [chatId])

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.scrollIntoView({behavior: "smooth"})
  }, [messages])

  return (
    <>
    <div className='relative z-10 w-full mt-[80px] h-[80px] bg-[#696699] shrink-0'>
      <div className='w-full max-w-[820px] h-full px-5 flex justify-between items-center'>
        <p onClick={() => navigate(`/other/${chatUserId}`)}
          className='text-2xl font-semibold text-gray-200 cursor-pointer ml-5'>{chatUser?.name}</p>
        <button className='text-2xl font-semibold text-white'><BsThreeDots /></button>
      </div>
    </div>
    <div className='relative z-10 w-full h-full bg-[#e1e1f7]'>
      <div 
        className='w-full h-full max-h-[76vh] max-w-[820px] flex flex-col py-5 px-8 overflow-y-scroll overflow-x-hidden'>
        {messages.map(message => (
          <div key={message.id} ref={ref}>
          {message.writer === userId ? 
            <div className='flex flex-row-reverse items-start mb-3 w-full drop-shadow-xl'>
              {/* <img src={curUser?.pic} alt='profile' className='w-[60px] h-[60px] object-cover rounded-[50%]'/> */}
              <div className='relative min-w-[100px] max-w-[60%] min-h-[55px] mt-[15px] mr-5 py-4 px-5 bg-[#97aef1] rounded-l-xl rounded-br-xl flex justify-center items-center text-white text-lg font-medium tracking-wide break-all whitespace-normal box-border'>
                <span>{message.text}</span>
                <div className='absolute bottom-1 left-[-50px] text-gray-700 text-base'><span>{message.created}</span></div>
              </div>
            </div>
          :
            <div className='flex items-start mb-3 w-full drop-shadow-xl'>
              <img src={chatUser?.pic} alt='profile' className='w-[60px] h-[60px] object-cover rounded-[50%]'/>
              <div className='relative min-w-[100px] max-w-[60%] min-h-[55px] mt-[15px] ml-5 py-4 px-5 bg-[#97aef1] rounded-r-xl rounded-bl-xl flex justify-center items-center text-white text-lg font-medium tracking-wide break-all whitespace-normal box-border'>
                <span>{message.text}</span>
                <div className='absolute bottom-1 right-[-50px] text-gray-700 text-base'><span>{message.created}</span></div>
              </div>
            </div>
          }

          </div>
        ))}
        
        
        

      </div>
    </div>
    <div className='relative z-10 w-full h-[70px] bg-gray-100 shrink-0'>
      <div className='w-full max-w-[820px] h-full py-2 bg-gray-100 flex justify-between items-center'>
        <input 
          onChange={(e) => { 
            setInputValue({
              ...inputValue,
              id: String(Math.random()),
              text: e.target.value,
              created: `${String(new Date().getHours())}:${String(new Date().getMinutes())}`,
              now: Date.now()
            }) 
          }}
          onKeyDown={(e:React.KeyboardEvent<HTMLInputElement>) => {e.key === 'Enter' && sendHandler()}}
          value={inputValue.text}
          className='w-full h-full px-4 outline-none border-none text-lg tracking-wide bg-transparent'
          placeholder='메세지를 입력하세요'/>
        <button onClick={sendHandler}
          className='btn btn--reverse border-[2px] border-black w-[80px] h-full mr-1 shrink-0'>전송</button>
      </div>
    </div>
  </>)
}
