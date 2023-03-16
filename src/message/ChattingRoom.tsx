import { arrayUnion, doc, DocumentData, DocumentSnapshot, onSnapshot, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AiOutlineCloseSquare } from 'react-icons/ai';
import { useMediaQuery } from 'react-responsive';
import { useNavigate, useParams } from 'react-router-dom'
import { localStorageUserId } from '../App';
import { db, updateDocData } from '../firebase/firebase';
import useUserQuery from '../reactQuery/userQuery';

import { AuthContext } from '../store/AuthContext';

export interface MessageType {
  id: string,
  writer: string,
  text: string,
  created: string,
}

export default function ChattingRoom() {

  const {id: chatUserId} = useParams();
  const navigate = useNavigate();

  const userInfo = useContext(AuthContext)
  const userId = userInfo?.uid

  //media-query
  const isDefault: boolean = useMediaQuery({
    query: "(min-width:768px)",
  });

  //react-query
  const {isLoading:userLoading, data:userData} = useUserQuery()
  const curUser = userData?.map(i => ({...i})).find(i => i.id === localStorageUserId)
  const chatUser = userData?.map(i => ({...i})).find(i => i.id === chatUserId)
  const chatId = (curUser && chatUser) && curUser.id as string > String(chatUser?.id) ? curUser?.id as string + String(chatUser?.id) : String(chatUser?.id) + curUser?.id as string;
  
  //input value
  const [inputValue, setInputValue] = useState<MessageType>({
    id: '',
    writer: localStorageUserId,
    text: '',
    created: '',
  })
  console.log(inputValue)
  
  const sendHandler = async() => {
    await updateDoc(doc(db, 'chats', chatId as string), {
      messages: arrayUnion({...inputValue})
    })
    await updateDocData('userChats', localStorageUserId as string, {
      [chatId+".last"]: {
        text: inputValue.text
      },
      [chatId+".date"]: inputValue.created,
      [chatId+".created"]: Date.now()
    })
    await updateDocData('userChats', chatUserId as string, {
      [chatId+".last"]: {
        text: inputValue.text
      },
      [chatId+".date"]: inputValue.created,
      [chatId+".created"]: Date.now()
    })
    setInputValue({
      id: '',
      writer: localStorageUserId,
      text: '',
      created: '',
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
    <div className='absolute inset-0 z-20 bg-white'>
    <div className='absolute top-0 z-20 w-full mt-[80px] h-[80px] bg-[#34335c]'>
      <div className='w-full max-w-[820px] h-full pl-2 pr-4 flex justify-between items-center bg-[#696699]'>
        <div onClick={() => navigate(`/other/${chatUserId}`)} className='text-2xl font-semibold text-gray-200 cursor-pointer ml-5 flex items-center'>
          <img src={chatUser?.pic} alt='profile' className='w-[45px] h-[45px] object-cover rounded-[50%] mr-3' />
          <p>{chatUser?.name}</p>
        </div>
        <button onClick={() => {
          navigate('/directMessage')
        }}
          className='text-3xl font-semibold text-white cursor-pointer'><AiOutlineCloseSquare /></button>
      </div>
    </div>
    <div className='absolute top-[160px] z-20 w-full bg-[#45446c]' style={{height: 'calc(100% - 230px)'}}>
      <div 
        className='w-full h-full max-w-[820px] flex flex-col py-5 px-8 overflow-y-scroll overflow-x-hidden bg-[#e1e1f7]'>
        {messages.map(message => (
          <div key={message.id} ref={ref}>
          {message.writer === localStorageUserId ? 
            <div className='flex flex-row-reverse items-start mb-3 w-full drop-shadow-xl'>
              {/* <img src={curUser?.pic} alt='profile' className='w-[60px] h-[60px] object-cover rounded-[50%]'/> */}
              <div className='relative min-w-[100px] max-w-[60%] min-h-[55px] mt-[15px] mr-5 py-2 px-4 bg-[#45446c] rounded-l-xl rounded-br-xl flex justify-center items-center text-white text-base font-medium tracking-wide break-all whitespace-normal box-border'>
                <span>{message.text}</span>
                <div className='absolute bottom-1 left-[-50px] text-gray-700 text-base'><span>{message.created}</span></div>
              </div>
            </div>
          :
            <div className='flex items-start mb-3 w-full drop-shadow-xl'>
              <img src={chatUser?.pic} alt='profile' onClick={() => navigate(`/other/${chatUser?.id}`)}
                className='w-[60px] h-[60px] object-cover rounded-[50%] border border-gray-700 box-content cursor-pointer'/>
              <div className='relative min-w-[100px] max-w-[60%] min-h-[55px] mt-[15px] ml-5 py-2 px-4 bg-[#97aef1] rounded-r-xl rounded-bl-xl flex justify-center items-center text-white text-base font-medium tracking-wide break-all whitespace-normal box-border'>
                <span>{message.text}</span>
                <div className='absolute bottom-1 right-[-50px] text-gray-700 text-base'><span>{message.created}</span></div>
              </div>
            </div>
          }
          </div>
        ))}
      </div>
    </div>
    <div className='absolute bottom-0 z-20 w-full h-[70px] shrink-0 bg-[#45446c]'>
      <div className='w-full max-w-[820px] h-full py-2 bg-gray-100 flex justify-between items-center'>
        <input 
          onChange={(e) => { 
            setInputValue({
              ...inputValue,
              id: String(Math.random()),
              text: e.target.value,
              created: `${String(new Date().getHours())}:${String(new Date().getMinutes())}`,
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
  </div>)
}
