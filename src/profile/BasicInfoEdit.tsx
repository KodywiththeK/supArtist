import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMediaQuery } from 'react-responsive'
import ChangePwd from './ChangePwd'
import { AuthContext } from '../store/AuthContext'



export default function BasicInfoEdit() {
  const isDefault: boolean = useMediaQuery({
    query: "(min-width:768px)",
  });
  const userInfo = useContext(AuthContext)
  const isGoogle = userInfo?.providerData[0].providerId === 'google.com' ? false : true;
  const { register, formState: { errors } } = useForm();
  const [emailChange, setEmailChange] = useState(false)
  const [userNameChange, setUserNameChange] = useState(false)
  const [phoneChange, setPhoneChange] = useState(false)


  return (<>
    <h2 className='mt-10 text-2xl font-bold'>기본 정보</h2>
    <div className='w-full flex flex-col mt-5'>
        <label className='text-black mt-6 mb-2 text-lg font-semibold'>이메일</label>
        <div className='flex w-full'>
          <input className={`${isDefault ? 'w-[70%]' : 'w-full'} max-w-[400px] text-black py-2 px-4 bg-gray-300 border rounded-md border-black`}
            placeholder={userInfo?.email as string}
            disabled={true}/>
          {isGoogle && <button onClick={(e) => {
            e.preventDefault();
            setEmailChange(!emailChange)}}
            className='btn border border-black ml-5 text-sm'>{emailChange ? '취소' : '변경'}</button>}
        </div>
        {emailChange && <>
        <form className='w-full flex items-center mt-4'>
        <input className={`${isDefault ? 'w-[70%]' : 'w-full'} max-w-[400px] text-black py-2 px-4 bg-gray-100 border rounded-md border-black`}
            placeholder='새로운 이메일 주소를 입력해주세요.'
            type='email' {...register("email", { required:true, pattern: /^\S+@\S+$/i })}/> 
            {errors.email && errors.email.type === 'required' && <p className='text-red-500 text-sm'>⚠ This email field is required</p>}
            {errors.email && errors.email.type === 'pattern' && <p className='text-red-500 text-sm'>⚠ Write email in right form</p>}
          <input 
            type='submit' value='인증메일 전송' className='btn btn--reverse border border-black ml-5 text-sm' />
        </form>
          </>}

      <label className='text-black mt-6 mb-2 text-lg font-semibold'>사용자 이름</label>
      <div className='flex w-full'>
          <input className={`${isDefault ? 'w-[70%]' : 'w-full'} max-w-[400px] text-black py-2 px-4 bg-gray-300 border rounded-md border-black`}
            placeholder={userInfo?.providerData[0].displayName as string}
            disabled={true}/>
          <button onClick={(e) => {
            e.preventDefault();
            setUserNameChange(!userNameChange)}}
            className='btn border border-black ml-5 text-sm'>{userNameChange ? '취소' : '변경'}
          </button>
      </div>
      {userNameChange && <>
      <form className='w-full flex items-center mt-4'>
        <input className={`${isDefault ? 'w-[70%]' : 'w-full'} max-w-[400px] text-black py-2 px-4 bg-gray-100 border rounded-md border-black outline-none focus:outline-none`}
        placeholder='20글자 이내로 입력해주세요.'
        {...register("name", { required: true, maxLength: 20 })} />
        {errors.name && errors.name.type === "required" && (<p className='text-red-500 text-sm'>⚠ This name field is required</p>)}
        {errors.name && errors.name.type === "maxLength" && (<p className='text-red-500 text-sm'>⚠ Name cannot be more than 20 letters</p>)}
        <input 
          type='submit' value='중복확인' className='btn btn--reverse border border-black ml-5 text-sm' />
      </form>
      </>}

      <label className='text-black mt-6 mb-2 text-lg font-semibold'>휴대전화</label>
      <div className='flex w-full'>
          <input className={`${isDefault ? 'w-[70%]' : 'w-full'} max-w-[400px] text-black py-2 px-4 bg-gray-300 border rounded-md border-black`}
            placeholder='010-0000-0000'
            disabled={true}/>
          <button onClick={(e) => {
            e.preventDefault();
            setPhoneChange(!phoneChange)}}
            className='btn border border-black ml-5 text-sm'>{phoneChange ? '취소' : '변경'}
          </button>
      </div>
      {phoneChange && <>
      <form className='w-full flex items-center mt-4'>
        <input className={`${isDefault ? 'w-[70%]' : 'w-full'} max-w-[400px] text-black py-2 px-4 bg-gray-100 border rounded-md border-black outline-none focus:outline-none`}
        placeholder='변경할 휴대폰 번호를 입력해주세요.'
        {...register("name", { required: true, maxLength: 20 })} />
        {errors.name && errors.name.type === "required" && (<p className='text-red-500 text-sm'>⚠ This name field is required</p>)}
        {errors.name && errors.name.type === "maxLength" && (<p className='text-red-500 text-sm'>⚠ Name cannot be more than 20 letters</p>)}
        <input 
          type='submit' value='인증번호 전송' className='btn btn--reverse border border-black ml-5 text-sm' />
      </form>
      </>}
      {isGoogle && <ChangePwd />}
    </div>
    <div className='w-full max-w-[750px] border border-transparent border-b-gray-400 mt-20'></div>
  </>

  )
}
