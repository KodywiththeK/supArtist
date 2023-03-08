import React, { Fragment, useContext, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { FaTheaterMasks } from 'react-icons/fa'
import { BsBroadcast, BsPeopleFill } from 'react-icons/bs'
import { SiApplemusic, SiWebtoon } from 'react-icons/si'
import { TfiYoutube } from 'react-icons/tfi'
import { GiFilmSpool, GiLargeDress, GiPalette } from 'react-icons/gi'
import { RiAdvertisementFill } from 'react-icons/ri'
import { BiSupport } from 'react-icons/bi'
import { IoMdFlashlight } from 'react-icons/io'
import { useRecoilState, useRecoilValue } from 'recoil'
import { user } from '../recoil/user'
import { AuthContext } from '../store/AuthContext'
import { sortDataType } from './Recruitment'
import { sorting } from '../recoil/sorting'

interface FilterPropsType {
  filter: boolean
  setFilter: (a:boolean) => void
  // getSortData: (data: sortDataType) => void
}

export default function Filter(props: FilterPropsType) {

  const authInfo = useContext(AuthContext)
  const userData = useRecoilValue(user)
  const curUser = userData.find(i => i?.id === authInfo?.uid)
  const [sortData, setSortData] = useRecoilState(sorting)

  const onChangeHandler = (e:React.ChangeEvent<HTMLInputElement>, name:string, value:string) => {
    if(name === 'except') setSortData({...sortData, except: !sortData.except})
    if(name === 'sort') setSortData({...sortData, sort: !sortData.sort})
    if(name === 'genre') {
      if(!sortData.genre.includes(value)) setSortData({...sortData, genre: [...sortData.genre, value]})
      else setSortData({...sortData, genre: sortData.genre.filter(i => value !== i)})
    }
    if(name === 'team') {
      if(!sortData.team.includes(value)) setSortData({...sortData, team: [...sortData.team, value]})
      else setSortData({...sortData, team: sortData.team.filter(i => value !== i)})
    }
  }

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
                  <div className="flex h-full flex-col overflow-y-scroll bg-gray-200 py-24 mr-[-16px] shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-2xl text-center mt-2 font-semibold leading-6 text-gray-900">
                        Filter
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className='flex justify-start items-center text-lg mx-2 mb-2'>
                        <label className='flex items-center'>
                          <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                            checked={sortData.except}
                            className='mr-2' type='checkbox' name='except' value='done' />
                          <span>마감된 공고 제외</span>
                        </label>
                      </div>
                      <div className='flex justify-around items-center mb-2'>
                        <button onClick={() => {
                          setSortData({...sortData, genre:curUser?.interest as string[], team:curUser?.team as string[]})
                          props.setFilter(false)
                        }}
                          className='btn btn--reverse border border-[2px] border-[#333] w-full mr-2' >✨ 내 맞춤 필터</button>
                        <button onClick={() => {
                          setSortData({except:false, sort:true, genre:[], team:[], search:''})
                          props.setFilter(false)
                        }}
                          className='btn btn--green w-full ml-2'>필터 초기화</button>
                      </div>
                      <p className='mb-8 text-sm'>✔️ 내 맞춤필터는 프로필에 설정된 내 관심분야와 파트를 기준으로 필터링 해줍니다.</p>
                      <div className='flex flex-col mb-5'>
                        <label className='text-xl font-semibold mb-2'>정렬</label>
                        <div className='flex items-center'>
                          <label className='flex items-center mr-5'>
                            <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                              checked={sortData.sort}
                              className='mr-2' type='radio' name='sort' value='최신순'/>
                            <span>최신순</span>
                          </label>
                          <label className='flex items-center'>
                            <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                              checked={!sortData.sort}
                              className='mr-2' type='radio' name='sort' value='촬영날짜순'/>
                            <span>촬영날짜순</span>
                          </label>
                        </div>
                      </div>
                      <div className='flex flex-col mb-5'>
                        <label className='text-xl font-semibold mb-2'>장르별</label>
                        <div className='flex justify-around'>
                          <label className={`flex flex-col items-center mx-3 my-2 py-2 px-3 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition ${sortData.genre.includes('영화') ? 'border border-zinc-500' : ''}`}>
                            <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                              className='hidden' type='checkbox' name='genre' value='영화'/>
                            <GiFilmSpool className='text-[40px]'/>
                            <span className='text-sm'>영화</span>
                          </label>
                          <label className={`flex flex-col items-center mx-3 my-2 py-2 px-3 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition ${sortData.genre.includes('드라마') ? 'border border-zinc-500' : ''}`}>
                            <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                              className='hidden' type='checkbox' name='genre' value='드라마'/>
                            <FaTheaterMasks className='text-[40px]'/>
                            <span className='text-sm'>드라마</span>
                          </label>
                          <label className={`flex flex-col items-center mx-3 my-2 py-2 px-3 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition ${sortData.genre.includes('광고') ? 'border border-zinc-500' : ''}`}>
                            <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                              className='hidden' type='checkbox' name='genre' value='광고'/>
                            <RiAdvertisementFill className='text-[40px]'/>
                            <span className='text-sm'>광고</span>
                          </label>
                          <label className={`flex flex-col items-center mx-3 my-2 py-2 px-3 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition ${sortData.genre.includes('방송') ? 'border border-zinc-500' : ''}`}>
                            <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                              className='hidden' type='checkbox' name='genre' value='방송'/>
                            <BsBroadcast className='text-[40px]'/>
                            <span className='text-sm'>방송</span>
                          </label>
                        </div>
                        <div className='flex justify-around'>
                          <label className={`flex flex-col items-center mx-3 my-2 py-2 px-3 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition ${sortData.genre.includes('뮤직비디오') ? 'border border-zinc-500' : ''}`}>
                            <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                              className='hidden' type='checkbox' name='genre' value='뮤직비디오'/>
                            <SiApplemusic className='text-[40px]'/>
                            <span className='text-sm'>뮤직비디오</span>
                          </label>
                          <label className={`flex flex-col items-center mx-3 my-2 py-2 px-3 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition ${sortData.genre.includes('유튜브') ? 'border border-zinc-500' : ''}`}>
                            <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                              className='hidden' type='checkbox' name='genre' value='유튜브'/>
                            <TfiYoutube className='text-[40px]'/>
                            <span className='text-sm'>유튜브</span>
                          </label>
                          <label className={`flex flex-col items-center mx-3 my-2 py-2 px-3 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition ${sortData.genre.includes('웹드라마') ? 'border border-zinc-500' : ''}`}>
                            <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                              className='hidden' type='checkbox' name='genre' value='웹드라마'/>
                            <SiWebtoon className='text-[40px]'/>
                            <span className='text-sm'>웹드라마</span>
                          </label>
                        </div>
                      </div>
                      <div className='flex flex-col mb-5'>
                        <label className='text-xl font-semibold mb-2'>모집 파트</label>
                        <div className='flex justify-around'>
                          <label className={`flex flex-col items-center mx-1 my-2 py-2 px-2 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition ${sortData.team.includes('연출팀') ? 'border border-zinc-500' : ''}`}>
                            <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                              className='hidden' type='checkbox' name='team' value='연출팀'/>
                            <BiSupport className='text-[35px]'/>
                            <span className='text-sm'>연출팀</span>
                          </label>
                          <label className={`flex flex-col items-center mx-1 my-2 py-2 px-2 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition ${sortData.team.includes('아트팀') ? 'border border-zinc-500' : ''}`}>
                            <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                              className='hidden' type='checkbox' name='team' value='아트팀'/>
                            <GiPalette className='text-[35px]'/>
                            <span className='text-sm'>아트팀</span>
                          </label>
                          <label className={`flex flex-col items-center mx-1 my-2 py-2 px-2 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition ${sortData.team.includes('조명팀') ? 'border border-zinc-500' : ''}`}>
                            <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                              className='hidden' type='checkbox' name='team' value='조명팀'/>
                            <IoMdFlashlight className='text-[35px]'/>
                            <span className='text-sm'>조명팀</span>
                          </label>
                          <label className={`flex flex-col items-center mx-1 my-2 py-2 px-2 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition ${sortData.team.includes('의상팀') ? 'border border-zinc-500' : ''}`}>
                            <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                              className='hidden' type='checkbox' name='team' value='의상팀'/>
                            <GiLargeDress className='text-[35px]'/>
                            <span className='text-sm'>의상팀</span>
                          </label>
                          <label className={`flex flex-col items-center mx-1 my-2 py-2 px-2 border border-transparent border-[2px] rounded-[30%] cursor-pointer hover:scale-[1.1] transition ${sortData.team.includes('보조출연') ? 'border border-zinc-500' : ''}`}>
                            <input onChange={(e) => onChangeHandler(e, e.target.name, e.target.value)}
                              className='hidden' type='checkbox' name='team' value='보조출연'/>
                            <BsPeopleFill className='text-[35px]'/>
                            <span className='text-sm'>보조출연</span>
                          </label>
                        </div>
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
  )
}