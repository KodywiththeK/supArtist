import React, { Fragment, useContext, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import useUserQuery from '../reactQuery/userQuery'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../store/AuthContext'

interface ProfileModalPropsType {
  profileModal: boolean,
  setProfileModal: (x:boolean) => void
  data: {
    name: string,
    list: string,
    items: string[]
  }
  handleSelect: (id:string) => void
}

export default function ChattingModal({profileModal, setProfileModal, data, handleSelect}:ProfileModalPropsType) {

  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();
  const userInfo = useContext(AuthContext)

  // react-query
  const {isLoading:userLoading, data:userData, refetch} = useUserQuery()
  const listData = userData?.map(i => ({...i})).filter(item => data?.items?.includes(item.id))
  const curUser = userData?.map(i => ({...i})).find(i => i.id === userInfo?.uid)

  return (
    <Transition.Root show={profileModal} as={Fragment}>
      <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={setProfileModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-auto rounded-lg bg-white text-left shadow-xl transition-all my-8 w-full max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-5">
                        {`${data.name} 님의 ${data.list} 리스트`}
                      </Dialog.Title>
                      <div className="my-2 w-full">
                        {listData?.map((item, index) => (
                          <div onClick={() => {
                            handleSelect(item?.id)
                            setProfileModal(false)
                            navigate(`/directMessage/${item?.id}`)
                          }}
                            key={index} className='flex items-center w-full p-2 rounded-lg hover:bg-gray-200 hover:underline cursor-pointer'>
                            <img src={item?.pic} alt='profile' className='w-[50px] h-[50px] rounded-[50%] object-cover mr-5'/>
                            <div className="text-base text-gray-500">{item?.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
