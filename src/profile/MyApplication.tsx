import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import useRecruitmentQuery from '../reactQuery/RecruitmentQuery'
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
  const {isLoading:userLoading, data:userData} = useUserQuery()
  const {isLoading:recruitmentLoading, data:recruitmentData} = useRecruitmentQuery()
  const curUser = userData?.map(i => ({...i})).find(i => i?.id === profile as string)
  const project = recruitmentData?.map(i => ({...i})).filter(item => item.applicant.includes(profile as string))

  const defineState = (dataId:string) => {
    const data = curUser?.apply.find(i => i.id === dataId)
    if(data?.state === null) return '심사중'
    if(data?.state === true) return '합격'
    if(data?.state === false) return '불합격'
  }

  return (<>
  <div className='flex flex-col w-full max-w-[700px] pr-10'>
    <div className='flex justify-between items-center'>
      <label className='text-black ml-6 mt-2 mb-10 text-xl font-semibold'>지원 내역</label>
      <button onClick={() => navigate('/recruitment')}
        className='btn border border-black mb-6 mr-10'>지원하러 가기</button>
    </div>
    <div className='flex flex-wrap justify-around'>
      {project?.length !== 0 ? <>
        {project?.map((data, index) => (
          <Link to={`/recruitmentDetail/${data.id}`} key={index} className="group mb-10 mx-2">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-w-7 xl:aspect-h-8">
              <img
                src={data.pic}
                alt='작품 이미지'
                className="h-[250px] w-[290px] object-cover object-center object-contain group-hover:opacity-75"
                />
            </div>
            <h3 className="mt-4 text-base text-black">{data.title}</h3>
            <div className="flex justify-between items-center">
              <p className="mt-1 text-lg font-medium text-gray-900">{`${data.team} ${data.teamNum}명 모집`}</p>
              <div className="mt-1 text-lg font-medium text-gray-900 px-2 py-1 mr-1 rounded-lg bg-zinc-100">
                {defineState(data.id)}
                </div>
            </div>
          </Link>
        ))}
        </>
        :
        <div className='flex w-full ml-10'>지원하신 내역이 없습니다.</div>
      }
    </div>
  </div>
      </>
  )
}
