import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import useRecruitmentQuery from '../reactQuery/RecruitmentQuery'
import useUserQuery from '../reactQuery/userQuery'

export default function MyWork() {

  const { profile } = useParams()
  const navigate = useNavigate()

  // recoil
  // const recruitmentData = useRecoilValue(recruitment)
  // const project = recruitmentData.filter(item => item.writer === profile)

  // react-query
  const {isLoading:recruitmentLoading, data:recruitmentData} = useRecruitmentQuery()
  const project = recruitmentData?.map(i => ({...i})).filter(item => item.writer === profile)

  return (<>
  <div className='flex flex-col w-full max-w-[700px]'>
    <div className='flex justify-between items-center mt-10 sm:mt-0'>
      <label className='text-black ml-6 mt-2 mb-10 text-xl font-semibold'>프로젝트</label>
      <button onClick={() => navigate('/newProject')}
        className='btn border border-black mb-6 mr-10'>프로젝트 생성</button>
    </div>
    <div className='flex flex-wrap justify-around'>
    {project?.length !== 0 ? <>
      {project?.map((data, index) => (
        <Link to={`/recruitmentDetail/${data.id}`} key={index} className="group drop-shadow-xl mb-10 mx-2">
          <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-w-7 xl:aspect-h-8">
            <img
              src={data.pic}
              alt='작품 이미지'
              className="h-[250px] w-[290px] object-cover object-center object-contain group-hover:opacity-75"
              />
            {!data.state && <div className="absolute flex justify-center items-center top-0 h-[250px] w-[290px] rounded-xl bg-black opacity-70 text-white text-3xl font-bold">모집 마감</div>}
          </div>
          <h3 className="mt-4 text-base text-black">{data.title}</h3>
          <div className="flex justify-between items-center">
            <p className="mt-1 text-lg font-medium text-gray-900">{`${data.team} ${data.teamNum}명 모집`}</p>
          </div>
        </Link>
      ))}
      </>
      :
      <div className='flex w-full ml-10'>내 프로젝트를 시작해보세요!</div>
    }
    </div>
  </div>
      </>
  )
}
