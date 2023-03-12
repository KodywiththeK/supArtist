import React, { useContext, useState } from 'react'
import homeVideo from '../images/filmVideo.mp4'
import cover from '../images/videoCover.png'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../store/AuthContext'


export default function HomeVisual() {

  const navigate = useNavigate()
  const userInfo = useContext(AuthContext)

  return (
    <div className={`w-full h-screen top-0 transition-all overflow-hidden flex items-end bg-white relative`}>
      <video muted autoPlay loop className="w-full h-screen object-cover absolute">
        <source src={homeVideo} type="video/mp4" />
      </video>
      <img src={cover} className='w-full h-[860px] mb-[55px] bg-[#41523c] opacity-40' />
      <div className='absolute top-[25%] left-[10%] mr-[5%] flex flex-col'>
        <h1 style={{textShadow: '1px 1px 2px gray'}} 
          className='text-shadow text-6xl text-white font-bold my-8 border-none'>
          영상 스태프는 <br /> Sup-Artist
        </h1>
        <div style={{textShadow: '1px 1px 2px gray'}} 
          className='text-ow text-3xl leading-relaxed my-3 text-white font-normal'>
          당신이 선택한 작품의 제작과정을 함께하며, <br />
          그 현장의 열정을 직접 경험해보세요!
        </div>
        <button onClick={() => {
          if(userInfo === null) {
            confirm('먼저 로그인하셔야 합니다. 로그인하시겠습니까?') && navigate('/login')
          } else navigate('/recruitment')
        }}
          className='btn btn--white border-white text-2xl w-[250px] mt-5' tabIndex={0}>스태프 지원하러 가기</button>
      </div>
    </div>
  )
}
