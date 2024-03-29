import React, { useContext, useRef, useState } from 'react'
import {BsPersonFill, BsFilm, BsFillCameraReelsFill } from 'react-icons/bs'
import { AiFillHome, AiFillCaretDown } from 'react-icons/ai'
import { BiLogIn, BiSearch } from 'react-icons/bi'
import { AuthContext } from '../store/AuthContext'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { Default, Mobile } from '../mediaQuery'
import { useMediaQuery } from 'react-responsive'
import { useRecoilState } from 'recoil'
import { sorting, sortingDefaultValue } from '../recoil/sorting'
import useUserQuery from '../reactQuery/userQuery'
import useRecruitmentQuery, { ProjectType } from '../reactQuery/RecruitmentQuery'
import ConfirmModal from './ConfirmModal'
import { FaPaperPlane } from 'react-icons/fa'


// #41523c
// #609a66
// #9ec08c
// #edf1d6

export default function Header() {

  const navigate = useNavigate()

  // Auth 정보
  const userInfo = useContext(AuthContext)
  const userId = userInfo?.uid

  //recoil
  const [sortData, setSortData] = useRecoilState(sorting)

  //react-query
  const { isLoading, data, isError, error, refetch } = useRecruitmentQuery()
  const resultData = data?.map((i) => ({...i})) as ProjectType[]
  
  //profile 창
  const [profile, setProfile] = useState(false)

  //검색창
  const [input, setInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const inputHandler = () => {
    if(inputValue && !input) setInput(!input)
    if(inputValue && input) {
      setSortData({...sortData, search: inputValue})
      navigate(`/recruitmentSearch/${inputValue}`)
      setInput(!input)
    } else setInput(!input)
  }

  // 검색 자동완성 data
  const sortedData = resultData?.filter(i => i.title?.split(' ').join('').includes(inputValue))

  //Confirm Modal Control
  const [title, setTitle] = useState('비회원 제한')
  const [des, setDes] = useState('먼저 로그인하셔야 합니다. 로그인하시겠습니까?')
  const [btn, setBtn] = useState('로그인 페이지로 이동')
  const [confirmModal, setConfirmModal] = useState(false)
  const getModalAnswer = (answer:boolean) => {
    if(answer) {
      title==='Access control' ? navigate('/login') : signOut(auth).then(() => navigate('/login'))
    }
  }

  //로그아웃
  const handleLogout = () => {
    setTitle('로그아웃 알림')
    setDes('로그아웃 하시겠습니까?')
    setBtn('로그아웃')
    setConfirmModal(true)
  }

  //media Query
  const isDefault: boolean = useMediaQuery({
    query: "(min-width:768px)",
  });

  return (<>
    <ConfirmModal confirmModal={confirmModal} setConfirmModal={setConfirmModal} getModalAnswer={getModalAnswer} title={title} des={des} confirmBtn={btn}/>
    <div className={`fixed z-50 w-full h-[80px] bg-black  flex justify-center`}> {/* bg-[#f6f5f0] */}
      <div className='w-full max-w-screen-xl h-full px-2 flex justify-between items-center'>
        <div className={`flex items-center ${isDefault ? 'w-[70%]' : 'w-[62%]'} h-full`}>
          <Default><>
            <button onClick={() => navigate('/')}
              className='box-content rounded px-3 py-5 ml-2 flex text-2xl justify-center items-center btn btn--white'>
              <AiFillHome className='mr-2'/>
              <span>Home</span>
            </button>
            <button onClick={() => {
              if(userInfo === null) {
                setConfirmModal(true)
              } else {
              setSortData(sortingDefaultValue)
              setInputValue('')
              navigate('/recruitment')
              }}}
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
        
        {userInfo === null ?
          <div onClick={() => navigate('/login')}
            className={`flex items-center justify-center mx-2 ${isDefault ? 'btn btn--white text-2xl font-semibold' : 'text-white text-xl font-semibold border border-white rounded-lg px-3 py-2'} cursor-pointer`}>
            <p>Log in</p>
            <BiLogIn />
          </div>
        :
        <div className='flex items-start justify-end mt-6 h-[80%] w-[90%] text-2xl mx-2'>
          <div className='flex items-start w-full'>
            <div className='flex w-full justify-end relative'>
              <Default><>
              <input className={`${ input ? 'w-[100%] min-w-[60px]  pr-10 bg-white' : 'w-[42px] bg-white text-black'} text-base border border-black px-5 rounded-xl transition-all focus:outline-none`} 
                type='text' placeholder={`${input ? '모집공고의 제목을 검색해보세요' : ''}`} 
                ref = {inputRef} tabIndex={1}
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} value={inputValue}
                onKeyDown={(e:React.KeyboardEvent<HTMLInputElement>) => {e.key === 'Enter' && inputHandler()}}
                />
              <BiSearch tabIndex={1}
                onClick={() => {
                  inputRef.current?.focus()
                  inputHandler()
                }}
                className='mr-3 ml-[-40px] box-content rounded-3xl p-2 cursor-pointer focus:outline-none'/>
              </></Default>
              <Mobile>
                <BiSearch onClick={() => { inputHandler() }}
                  className='mr-3 bg-white box-content rounded-xl p-2 cursor-pointer'/>
              </Mobile>  
              <Default>
                <>
                {(inputValue && input) && 
                <div className='absolute w-[98%] max-h-[250px] bg-white top-[50px] right-[10px] py-2 rounded'>
                  <div className='w-full max-h-[230px] pr-5 pl-4 overflow-y-scroll'>
                    {sortedData.length > 0 ? 
                      <>
                      {sortedData.map((data, index) => (
                      <button key={index} onClick={() => {
                        setInput(false) 
                        navigate(`/recruitmentDetail/${data.id}`)
                      }}
                        className='flex items-center tab w-full' tabIndex={1}>
                        <img src={data.pic} alt='recruitment image' className='object-cover h-14 w-14 rounded-lg py-1 mr-3 box-content cursor-pointer'/>
                        <div className='text-lg py-1 truncate cursor-pointer hover:underline'>{data.title}</div>
                      </button>
                      ))}
                      </> 
                      : 
                      <div className='flex items-center'>
                        <div className='text-lg py-1 truncate w-full'>검색 결과가 없습니다.</div>
                      </div> 
                    }
                  </div>
                </div>}
                </>
              </Default>            
            </div>
          </div>
          <Default><>
          <div className='w-24 ml-1 flex justify-start mt-[-5px] text-2xl rounded-lg btn btn--white border-white hover:scale-[1.1]'
            onClick={() => { setProfile(!profile) }}
          >
            <BsPersonFill 
              className={`w-8 box-content cursor-pointer bg-transparent`}
            />
            <AiFillCaretDown className={`box-content cursor-pointer bg-transparent ${profile ? 'rotate-180' : ''}`}/>
          </div>
          <div onClick={() => { navigate('/directMessage') }}
            className='flex justify-center items-center w-[50px] box-content py-[13px] pl-[3px] pr-[5px] mt-[-5px] ml-4 border-[2px] border-white rounded-[50%] text-white hover:bg-white hover:text-black hover:scale-[1.1] transition cursor-pointer'>
            <FaPaperPlane className='text-xl'/>
          </div>
          </></Default>
        </div>}
      </div> 
    </div> 
    {/* <div className={`w-full bg-white ${(profile && isDefault) ? 'h-[150px]' : 'h-[80px]'} ` }></div> */}
    <Mobile><>
      <div className={`fixed z-50 w-full h-[80px] bg-black flex justify-around items-center px-4 ${input ? 'mt-0 visible' : 'mt-[-80px] invisible'} transition-all`}>
        <input placeholder='모집 공고의 제목을 검색해보세요' 
          onKeyDown={(e:React.KeyboardEvent<HTMLInputElement>) => {e.key === 'Enter' && inputHandler()}}
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} 
          value={inputValue} 
          className='text-black text-xl w-[85%] h-[60%] px-3 rounded-lg bg-slate-100 focus:outline-none'/>
        <button className='text-white ml-2 text-xl font-bold'
          onClick={() => setInput(false)}
          >취소</button>
        <>
        {(inputValue && input) && 
        <div className='absolute w-[78%] max-h-[250px] bg-white top-[70px] left-[5%] py-2 rounded'>
          <div className='w-full max-h-[230px] pr-5 pl-4 overflow-y-scroll'>
            {sortedData?.length > 0 ? 
              <>
              {sortedData.map((data, index) => (
              <button key={index} onClick={() => {
                setInput(false) 
                navigate(`/recruitmentDetail/${data.id}`)
              }}
                className='flex items-center tab w-full' tabIndex={1}>
                <img src={data.pic} alt='recruitment image' className='object-cover h-14 w-14 rounded-lg py-1 mr-3 box-content cursor-pointer'/>
                <div className='text-lg py-1 truncate cursor-pointer hover:underline'>{data.title}</div>
              </button>
              ))}
              </> 
              : 
              <div className='flex items-center'>
                <div className='text-lg py-1 truncate w-full'>검색 결과가 없습니다.</div>
              </div> 
            }
          </div>
        </div>}
        </>
      </div>
    </></Mobile>
    <Default><>
    {/* <div className={`w-full bg-black ${profile && isDefault ? 'h-[80px]' : 'h-0'} transition-all`}></div> */}
    {userInfo!==null && <div className={`fixed z-30 w-full h-[70px] bg-black bg-opacity-80 text-white flex justify-center ${profile && isDefault ? 'mt-[80px]' : 'mt-0'} transition-all`}>
      <div className='w-full max-w-screen-xl h-full px-2 flex justify-around items-center text-xl border-t border-t-slate-400'>
        <div className='flex items-center w-[1500px] ml-10 text-base'>{`${userInfo.displayName}님 이 로그인 중입니다.`}</div>
        <p className='btn btn--white w-full py-4 cursor-pointer hover:text-lg' 
          onClick={() => {
            navigate(`/${userId}`)
            setProfile(false)
          }}>마이페이지</p>
        <p className='btn btn--white w-full py-4 cursor-pointer hover:text-lg' onClick={() => {
          navigate(`/${userId}/myApplication`)
          setProfile(false)
        }}>지원 내역</p>
        <p className='btn btn--white w-full py-4 cursor-pointer hover:text-lg' onClick={() => {
          navigate(`/${userId}/myWork`)
          setProfile(false)
        }}>프로젝트 관리</p>
        <p className='btn btn--white w-full py-4 cursor-pointer hover:text-lg' onClick={() => {
          handleLogout()
          setProfile(false)
        }}>로그아웃</p>
      </div>
    </div>} </>
    </Default>
  </>)
}
