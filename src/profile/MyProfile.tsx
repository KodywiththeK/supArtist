import React, { useContext } from 'react'
import { BsFillTrashFill } from 'react-icons/bs'
import { Link, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { updateDocData } from '../firebase/firebase'
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
  const {isLoading:userLoading, data:userData, refetch} = useUserQuery()
  const curUser = userData?.map(i => ({...i})).find(i => i.id === userId)
  const {isLoading:recruitmentLoading, data:recruitmentData} = useRecruitmentQuery()
  const project = recruitmentData?.map(i => ({...i})).filter(item => curUser?.heart?.includes(item.id))

  //찜한 아이템 삭제
  const removeHandler = async(id:string) => {
    const Arr = curUser?.heart.filter(i => i !== id)
    await updateDocData('userInfo', curUser?.id as string, {
      heart: Arr
    })
    refetch();
  }

  return (
    <>
    <div className='flex flex-col w-full max-w-[700px]'>
      <label className='text-black ml-6 my-4 text-xl font-semibold'>경력사항</label>
      <ul className="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-500 text-lg sm:text-xl w-full">
        {curUser?.experience.map((t,i) => (
          <div key={i} className='mx-8 my-2 '>
            <li className=''>{t}</li>
          </div>
        ))}
      </ul>
      <label className='text-black ml-6 mt-12 mb-10 text-xl font-semibold'>내가 찜한 프로젝트</label>
      <div className='flex flex-wrap justify-around'>
      {project?.length!==0 ? <>
        {project?.map((data, index) => (
          <Link to={`/recruitmentDetail/${data.id}`} key={index} className="group drop-shadow-xl mb-10 mx-2">
            <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-w-7 xl:aspect-h-8">
              <img
                src={data.pic}
                alt='작품 이미지'
                className="h-[250px] w-[290px] object-cover object-center object-contain group-hover:opacity-75"
              />
              {!data.state && <div className="absolute flex justify-center items-center top-0 h-[250px] w-[290px] rounded-xl bg-black opacity-70 text-white text-3xl font-bold">모집 마감</div>}
              <button onClick={(e) => {
                e.preventDefault();
                removeHandler(data.id);
              }}
                className='absolute z-10 top-0 right-0 m-1 p-2 rounded-[100%] bg-transparent text-white text-xl border border-white '>
                  <BsFillTrashFill />
              </button>
            </div>
            <h3 className="mt-4 text-base text-black">{data.title}</h3>
            <div className="flex justify-between items-center">
              <p className="mt-1 text-lg font-medium text-gray-900">{`${data.team} ${data.teamNum}명 모집`}</p>
            </div>
          </Link>
        ))} 
        </>
        :
        <div className='flex w-full ml-10 mb-10 text-lg'>현재 찜한 프로젝트가 없습니다. 관심있는 프로젝트에 하트를 눌러보세요!</div>
      }
      </div>
    </div>
    </>
  )
}
