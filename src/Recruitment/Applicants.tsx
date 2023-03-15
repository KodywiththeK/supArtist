import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useRecoilState } from 'recoil'
import { age } from '../profile/ProfilePage'
import { useNavigate } from 'react-router-dom'
import { updateDocData } from '../firebase/firebase'
import useUserQuery from '../reactQuery/userQuery'
import useRecruitmentQuery, { ProjectType } from '../reactQuery/RecruitmentQuery'
import ConfirmModal from '../common/ConfirmModal'


interface ApplicantsPropsType {
  thisData: ProjectType,
  showApplicant: boolean,
  setShowApplicant: (boolean: boolean) => void
}

export default function Applicants({thisData, showApplicant, setShowApplicant}: ApplicantsPropsType) {

  // recoil
  // const [userData, setUserData] = useRecoilState<UserDataType[]>(user)
  // const [recruitmentData, setRecruitmentData] = useRecoilState<ProjectType[]>(recruitment)
  // const applicantData = userData.filter(i => thisData?.applicant.includes(i.id))
  
  // react-query
  const {isLoading:userLoading, data:userData, refetch:userRefetch } = useUserQuery()
  const { refetch } = useRecruitmentQuery()
  const applicantData = userData?.map(i => ({...i})).filter(i => thisData?.applicant.includes(i.id))
  // const project = recruitmentData?.map(i => ({...i})).filter(item => curUser?.heart?.includes(item.id))
  // console.log(applicantData)


  const navigate = useNavigate()

  // 지원자 수락
  const acceptHandler = async(e:React.MouseEvent, userId:string) => {
    e.preventDefault();
    if(thisData?.confirmed.includes(userId)){
      await updateDocData('recruitment', thisData?.id, {confirmed: thisData?.confirmed.filter(i=> i !== userId)})
    } else {
      await updateDocData('recruitment', thisData?.id, {confirmed: [...thisData?.confirmed, userId]})
    }
    refetch();
    
    // const recruitmentResult = await getRecruitmentData([]);
    // setRecruitmentData(recruitmentResult)
  }

  //지원자 삭제
  const removeHandler = async(e:React.MouseEvent, userId: string) => {
    e.preventDefault();
    await updateDocData('recruitment', thisData?.id, {applicant: thisData?.applicant.filter(i => i !== userId)})
    refetch();
    // const recruitmentResult = await getRecruitmentData([]);
    // setRecruitmentData(recruitmentResult)
  } 

  // 모집 마감
  const doneHandler = async() => {
    await updateDocData('recruitment', thisData?.id, {state: false, applicant: [...thisData.confirmed]})
    refetch();
    applicantData?.map(async (user) => {
      await updateDocData('userInfo', user.id, 
        { apply: user.apply.map((i) => (
          thisData.confirmed.includes(user.id) ?
            i.id === thisData.id ? {...i, state: true} : {...i} 
            :
            i.id === thisData.id ? {...i, state: false} : {...i}
      ))})
    })
    userRefetch()
    // const userResult = await getUserData();
    // const recruitmentResult = await getRecruitmentData([]);
    // setUserData(userResult)
    // setRecruitmentData(recruitmentResult)
    setShowApplicant(false)
  }

  // confirm modal control
  const [confirmModal, setConfirmModal] = useState(false)
  const getModalAnswer = (answer:boolean) => {
    console.log(answer)
    answer && doneHandler()
  }
  const title = '모집 마감하기'
  const des = '모집을 마감하시겠습니까?'
  const confirmBtn = '모집 마감'

  return (<>
    <ConfirmModal confirmModal={confirmModal} setConfirmModal={setConfirmModal} getModalAnswer={getModalAnswer} title={title} des={des} confirmBtn={confirmBtn}/>
    <Transition.Root show={showApplicant} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setShowApplicant}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed z-10 inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-20 inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between mt-20">
                        <Dialog.Title className="text-xl font-semibold text-gray-900 mb-2">지원자 목록</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setShowApplicant(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8 ">
                        <div className="flow-root">
                          <ul role="list" className="h-full my-3">
                            {applicantData?.map((user) => (
                              <li key={user?.id} className={`flex py-5 px-2 mb-3 transition-all ${thisData?.confirmed.includes(user?.id) ? "border-[2px] border-indigo-600 rounded-2xl" : 'border border-[2px] border-transparent'}`}>
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-black">
                                  <img onClick={() => navigate(`/other/${user?.id}`)}
                                    src={user?.pic}
                                    alt={`${user?.name} 사진`}
                                    className="h-full w-full object-cover object-center cursor-pointer"
                                  />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div onClick={() => navigate(`/other/${user?.id}`)}
                                      className="flex justify-between text-lg font-medium text-gray-900 cursor-pointer hover:underline">
                                      <h3>{user?.name}</h3>
                                    </div>
                                    <p className="mt-1 text-base text-gray-500">{`만 ${age(user?.bday)}세 / ${user?.gender}`}</p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-end text-sm">
                                    <div className="flex">
                                      <button onClick={(e) => acceptHandler(e, user?.id)}
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500 mr-6"
                                      >
                                        {`${thisData?.confirmed.includes(user?.id) ? 'Cancel' : 'Accept'}`}
                                      </button>
                                      {!thisData?.confirmed.includes(user?.id) && 
                                      <button onClick={(e) => removeHandler(e, user?.id)}
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500 mr-4"
                                      >
                                        Remove
                                      </button>}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-lg font-medium text-gray-900">
                        <p>현재 모집률</p>
                        <p>{thisData?.confirmed ? String(Math.floor(thisData?.confirmed.length / Number(thisData?.teamNum) * 100)) + ' %' : '0 %'}</p>
                      </div>
                      <div className="mt-6">
                        <button onClick={(e) => {
                          e.preventDefault();
                          setConfirmModal(true)
                        }}
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 mb-24 sm:mb-0 text-base font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-zinc-300"
                          disabled={(thisData?.confirmed.length !== Number(thisData?.teamNum)) || !thisData?.state}
                        >
                          {thisData?.state ? '모집 마감하기' : '모집이 마감되었습니다.'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  </>)
}
