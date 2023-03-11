import React, { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import useRecruitmentQuery from '../reactQuery/RecruitmentQuery'
import useUserQuery from '../reactQuery/userQuery'
import { AuthContext } from '../store/AuthContext'

export default function MyProfile() {
  const userInfo = useContext(AuthContext)
  const userId = userInfo?.uid

  // const data = useRecoilValue(user).find(i => i.id === userId)
  // const recruitmentData = useRecoilValue(recruitment)
  // const userData = useRecoilValue(user)
  // const heart = userData.find(i => i.id === userId)?.heart
  // const project = recruitmentData.filter(item => heart?.includes(item.id))

  //react-query
  const {isLoading:userLoading, data:userData} = useUserQuery()
  const curUser = userData?.map(i => ({...i})).find(i => i.id === userId)
  const {isLoading:recruitmentLoading, data:recruitmentData} = useRecruitmentQuery()
  const project = recruitmentData?.map(i => ({...i})).filter(item => curUser?.heart?.includes(item.id))

  return (
    <>
    <div className='flex flex-col w-full max-w-[700px] pr-10'>
      <label className='text-black ml-6 my-4 text-xl font-semibold'>경력사항</label>
      <ul className="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-500 text-xl w-full max-w-[600px]">
        {curUser?.experience.map((t,i) => (
          <div key={i} className='flex justify-between mx-10 my-2 w-full'>
            <li className='w-full'>{t}</li>
          </div>
        ))}
      </ul>
      <label className='text-black ml-6 mt-12 mb-10 text-xl font-semibold'>내가 찜한 프로젝트</label>
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
