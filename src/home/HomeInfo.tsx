import React, { MutableRefObject, useEffect, useRef } from 'react'
import gsap from 'gsap'
import subject from '../images/Subject.png'
import subject2 from '../images/Subject2.png'
import _ from "lodash"
import { useMediaQuery } from 'react-responsive'

export default function HomeInfo() {

  
  let boxRef:MutableRefObject<null>[] = []
  boxRef[0] = useRef(null)
  boxRef[1] = useRef(null)
  boxRef[2] = useRef(null)
  boxRef[3] = useRef(null)
  useEffect(() => {
    const scroll = _.throttle(
        function() {
          console.log(window.scrollY);
          if (window.scrollY > 410) {
            gsap.to(boxRef[0].current, 0.6, {
              opacity: 1,
              x:0
            }); 
            gsap.to(boxRef[2].current, 0.6, {
              opacity: 1,
              x:0
            }); 
          } else {
            gsap.to(boxRef[0].current, 0.2, {
              x:-100,
              opacity: 0,
            });
            gsap.to(boxRef[2].current, 0.2, {
              x:100,
              opacity: 0,
            });
          }
          if (window.scrollY > 1450) {
            gsap.to(boxRef[1].current, 0.6, {
              opacity: 1,
              x:0
            }); 
            gsap.to(boxRef[3].current, 0.6, {
              opacity: 1,
              x:0
            }); 
          } else {
            gsap.to(boxRef[1].current, 0.2, {
              x:100,
              opacity: 0,
            });
            gsap.to(boxRef[3].current, 0.2, {
              x:-100,
              opacity: 0,
            });
          }
    
        }, 300
    )
    window.addEventListener('scroll', scroll );
    return () => {
      window.removeEventListener('scroll', scroll )
    }
  },[])
  const isDefault: boolean = useMediaQuery({
    query: "(min-width:768px)",
  });

  return (<>
    <div className={`${isDefault ? '' : 'items-center flex-col py-5' }w-full h-screen relative flex items-center bg-[#edf1d6] justify-around`}> 
      <img ref={boxRef[0]} src={subject} alt='subject' className={`${isDefault ? 'h-[70vh]' : 'h-[50vh] mt-20' } ml-10 drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)]`}/>
      <div ref={boxRef[2]} className={`${isDefault ? "ml-10 mr-[5%]" : 'mx-5 h-[50vh] w-[80vw]'} flex flex-col`}>
        <h1 style={{textShadow: '1px 1px 2px gray'}} 
          className={`text-shadow ${isDefault? 'text-6xl' : 'text-4xl'} text-[#41523c] font-bold my-5 border-none break-keep`}>
          자유롭게 정하는 스케쥴
        </h1>
        {/* <img src={logo} alt='main-logo' className='ml-16' /> */}
        <div style={{textShadow: '1px 1px 2px gray'}} 
          className={`text-ow ${isDefault? 'text-3xl' : 'text-2xl'} leading-relaxed my-3 text-[#41523c] font-normal break-keep`}>
          촬영 공고를 기다리고 있나요? <br />
          원하는 날짜에 클릭 한번으로 <br />
          지원할 수 있어요!
        </div>
      </div>
    </div>
    <div className={`${isDefault ? '' : 'items-center flex-col-reverse py-5' } w-full h-screen relative flex items-center bg-[#41523c] justify-around`}>
      <div ref={boxRef[3]} className={`${isDefault ? 'ml-10 mr-[5%]' : 'mx-5 h-[50vh] w-[80vw]'} flex flex-col`}>
        <h1 style={{textShadow: '1px 1px 2px gray'}} 
          className={`text-shadow ${isDefault? 'text-6xl' : 'text-4xl'} text-[#edf1d6] font-bold my-5 border-none break-keep`}>
          촬영 정보를 한눈에!
        </h1>
        {/* <img src={logo} alt='main-logo' className='ml-16' /> */}
        <div style={{textShadow: '1px 1px 2px gray'}} 
          className={`text-ow ${isDefault ? 'text-3xl' : 'text-2xl'} leading-relaxed my-3 text-[#edf1d6] font-normal break-keep`}>
          촬영 날짜, 장소, 제작사 등 <br />
          촬영에 대한 정보를 <br />
          미리 확인하고 지원할 수 있어요!
        </div>
      </div>
      <img ref={boxRef[1]} src={subject2} alt='subject2' className={`${isDefault ? 'h-[70vh] mr-10' : 'h-[50vh] mt-20' } rotate-[20deg] drop-shadow-[0_25px_25px_rgba(200,200,200,0.25)]`}/>
    </div>
  </>
  )
}
