import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import filmImage from '../images/filmImage.jpeg'
import { Default, Mobile } from '../mediaQuery'
import logo from '../images/MainLogo.png'

const LoginPage = () => {

  const [form, setForm] = useState(true)
  const [forgotPwd, setForgotPwd] = useState(true)
  const onClickHandler = (boolean:boolean) => {
    setForm(boolean)
  }
  const isForgotPwd = (boolean: boolean) => {
    setForgotPwd(boolean)
  }

  return (<>
    <div className='relative z-30 w-full h-screen mb-[-350px] flex items-start'>
      <Default><>
        <div className='relative w-1/2 h-full flex flex-col'>
          <div className='absolute top-[25%] left-[10%] mr-[5%] flex flex-col'>
            <h1 style={{textShadow: '1px 1px 2px gray'}} 
              className='text-shadow text-4xl text-white font-bold my-4 border-none'>Turn your idea into Reality</h1>
            <div style={{textShadow: '1px 1px 2px gray'}} 
              className='text-ow text-xl text-white font-normal'>Prepare your work with Sup-Artist</div>
          </div>
          <img src={filmImage} alt='mainImage' className="w-full h-screen object-cover" />
        </div>
      <div className='w-1/2 h-full bg-[#f5f5f5] flex flex-col p-20 items-center justify-between z-10'>
        <div className='w-full text-black font-semibold border-none'>
          <img src={logo} alt='logo' className='h-20' />
        </div>
        {form 
          ? <LoginForm setForm={onClickHandler} setForgotPwd={isForgotPwd} isForgotPwd={forgotPwd}/> 
          : <SignUpForm setForm={onClickHandler} setForgotPwd={isForgotPwd}/>
        }
        <div className='w-full flex justify-center items-center'>
          {form 
            ? <div className='text-sm font-normal text-black'>아직 계정이 없다면? 
                <span onClick={() => onClickHandler(!form)} 
                  className='font-semibold underline underline-offset-2 cursor-pointer ml-2'>
                    회원가입하기
                </span>
              </div>
            : <span onClick={() => onClickHandler(!form)} 
            className='font-semibold underline underline-offset-2 cursor-pointer'>
                로그인 페이지로 돌아가기
              </span>
            }
        </div>
      </div></>
      </Default>
      <Mobile><>
      <img src={filmImage} alt='mainImage' className="absolute w-full h-screen object-cover" />
      <div style={{backgroundColor: 'rgba(255,255,255,0.3'}}
        className='z-10 w-full h-screen flex flex-col p-20 items-center justify-between'>
        {/* <h1 className='w-full text-xl text-black font-semibold border-none'>Sup-Artist</h1> */}
        <div className='w-full text-black font-semibold border-none'>
          <img src={logo} alt='logo' className='h-20' />
        </div>
        <div className='w-full max-w-sm flex flex-col items-center p-10 bg-[#f5f5f5]/[0.8] rounded-lg box-content'>
          {form 
            ? <LoginForm setForm={onClickHandler} setForgotPwd={isForgotPwd} isForgotPwd={forgotPwd}/> 
            : <SignUpForm setForm={onClickHandler} setForgotPwd={isForgotPwd}/>
          }
        </div>
        <div className='w-full flex justify-center items-center'>
          {form 
            ? <div className='text-sm font-normal text-black'>계정이 없다면? 
                <span onClick={() => onClickHandler(!form)} 
                  className='font-semibold underline underline-offset-2 cursor-pointer ml-2'>
                    회원가입하기
                </span>
              </div>
            : <span onClick={() => onClickHandler(!form)} 
            className='font-semibold underline underline-offset-2 cursor-pointer'>
                로그인 페이지로 돌아가기
              </span>
            }
        </div>
      </div></>
      </Mobile>
    </div>
  </>
  )
}

export default LoginPage;
