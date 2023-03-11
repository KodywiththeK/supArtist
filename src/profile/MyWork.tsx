import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import useRecruitmentQuery from '../reactQuery/RecruitmentQuery'
import useUserQuery from '../reactQuery/userQuery'

export default function MyWork() {

  const { profile } = useParams()

  // recoil
  // const recruitmentData = useRecoilValue(recruitment)
  // const project = recruitmentData.filter(item => item.writer === profile)

  // react-query
  const {isLoading:recruitmentLoading, data:recruitmentData} = useRecruitmentQuery()
  const project = recruitmentData?.map(i => ({...i})).filter(item => item.writer === profile)

  return (<>
  <div className='flex flex-col w-full max-w-[700px] pr-10'>
    <label className='text-black ml-6 mt-2 mb-10 text-xl font-semibold'>내 프로젝트</label>
    <div className='flex flex-wrap justify-around'>
      {project?.map((data, index) => (
        <Link to={`/recruitmentDetail/${data.id}`} key={index} className="group drop-shadow-xl mb-10 mx-2">
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
          </div>
        </Link>
      ))}
    </div>
  </div>
      </>
  )
}
