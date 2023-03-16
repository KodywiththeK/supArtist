import React, { useState } from 'react'
import { BsFillTrashFill } from 'react-icons/bs'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { updateDocData } from '../firebase/firebase'
import useRecruitmentQuery, { ProjectType } from '../reactQuery/RecruitmentQuery'
import useUserQuery from '../reactQuery/userQuery'

export default function MyApplication() {

  const { profile } = useParams()
  const navigate = useNavigate()

  //recoil
  // const recruitmentData = useRecoilValue(recruitment)
  // const userData = useRecoilValue(user)
  // const project = recruitmentData.filter(item => item.applicant.includes(profile as string))
  // const curUser = userData.find(i => i?.id === profile as string)

  //react-query
  const {isLoading:userLoading, data:userData, refetch} = useUserQuery()
  const {isLoading:recruitmentLoading, data:recruitmentData} = useRecruitmentQuery()
  const curUser = userData?.map(i => ({...i})).find(i => i?.id === profile as string)
  let project = recruitmentData?.map(i => ({...i})).filter(item => curUser?.apply.map(i => i.id).includes(item.id))

  const defineState = (dataId:string) => {
    const data = curUser?.apply.find(i => i.id === dataId)
    if(data?.state === null) return '심사중'
    if(data?.state === true) return '합격'
    if(data?.state === false) return '불합격'
  }
  const [stateFilter, setStateFilter] = useState<string[]>([])
  const filterHandler = (value:string) => {
    if(!stateFilter.includes(value)) {
      setStateFilter([...stateFilter, value])
    } else {
      setStateFilter(stateFilter.filter(i => i !== value))
    }
  }

  //필터 적용
  if(stateFilter.length !== 0) {
    let tmp = stateFilter.map(i => {
      if(i === '심사중') return null
      if(i === '합격') return true
      if(i === '불합격') return false
    })
    let newArr = curUser?.apply.filter(item => tmp.includes(item.state)).map(i => i.id)
    project = project?.filter(item => newArr?.includes(item.id))
  }

  //삭제
  const removeHandler = async(id:string) => {
    const Arr = curUser?.apply.filter(i => i.id !== id)
    await updateDocData('userInfo', curUser?.id as string, {
      apply: Arr
    })
    refetch();
  }

  return (<>
  <div className='flex flex-col w-full max-w-[700px]'>
    <div className='flex justify-between items-center mb-4 mt-10 sm:mt-0'>
      <label className='text-black ml-6 mt-2 text-xl font-semibold'>지원 내역</label>
      <button onClick={() => navigate('/recruitment')}
        className='btn border border-black mr-10'>지원하러 가기</button>
    </div>
    <div className='flex justify-around items-center w-full max-w-[680px] mb-10 '>
      <div className='flex justify-around items-center w-full max-w-[600px] border-[0.5px] border-black rounded-lg'>
        <div className='text-lg'>필터 :</div>
        <label className={`flex flex-col items-center my-2 py-2 px-2 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition`}>
          <input 
            onChange={(e) => filterHandler(e.target.value)}
            className='hidden' type='checkbox' name='state' value='심사중'/>
          <div className={`text-lg font-medium text-gray-900 px-3 py-2 mr-1 rounded-lg bg-zinc-100 border border-[2px] ${stateFilter.includes('심사중') ? 'border-black' : 'border-transparent' }`}>
            심사중
          </div>
        </label>
        <label className={`flex flex-col items-center my-2 py-2 px-2 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition`}>
          <input 
            onChange={(e) => filterHandler(e.target.value)}
            className='hidden' type='checkbox' name='state' value='합격'/>
          <div className={`text-lg font-medium text-gray-900 px-3 py-2 mr-1 rounded-lg bg-[#d2df80] border border-[2px] ${stateFilter.includes('합격') ? 'border-black' : 'border-transparent' }`}>합격</div>
        </label>
        <label className={`flex flex-col items-center my-2 py-2 px-2 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition`}>
          <input 
            onChange={(e) => filterHandler(e.target.value)}
            className='hidden' type='checkbox' name='state' value='불합격'/>
          <div className={`text-lg font-medium text-gray-900 px-3 py-2 mr-1 rounded-lg bg-[#ff8761] border border-[2px] ${stateFilter.includes('불합격') ? 'border-black' : 'border-transparent' }`}>불합격</div>
        </label>
      </div>
    </div>
    <div className='flex flex-wrap justify-around'>
      {project?.length !== 0 ? <>
        {project?.map((data, index) => (
          <Link to={`/recruitmentDetail/${data.id}`} key={index} className="relative group mb-10 mx-2 border-[0.8px] bg-white rounded-xl">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-w-7 xl:aspect-h-8">
              <img
                src={data.pic}
                alt='작품 이미지'
                className="h-[250px] w-[290px] object-cover object-center object-contain group-hover:opacity-75"
                />
              {!data.state && <div className="absolute z-10 flex justify-center items-center top-0 h-[250px] w-[290px] rounded-xl bg-black opacity-70 text-white text-3xl font-bold">모집 마감</div>}
              {!data.state && 
              <button onClick={(e) => {
                e.preventDefault();
                removeHandler(data.id);
              }}
                className='absolute z-10 top-0 right-0 m-1 p-2 rounded-[100%] bg-transparent text-white text-xl border border-white '>
                  <BsFillTrashFill />
              </button>}
            </div>
            <h3 className="mt-4 ml-2 text-base text-black">{data.title}</h3>
            <div className="flex justify-between items-center">
              <p className="mt-1 ml-2 text-lg font-medium text-gray-900">{`${data.team} ${data.teamNum}명 모집`}</p>
              <div className={`mt-1 text-lg font-medium text-gray-900 px-3 py-2 rounded-lg ${defineState(data.id)==='심사중' && 'bg-zinc-100'} ${defineState(data.id)==='합격' && 'bg-[#d2df80]'} ${defineState(data.id)==='불합격' && 'bg-[#ff8761]'}`}>
                {defineState(data.id)}
              </div>
            </div>
          </Link>
        ))}
        </>
        :
        <div className='flex text-lg font-semibold w-full ml-10 mb-10'>지원하신 내역이 없습니다.</div>
      }
    </div>
  </div>
      </>
  )
}
