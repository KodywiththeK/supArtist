import React, { useContext, useState } from 'react'
import {BsPersonFill, BsFilm, BsFillCameraReelsFill } from 'react-icons/bs'
import { AiFillHome, AiFillCaretDown } from 'react-icons/ai'
import { BiSearch } from 'react-icons/bi'
import { AuthContext } from '../store/AuthContext'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { Default, Mobile } from '../mediaQuery'
import { useMediaQuery } from 'react-responsive'


// #41523c
// #609a66
// #9ec08c
// #edf1d6

export default function Header() {

  const [profile, setProfile] = useState(false)
  const [input, setInput] = useState(false)
  // const [mobileInput, setMobileInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const userInfo = useContext(AuthContext)
  const navigate = useNavigate()
  const inputHandler = () => {
    if(inputValue) {
      console.log(inputValue)
      setInputValue('')
    } else setInput(!input)
  }
  const userId = userInfo?.uid
  // const isGoogle = userInfo?.providerData[0].providerId === 'google.com' ? false : true;

  const handleLogout = () => {
    if(confirm('로그아웃 하시겠습니까?') ) {
      signOut(auth)
      .then(() => navigate('/login'))
    }
  }
  const isDefault: boolean = useMediaQuery({
    query: "(min-width:768px)",
  });

  return (<>
    <div className={`fixed z-30 w-full h-[80px] bg-black  flex justify-center`}> {/* bg-[#f6f5f0] */}
      <div className='w-full max-w-screen-xl h-full px-2 flex justify-between items-center'>
        <div className='flex items-center w-[70%] h-full'>
          <Default><>
            <button onClick={() => navigate('/')}
              className='box-content rounded px-3 py-5 ml-2 flex text-2xl justify-center items-center btn btn--white'>
              <AiFillHome className='mr-2'/>
              <span>Home</span>
            </button>
            <button onClick={() => navigate('/recruitment')}
              className='box-content rounded py-5 w-[220px] px-3 border-black flex text-2xl justify-center items-center btn btn--white'>
              <BsFilm className='mr-2' />
              <span>Recruitment</span>
            </button></>
          </Default>
          <Mobile>
            <button onClick={() => navigate('/')}
              className='box-content rounded h-full w-[160px] px-3 ml-2 flex text-white text-3xl font-bold justify-center items-center'>
              <BsFillCameraReelsFill className='mr-2'/>
              <span className='text-2xl'>Sup-Artist</span>
            </button>
          </Mobile>
        </div>

        <div className='flex items-start justify-end mt-6 h-[80%] w-[90%] text-2xl mx-2'>
          <div className='flex items-start w-full'>
            <div className='flex w-full justify-end'>
              <Default><>
              <input className={`${ input ? 'w-[80%] min-w-[60px]  pr-10 bg-white' : 'w-[42px] bg-white text-black'} text-base border border-black px-5 rounded-xl transition-all focus:outline-none`} 
                type='text' placeholder={`${input ? '검색어를 입력하세요' : ''}`} 
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} value={inputValue}
                onKeyDown={(e:React.KeyboardEvent<HTMLInputElement>) => {e.key === 'Enter' && inputHandler()}}
                />
              <BiSearch onClick={inputHandler}
                className='mr-3 ml-[-40px] box-content rounded-3xl p-2 cursor-pointer'/>
              </></Default>
              <Mobile>
              <BiSearch onClick={inputHandler}
                className='mr-3 bg-white box-content rounded-xl p-2 cursor-pointer'/>
              </Mobile>              
            </div>
          </div>
          <Default>
          <div className='w-24 flex justify-start mt-[-5px] text-2xl rounded-2xl btn btn--white border-white'
            onClick={() => {
              if(userInfo === null) {
                confirm('먼저 로그인하셔야 합니다. 로그인하시겠습니까?') && navigate('/login')
              } else setProfile(!profile)
            }}
          >
            <BsPersonFill 
              className={`w-8 box-content cursor-pointer bg-transparent`}
            />
            <AiFillCaretDown className={`box-content cursor-pointer bg-transparent ${profile ? 'rotate-180' : ''}`}/>
          </div>
          </Default>
        </div>
      </div> 
    </div> 
    <div className={`w-full bg-white ${profile && isDefault ? 'h-[150px]' : 'h-[80px]'} ` }></div>
    <Mobile><>
      <div className={`fixed z-20 w-full h-[80px] bg-black flex justify-around items-center px-4 ${input ? 'mt-[-80px] visible' : 'mt-[-160px] invisible'} transition-all`}>
        <input placeholder='검색어를 입력하세요' 
          onKeyDown={(e:React.KeyboardEvent<HTMLInputElement>) => {e.key === 'Enter' && inputHandler()}}
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} 
          value={inputValue} 
          className='text-black text-xl w-[85%] h-[60%] px-3 rounded-lg bg-slate-100 focus:outline-none'/>
        <button className='text-white ml-2 text-xl font-bold'
          onClick={() => setInput(false)}
          >취소</button>
      </div>
    </></Mobile>
    <Default><>
    {userInfo!==null && <div className={`fixed z-10 w-full h-[70px] bg-black text-white flex justify-center mt-[-70px]`}>
      <div className='w-full max-w-screen-xl h-full px-2 flex justify-around items-center text-xl border-t border-t-slate-400'>
        <div className='flex items-center w-[1500px] ml-10 text-base'>{`${userInfo.displayName}님 이 로그인 중입니다.`}</div>
        <p className='btn btn--white w-full py-4 cursor-pointer hover:text-lg' 
          onClick={() => {
            navigate(`/${userId}`)
            setProfile(false)
          }}>내프로필</p>
        <p className='btn btn--white w-full py-4 cursor-pointer hover:text-lg' onClick={() => {
          navigate(`/${userId}/myApplication`)
          setProfile(false)
        }}>지원내역</p>
        <p className='btn btn--white w-full py-4 cursor-pointer hover:text-lg' onClick={() => {
          navigate(`/${userId}/myWork`)
          setProfile(false)
        }}>작품관리</p>
        <p className='btn btn--white w-full py-4 cursor-pointer hover:text-lg' onClick={() => {
          handleLogout()
          setProfile(false)
        }}>로그아웃</p>
      </div>
    </div>} </>
    </Default>
  </>)
}
