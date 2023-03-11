import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { ProjectType } from '../reactQuery/RecruitmentQuery'


interface PaginationPropsType {
  resultData: ProjectType[] | undefined,
  postsPerPage: number,
  curPage: number,
  setCurPage: (num:number) => void,
  first: number,
  last: number
}

export default function Pagination({resultData, postsPerPage, curPage, setCurPage, first, last}: PaginationPropsType) {

  const [pageNum, setPageNum] = useState('1')
  const handlePageNum = (e:React.ChangeEvent<HTMLInputElement>) => {
    setPageNum(e.target.value)
    setCurPage(Number(e.target.value))
  }
  // console.log(resultData!.length)

  return (
    <div className="flex items-center justify-center border-t border-gray-200 bg-zinc-200 px-4 py-3 mt-10 sm:px-6">
      <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-base text-gray-700">
            {'총 '}<span className="font-medium">{resultData?.length}</span>{' 개의 결과 중, '}
            <span className="font-medium">{first+1}</span>{' -'} <span className="font-medium">{resultData && last>resultData?.length ? resultData?.length : last }</span> {'번'}
          </p>
        </div>
        <div className='flex justify-center mt-3'>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button onClick={() => {
              if(Number(pageNum) > 1) {
                setPageNum(String(Number(pageNum)-1))
                setCurPage(curPage-1)
              }
            }}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {resultData && new Array(Number(Math.ceil(resultData?.length / postsPerPage))).fill(0).map((_,index) => (
            <label 
              key={index}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${pageNum===String(index+1) ? `z-10 bg-zinc-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600` : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:outline-offset-0'}`}>
              <input onChange={handlePageNum}
                checked={pageNum===String(index+1)}
                type='radio' name='page' value={index+1} className='hidden' />
              <span>{index+1}</span>
            </label>
            ))}
            
            {/* <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
              ...
            </span> */}

            <button onClick={() => {
              if(resultData && Number(pageNum) < Math.ceil(resultData?.length / postsPerPage)) {
                setPageNum(String(Number(pageNum)+1))
                setCurPage(curPage+1)
              }
            }}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
