import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface FilterPropsType {
  filter: boolean
  setFilter: (a:boolean) => void
}

export default function Filter(props: FilterPropsType) {

  return (
    <Transition.Root show={props.filter} as={Fragment}>
      <Dialog as="div" className="relative z-0" onClose={() => props.setFilter(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 top-20 bg-gray-600 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 top-20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 top-20 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-[85px] left-0 ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-white font-extrabold ring-2 ring-white"
                        onClick={() => props.setFilter(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-7 w-7" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-gray-300 py-24 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-2xl text-center mt-2 font-semibold leading-6 text-gray-900">
                        Filter
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <span>작품 장르</span>
                      <span>모집 파트</span>
                      <span></span>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}