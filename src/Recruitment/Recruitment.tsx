import React, { useContext, useEffect, useState } from "react"
import Filter from "./Filter"
import { HiAdjustmentsHorizontal } from 'react-icons/hi2'
import { Link, useNavigate } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { AuthContext } from "../store/AuthContext"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { sorting } from "../recoil/sorting"
import Pagination from "./Pagination"
import useRecruitmentQuery, { ProjectType } from "../reactQuery/RecruitmentQuery"
import useUserQuery, { UserDataType } from "../reactQuery/userQuery"
import { useMutation } from "react-query"


export interface sortDataType {
  except: boolean,
  sort: boolean, 
  genre: string[],
  team: string[],
  search: string
}

export default function Recruitment() {
  const navigate = useNavigate()

  //auth
  const userInfo = useContext(AuthContext)

  //recoil 유저, 모집공고 정보
  // const [recruitmentData, setRecruitmentData] = useRecoilState<ProjectType[]>(recruitment)
  // const [userData, setUserData] = useRecoilState<UserDataType[]>(user)
  // const curUser = (userData?.find(i => i.id === userInfo?.uid)) as UserDataType
  // console.log(recruitmentData)

  //react-query
  const {isLoading:recruitmentLoading, data } = useRecruitmentQuery()
  const recruitmentData = data?.map(i => ({...i})).sort((a,b) => Number(b.id.slice(0,12)) - Number(a.id.slice(0,12)))
  const {isLoading:userLoading, data:userData, refetch} = useUserQuery()
  const curUser = userData?.map(i => ({...i})).find(i => i.id === userInfo?.uid)

  // 필터 상태
  const [filter, setFilter] = useState(false)

  // 데이터 정렬 정보
  const [sortData, setSortData] = useRecoilState(sorting)

  // 데이터 sorting function
  const getResultData = (data:ProjectType[]):ProjectType[] => {
    let resultData = data
    if(sortData.except) {resultData = data?.filter(i => i.state===true) as ProjectType[]}
      else {resultData = data}
    if(!sortData.sort) resultData = resultData?.sort((a,b) => Number(a.schedule.split('-').join('')) - Number(b.schedule.split('-').join('')))
      else resultData= resultData?.sort((a,b) => Number(b.id.slice(0,12)) - Number(a.id.slice(0,12)))
    if(sortData.genre.length > 0) resultData = resultData?.filter(i => sortData.genre.includes(i.genre))
      else resultData
    if(sortData.team.length > 0) resultData = resultData?.filter(i => sortData.team.includes(i.team))
      else resultData
    return resultData as ProjectType[]
  }

  // 페이지네이션
  const [postsPerPage, setPostsPerPage] = useState(4)
  const [curPage, setCurPage] = useState(1)
  const lastPostIdx = curPage * postsPerPage
  const firstPostIdx = lastPostIdx - postsPerPage


  return (
    <div className="relative bg-zinc-200 min-h-screen">
      <Filter filter={filter} setFilter={setFilter}/>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="w-full text-center text-[40px] font-bold mt-2 mb-4">Recruitments</h2>
        <div onClick={() => setFilter(true)}
          className="flex items-center justify-end w-full mb-5 text-2xl font-bold cursor-pointer">
          <span className="mr-2">Filter</span>
          <HiAdjustmentsHorizontal />
        </div>
        <div className="flex w-full justify-between mb-10">
          <div className="flex items-center justify-between w-36 text-lg font-semibold">
            <input type='number' value={postsPerPage} min={1}
              onChange={(e) => setPostsPerPage(Number(e.target.value))} 
              className=" border border-black rounded w-16 border-none focus:outline-none"/>
            <span>개씩 보기</span>
          </div>
          <button onClick={() => navigate('/newProject')}
            className="btn w-36 text-lg border border-black">내 프로젝트 생성</button>
        </div>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          
          {getResultData(recruitmentData as ProjectType[])?.slice(firstPostIdx, lastPostIdx).map((data, index) => (
            <Link to={`/recruitmentDetail/${data.id}`} key={index} className="group drop-shadow-xl">
              <div className="relative aspect-w-1 aspect-h-1 w-ful overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                <img
                  src={data.pic}
                  alt='작품 이미지'
                  className="h-[300px] w-full object-cover object-center object-contain group-hover:opacity-75"
                />
                {!data.state && <div className="absolute flex justify-center items-center top-0 h-[300px] w-full bg-black opacity-70 text-white text-3xl font-bold">모집 마감</div>}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-black">{data.title}</h3>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="mt-1 text-base text-black">{`${data.schedule} 촬영 예정`}</h4>
                  <p className="mt-1 text-base font-medium text-gray-900">{`${data.team} ${data.teamNum}명 ${data.state ? '모집중' : '모집마감'}`}</p>
                </div>
                {(data.writer !== curUser?.id && data.state) &&
                <>
                {(curUser && curUser?.heart.includes(data.id)) ? <AiFillHeart onClick={ async(e) => {
                  e.preventDefault();
                  let arr = ({...curUser, heart: curUser?.heart.filter(i => data.id !== i)})
                  // setUserData(userData.map((i) => i.id===curUser.id ? arr : i))
                  const docData = doc(db, 'userInfo', userInfo?.uid as string)
                  await updateDoc(docData, {
                    heart: arr.heart
                  })
                  refetch();
                }}
                  className="text-2xl pointer-cursor box-content px-4 py-2 ml-2 text-[red]" />
                  : 
                <AiOutlineHeart onClick={async(e) => {
                  e.preventDefault();
                  let arr = {...curUser, heart: [...curUser?.heart as string[], data.id]}
                  // setUserData(userData.map((i) => i.id===curUser.id ? arr : i))
                  const docData = doc(db, 'userInfo', userInfo?.uid as string)
                  await updateDoc(docData, {
                    heart: arr.heart
                  })
                  refetch();
                }}
                  className="text-2xl pointer-cursor box-content px-4 py-2 ml-2 text-[red]" />}
                </>}
              </div>
            </Link>
          ))}
        </div>
        <Pagination resultData={getResultData(recruitmentData as ProjectType[]) as ProjectType[]} postsPerPage={postsPerPage} curPage={curPage} setCurPage={setCurPage} first={firstPostIdx} last={lastPostIdx}/>
      </div>
    </div>
  )
}