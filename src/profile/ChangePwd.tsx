import '../App.css';
import { useForm, SubmitHandler } from 'react-hook-form'
import React, { FC, useRef, useState } from 'react';
import { reauthenticateWithCredential, EmailAuthProvider, User, updatePassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useMediaQuery } from 'react-responsive';
import AlertModal from '../common/AlertModal';

interface dataType {
  email: string,
  name: string,
  password: string,
  password_confirm: string
}

const ChangePwd = () => {

  const { register, handleSubmit, watch, formState: { errors }, setValue  } = useForm<dataType>();
  
  const user = auth.currentUser;

  // Alert modal control
  const [alertModal, setAlertModal] = useState(false)
  const alertTitle = '비밀번호 변경'
  const [alertDes, setAlertDes] = useState('')

  const onSubmit: SubmitHandler<dataType> = (data) => {
    console.log(data)
    updatePassword(user as User, data.password)
      .then(() => {
        setAlertDes('비밀번호가 변경되었습니다')
        setAlertModal(true)
        setPwd('')
        setInputState(true)
        setValue('password_confirm', '')
        setValue('password', '')
      })
      .catch(e => {
        alert(e)
      })
  };
  const [inputState, setInputState] = useState(true)
  const [pwd, setPwd] = useState('')
  const onChangeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
    setPwd(e.target.value)
  } 
  
  const credential = EmailAuthProvider.credential(
    user?.email as string, pwd
  )
  const checkOldPwd = () => {
    reauthenticateWithCredential(user as User, credential)
      .then(result => {
        console.log(result)
        setAlertDes('비밀번호가 확인되었습니다. 변경하실 새로운 비밀번호를 입력해주세요.')
        setAlertModal(true)
        setInputState(false)
      })
      .catch((e) => {
        console.log(e)
        setInputState(true)
        setAlertDes('잘못된 비밀번호입니다. 다시 입력해주세요.')
        setAlertModal(true)
        setPwd('')
      })
  }
  

  const passwordRef = useRef<string | null>(null)
  passwordRef.current = watch("password")
  const isDefault: boolean = useMediaQuery({
    query: "(min-width:768px)",
  });

  return (<>
    <AlertModal alertModal={alertModal} setAlertModal={setAlertModal} title={alertTitle} des={alertDes}/>
    <label className='text-black mt-6 mb-2 text-lg font-semibold'>비밀번호 변경</label>
    <div className='flex w-full'>
      <input className={`${isDefault ? 'w-[70%]' : 'w-full'} max-w-[400px] text-black py-2 px-4 bg-gray-100 border rounded-md border-black outline-none focus:outline-none`}
        placeholder='기존 비밀번호를 입력해주세요'
        type='password' onChange={onChangeHandler} value={pwd} />
      <button className='btn border border-black ml-5 text-sm'
        onClick={checkOldPwd}>비밀번호 확인</button>
    </div>
    <form className='w-full flex flex-col justify-center'
      onSubmit={handleSubmit(onSubmit)}
      >  
      {!inputState && <>
      <label  className='text-black mt-3 mb-2'>새 비밀번호</label>
      <input className={`${isDefault ? 'w-[70%]' : 'w-full'} max-w-[400px] text-black py-2 px-4 bg-gray-100 border rounded-md border-black outline-none focus:outline-none`}
        placeholder='8글자 이상 입력하세요.'
        type='password' {...register("password", { required: true, minLength: 8 })} />
      {(errors.password && errors.password.type === 'required' && !inputState) && <p className='text-red-500 text-sm'>⚠ 이 항목은 필수입니다.</p>}
      {errors.password && errors.password.type === 'minLength' && <p className='text-red-500 text-sm'>⚠ 최소한 8글자 이상 입력하세요</p>}
      <label className='text-black mt-3 mb-2'>새 비밀번호 확인</label>
      <div className='flex w-full'>
        <input className={`${isDefault ? 'w-[70%]' : 'w-full'} max-w-[400px] text-black py-2 px-4 bg-gray-100 border rounded-md border-black outline-none focus:outline-none`}
          placeholder='다시 한 번 입력하세요.'
          type='password' {...register(
            "password_confirm", { 
              required: true, 
              validate: (value) => value === passwordRef.current
            }
          )} 
          />
        <input className='btn btn--reverse border border-black ml-5 text-sm'
          type="submit" value='비밀번호 변경'/>
      </div>
      {(errors.password_confirm && errors.password_confirm.type === 'required' && !inputState) && (<p className='text-red-500 text-sm'>⚠ 이 항목은 필수입니다.</p>)}
      {errors.password_confirm && errors.password_confirm.type === 'validate' && (<p className='text-red-500 text-sm'>⚠ 입력값이 다릅니다.</p>)}
      </>}
    </form>
  </>);
}

export default ChangePwd;