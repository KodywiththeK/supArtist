import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { recruitment } from '../recoil/recruitment'
import { user } from '../recoil/user'

export default function MyApplication() {

  const { profile } = useParams()
  const recruitmentData = useRecoilValue(recruitment)
  const userData = useRecoilValue(user)
  const project = recruitmentData.filter(item => item.applicant.includes(profile as string))
  const curUser = userData.find(i => i?.id === profile as string)
  const defineState = (dataId:string) => {
    const data = curUser?.apply.find(i => i.id === dataId)
    if(data?.state === null) return '심사중'
    if(data?.state === true) return '합격'
    if(data?.state === false) return '불합격'
  }

  return (<>
    <label className='text-black ml-6 mt-2 mb-10 text-xl font-semibold'>지원 내역</label>
    <div className='flex flex-wrap max-w-[700px]'>
      {project.map((data, index) => (
        <Link to={`/recruitment/${data.id}`} key={index} className="group mb-10 mx-2">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-w-7 xl:aspect-h-8">
            <img
              src={data.pic}
              alt='작품 이미지'
              className="h-[250px] w-[300px] object-cover object-center object-contain group-hover:opacity-75"
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
      </div>
      </>
  )
}
