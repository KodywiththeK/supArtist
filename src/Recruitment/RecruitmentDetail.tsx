import { User } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import React, { useContext, useState } from "react"
import { AiFillHeart, AiOutlineCheck, AiOutlineHeart } from "react-icons/ai"
import { BsFileCheck } from "react-icons/bs"
import { RiArrowGoBackFill } from "react-icons/ri"
import { useNavigate, useParams } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"
import AlertModal from "../common/AlertModal"
import ConfirmModal from "../common/ConfirmModal"
import { db, deleteDocData, updateDocData } from "../firebase/firebase"
import useRecruitmentQuery, { ProjectType } from "../reactQuery/RecruitmentQuery"
import useUserQuery, { UserDataType } from "../reactQuery/userQuery"
import { sorting, sortingDefaultValue } from "../recoil/sorting"
import { AuthContext } from "../store/AuthContext"
import Applicants from './Applicants'
import { sortDataType } from "./Recruitment"


export default function RecruitmentDetail() {
  //현재 로그인된 사용자 정보
  const userInfo = useContext(AuthContext)
  const { id } = useParams()
  const navigate = useNavigate()

  //리코일
  const [sortData, setSortData] = useRecoilState<sortDataType>(sorting)
  // const [recruitmentData, setRecruitmentData] = useRecoilState<ProjectType[]>(recruitment)
  // const [userData, setUserData] = useRecoilState<UserDataType[]>(user)
  // const curUser = userData?.find(i => i.id === loginUser?.uid) as UserDataType
  // const thisData = recruitmentData.find(items => items.id === id) as ProjectType
  // const writer = userData.find(user => user.id === thisData?.writer)

  //react-query
  const {isLoading:recruitmentLoading, data:recruitmentData, refetch:recruitmentRefetch} = useRecruitmentQuery()
  const thisData = recruitmentData?.map(i => ({...i})).find(items => items?.id === id as string) as ProjectType
  const {isLoading:userLoading, data:userData, refetch:userRefetch} = useUserQuery()
  const curUser = userData?.map(i => ({...i})).find(i => i.id === userInfo?.uid) as UserDataType
  const writer = userData?.map(i => ({...i})).find(user => user.id === thisData?.writer) as UserDataType

  const heartHandler = async(e:React.MouseEvent) => {
    e.preventDefault();
    // let other = userData.filter((i) => i.id !== curUser?.id)
    let arr = {...curUser}
    if(curUser?.heart.includes(thisData?.id as string)) {
      arr = {...curUser, heart: curUser.heart?.filter(i => i !== thisData?.id)}
    } else {
      arr = {...curUser, heart: [...curUser?.heart, thisData?.id] as string[]}
    }
    // setUserData([...other, arr])
    const docData = doc(db, 'userInfo', userInfo?.uid as string)
    await updateDoc(docData, {
      heart: arr.heart
    })
    userRefetch()
  }

  // confirm modal control
  const [confirmModal, setConfirmModal] = useState(false)
  const title = curUser?.id === thisData?.writer ? '프로젝트 삭제' : '프로젝트 지원'
  const des = curUser?.id === thisData?.writer ? '정말 삭제하시겠습니까?' : `${thisData?.schedule}에 촬영하는 작품 (${thisData?.title})에 (${thisData?.team})으로 지원합니다. 지원하시면 다시 취소하실 수 없으며, 프로젝트의 작성자가 심사 후 결과를 알려드립니다.`
  const confirmBtn = curUser?.id === thisData?.writer ? '삭제' : '지원하기'
  const getModalAnswer = (answer:boolean) => {
    if(answer) {
      title === '프로젝트 삭제' ? handleProjectRemove() : applyHandler()
    }
  }

  // Alert modal control
  const [alertModal, setAlertModal] = useState(false)
  const alertTitle = '지원 완료'
  const alertDes = '이미 지원하신 공고입니다.'


  // 프로젝트 지원
  const applyHandler = async() => {
    if(thisData?.applicant.includes(curUser?.id)) {
      setAlertModal(true)
    } else {
      let userApplyArr = [...curUser?.apply, {id: thisData?.id, state : null}]as {id:string, state:null|boolean}[]
      let recruitmentApplicantArr = [...thisData?.applicant, curUser?.id]as string[]
      await updateDocData('userInfo', curUser?.id as string, {apply: userApplyArr})
      userRefetch();
      // .then(async() => {
      //   const userResult = await getUserData();
      //   setUserData(userResult)
      // })
      await updateDocData('recruitment', thisData.id as string, {applicant: recruitmentApplicantArr})
      recruitmentRefetch();
      // .then(async() => {
      //   const recruitmentResult = await getRecruitmentData([]);
      //   setRecruitmentData(recruitmentResult)
      // })
    }
  }

  //프로젝트 삭제
  const handleProjectRemove = async() => {
    try {
      await deleteDocData('recruitment', thisData?.id as string)
      .then(() => {
        userData?.map(i => (
          i.apply.filter(j => j.id !== thisData?.id as string)
        ))
        userData?.map(i => (
          i.heart.filter(j => j !== thisData?.id as string)
        ))
      })
      .then(() => {
        userData?.map( async i => (
          await updateDocData('userInfo', i.id as string, {
            apply: i.apply,
            heart: i.heart
          })
        ))
      })
      .then(async() => {
        // const userResult = await getUserData();
        // const recruitmentResult = await getRecruitmentData([]);
        // setUserData(userResult)
        // setRecruitmentData(recruitmentResult)
        userRefetch();
        alert('삭제 완료되었습니다.')
        navigate('/recruitment')
      })
    } catch(error) {
      console.error(error)
    }
  }

  const [showApplicant, setShowApplicant] = useState(false)

  // 댓글달기
  const [comment, setComment] = useState({
    id: '',
    writer: curUser?.id as string,
    text: '' as string,
    created: Date.now()
  })
  const setCommentHandler = async() => {
    console.log(comment)
    await updateDocData('recruitment', thisData?.id as string, {
      comments: [...thisData.comments, comment].sort((a,b) => b.created - a.created) as {
        id: string,
        writer: string,
        text: string,
        created: number
      }[]
    })
    recruitmentRefetch();
  }

  const commentRemoveHandler = async(id: string) => {
    await updateDocData('recruitment', thisData?.id as string, {
      comments: thisData.comments.filter(i => i.id !== id).sort((a,b) => b.created - a.created) as {
        id: string,
        writer: string,
        text: string,
        created: number
      }[]
    })
    recruitmentRefetch();
  }


  return (<>
    <AlertModal alertModal={alertModal} setAlertModal={setAlertModal} title={alertTitle} des={alertDes}/>
    <ConfirmModal confirmModal={confirmModal} setConfirmModal={setConfirmModal} getModalAnswer={getModalAnswer} title={title} des={des} confirmBtn={confirmBtn}/>
    <div className="bg-zinc-100 relative">
      <div className="relative mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-10 gap-x-8 pt-24 px-4 sm:px-6 sm:pt-32 lg:max-w-7xl lg:px-8 lg:grid-cols-2 ">
        <div onClick={() => {
          navigate('/recruitment')
          setSortData(sortingDefaultValue)
          }}
          className="absolute flex items-center justify-center right-[5%] top-[180px] text-lg font-bold cursor-pointer">
          <span className="mr-2">목륵으로 돌아가기</span>
          <RiArrowGoBackFill />
        </div>
        <div className="mt-[150px]">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl ">{thisData?.title}</h2>
          <p className="mt-4 text-gray-500">{thisData?.intro}</p>
          <dl className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
            <div className="border-t border-gray-300 pt-4">
              <dt className="font-medium text-xl text-gray-900">작성자</dt>
              <div onClick={() => {
                writer?.id=== userInfo?.uid ? navigate(`/${userInfo?.uid}`) : navigate(`/other/${writer?.id}`)
              }}
                className="flex items-center cursor-pointer mt-2 hover:underline">
                <img src={writer?.pic} alt={`${writer?.name}님의 프로필`} className='h-16 w-16 object-cover rounded-[100%] mr-3' />
                <dd className="text-lg text-gray-500">{writer?.name}</dd>
              </div>
            </div>
            <div className="border-t border-gray-300 pt-4">
              <dt className="font-medium text-xl text-gray-900">작품 장르</dt>
              <dd className="mt-2 text-base text-gray-500">{thisData?.genre}</dd>
            </div>
            <div className="border-t border-gray-300 pt-4">
              <dt className="font-medium text-xl text-gray-900">예상 페이</dt>
              <dd className="mt-2 text-base text-gray-500">{`${thisData?.pay}만원 (12시간 기준)`}</dd>
            </div>
            <div className="border-t border-gray-300 pt-4">
              <dt className="font-medium text-xl text-gray-900">로케이션</dt>
              <dd className="mt-2 text-base text-gray-500">{thisData?.location}</dd>
            </div>
            <div className="border-t border-gray-300 pt-4">
              <dt className="font-medium text-xl text-gray-900">모집 파트</dt>
              <dd className="mt-2 text-base text-gray-500">{`${thisData?.team} ${thisData?.teamNum}명`}</dd>
            </div>
            <div className="border-t border-gray-300 pt-4">
              <dt className="font-medium text-xl text-gray-900">촬영 일정</dt>
              <dd className="mt-2 text-base text-gray-500">{thisData?.schedule}</dd>
            </div>
          
          </dl>
            <div className="border-t border-gray-300 pt-4 mt-16">
              <dt className="font-medium text-xl text-gray-900">안내사항</dt>
              {thisData?.note.map((item, index) => (
                <dd key={index} className="mt-2 text-base text-gray-500 before:content-['✔️']">{` ${item}`}</dd>
              ))}
            </div>
        </div>
        <div className="">
          <img
            src={thisData?.pic}
            alt="작품 소개 이미지"
            className="rounded-lg bg-gray-100 drop-shadow-2xl mb-5 w-[550px] max-h-[600px] object-cover"
          />
          <div className="flex justify-between max-w-[550px] relative">
            {curUser?.id !== thisData?.writer ?
              <>
              {thisData?.state ? 
                <>
                {curUser?.heart.includes(thisData?.id as string) ? 
                  <>
                  <button onClick={heartHandler}
                  className="btn btn--reverse flex justify-center items-center w-full border border-black mr-2">
                    <span>찜해둔 작품</span>
                    <AiFillHeart className="ml-2 text-xl text-[red]"/>
                  </button>
                  </> 
                  : 
                  <>
                  <button onClick={heartHandler}
                  className="btn flex justify-center items-center w-full border border-black mr-2">
                    <span>찜해두기</span>
                    <AiOutlineHeart className="ml-2 text-xl"/>
                  </button>
                  </>
                }
                
                {thisData?.applicant.includes(curUser?.id) ? 
                  <button onClick={(e) => {
                    e.preventDefault()
                    applyHandler()
                  }}
                    className="btn btn--reverse flex justify-center items-center w-full border border-black ml-2">
                    <span>지원 완료</span>
                    <AiOutlineCheck className="ml-2 text-xl"/>
                  </button> 
                  : 
                  <button onClick={(e) => {
                    e.preventDefault();
                    setConfirmModal(true)
                  }}
                    className="btn flex justify-center items-center w-full border border-black ml-2">
                    <span>바로 지원하기</span>
                    <AiOutlineCheck className="ml-2 text-xl"/>
                  </button>
                }
                </>
                :
                <button disabled
                  className="btn flex justify-center items-center w-full border border-black hover:text-black disabled:bg-zinc-300">
                  <span>모집 완료된 공고입니다.</span>
                </button>
              } 
              </>
              :  
              <>
              <button onClick={() => setShowApplicant(true)}
                className="btn btn--reverse flex justify-center items-center w-full border border-black mr-2">
                <span>지원자 확인</span>
                <BsFileCheck className="ml-2 text-xl"/>
              </button>
              <div className="w-full">
                <button onClick={() => navigate(`/projectEdit/${thisData?.id}`)}
                  className="btn flex justify-center items-center w-full h-[40px] border border-black ml-1 mb-1">
                  <span>프로젝트 수정</span>
                </button>
                <button onClick={() => setConfirmModal(true)}
                  className="btn flex justify-center items-center w-full h-[40px] border border-black ml-1 mt-1">
                  <span>삭제</span>
                </button>
              </div>
              </>
            } 
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start mx-auto mt-10 max-w-2xl pb-24 px-4 sm:px-6 sm:pb-32 lg:max-w-7xl lg:px-8 ">
        <div className="w-full max-w-[1200px] h-[1px] border-[0.6px] border-transparent border-b-black mt-10 mb-5"></div>
        <div className="w-full max-w-[1200px] text-xl font-semibold">댓글</div>
        <div className="w-full max-w-[1200px] py-5 pr-2">
          <ul className="pl-5 py-5 rounded-xl bg-white space-y-3 text-slate-500">
            {thisData?.comments?.map((item, index) => (
            <div key={index} className='flex justify-between items-center w-full'>
              <div className="flex items-center">
                <img onClick={() => item?.writer !== curUser?.id ? navigate(`/other/${item?.writer}`) : navigate(`/${item?.writer}`)}
                  src={userData?.find(i => i?.id === item?.writer)?.pic} alt='profile' className="w-[45px] h-[45px] object-cover rounded-[50%] mr-4 shrink-0 cursor-pointer hover:scale-[1.1]" />
                <li className='w-full max-w-[370px]'>{item.text}</li>
              </div>
              {item?.writer === curUser.id && <button onClick={(e) => {
                e.preventDefault();
                commentRemoveHandler(item?.id)
                }}
                className='underline px-2 mr-2'>X</button>}
            </div>
            ))}
          </ul>
          {thisData.state &&
          <div className='w-full max-w-full mt-4 h-20 flex items-center justify-end'>
            <input className="placeholder:italic placeholder:text-slate-400 bg-white w-full max-w-[600px] border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" 
              onChange={(e) => setComment({
                ...comment, 
                id: curUser?.id as string + String(Math.random()),
                text: e.target.value})}
              onKeyDown={(e) => {
                if(e.nativeEvent.isComposing) return;
                if(e.key==="Enter") {
                  e.preventDefault();
                  setCommentHandler();
                  setComment({...comment, text: ''})
                }
              }}
              value={comment.text} 
              placeholder='더 궁금한 점들을 댓글로 남겨보세요!' type="text" />
            <button onClick={(e) => {
              e.preventDefault();
              setComment({...comment, text: ''})
              setCommentHandler();
            }}
              className='btn btn--green rounded-lg h-10 w-16 ml-2 p-1'>Post</button>
          </div>}
        </div>
      </div>
      <Applicants thisData={thisData} showApplicant={showApplicant} setShowApplicant={setShowApplicant} /> 
    </div>
  </>)
}