import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut, sendEmailVerification } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { signInWithGoogle } from './googleLogin';
import ConfirmModal from '../common/ConfirmModal';
import AlertModal from '../common/AlertModal';
import { useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface loginType {
  email: string,
  password: string
}
interface setPwdType {
  email: string
}

interface LoginFormPropsType {
  setForm: (boolean:boolean) => void
  setForgotPwd: (boolean: boolean) => void
  isForgotPwd: boolean
}


const LoginForm = (props:LoginFormPropsType) => {

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<loginType>();

  // confirm modal control
  const [confirmModal, setConfirmModal] = useState(false)
  const getModalAnswer = (answer:boolean) => {
    if(answer) {
      props.setForm
    }
  }
  const confirmTitle = '로그인 오류'
  const [confirmDes, setConfirmDes] = useState('')
  const [confirmBtn, setConfirmBtn] = useState('')

  // Alert modal control
  const [alertModal, setAlertModal] = useState(false)
  const alertTitle = '알림'
  const [alertDes, setAlertDes] = useState('')

  const onSubmit: SubmitHandler<loginType> = async(data) => {
    try {
      // await signInWithEmailAndPassword(auth, data.email, data.password)
      // navigate('/')
      const userSignIn = await signInWithEmailAndPassword(auth, data.email, data.password)
      if(userSignIn.user.emailVerified) {
        navigate('/')
      } else {
        if(confirm('아직 이메일 인증이 완료되지 않았습니다. 혹시 메일을 받지 못하셨다면, 해당 이메일로 인증메일을 다시 보내드릴까요?')) {
          sendEmailVerification((userSignIn.user))
        }
        signOut(auth)
      }
    } catch (err) {
      setConfirmBtn('회원가입')
      setConfirmDes('로그인 정보가 없거나 올바르지 않습니다. 회원가입 하시겠습니까?')
      setConfirmModal(true)
    }
  }; 

  const resetPasswordRequest: SubmitHandler<setPwdType> = (data) => {
    sendPasswordResetEmail(auth, data.email)
      .then(() => {
        setAlertDes('비밀번호 재설정 이메일이 발송되었습니다. 해당 메일함을 확인하세요.')
        setAlertModal(true)
        props.setForgotPwd(true)
      })
      .catch(e => {
        if (e.code === 'auth/user-not-found') {
          setAlertDes('해당 이메일로 가입된 사용자를 찾을 수 없습니다.');
          setAlertModal(true)
        } else {
          setAlertDes('요청에 문제가 생겼습니다. 잠시 후 다시 시도하세요.');
          setAlertModal(true)
        }
      })
  }

  const handleGoogleLogin = async() => {
    await signInWithGoogle()
    const res = await getDoc(doc(db, 'userInfo', auth.currentUser?.uid as string))  
    if(!res.exists()) {
      await setDoc(doc(db, 'userInfo', String(auth.currentUser?.uid)), {
        email: auth.currentUser?.email as string,
        name: auth.currentUser?.displayName as string,
        phone: auth.currentUser?.phoneNumber as string,
        pic: auth.currentUser?.photoURL as string,
        intro: '프로필 설정에 들어가서 프로필을 작성해보세요!',
        gender: '',
        bday: '',
        interest: [],
        team: [],
        experience: ['완성도 높은 프로필을 작성할수록 합격률이 올라갑니다 :)'],
        heart: [],
        apply: [],
        followers: [],
        following: []
      })
    }
    navigate('/')
  }


  return (
    <>
      <ConfirmModal confirmModal={confirmModal} setConfirmModal={setConfirmModal} getModalAnswer={getModalAnswer} title={confirmTitle} des={confirmDes} confirmBtn={confirmBtn}/>
      <AlertModal alertModal={alertModal} setAlertModal={setAlertModal} title={alertTitle} des={alertDes}/>
      <div className='w-full max-w-sm flex flex-col items-center'>
        <div className='w-full flex flex-col mb-10'>
          <h3 className='text-3xl font-semibold mb-4'>{props.isForgotPwd ? '로그인' : '비밀번호 재설정'}</h3>
          <div className='text-base mb-2'>{props.isForgotPwd ? '회원정보를 입력해주세요.' : '비밀번호 재설정을 위해, 가입하셨던 이메일을 입력해주세요.'}</div>
        </div>

        <form className='w-full flex flex-col'
          onSubmit={props.isForgotPwd ? handleSubmit(onSubmit) : handleSubmit(resetPasswordRequest) }
          >
          <label className='text-black mt-5 mb-2'>이메일</label>
          <input className='w-full text-black py-2 px-4 bg-transparent border rounded-md border-black outline-none focus:outline-none'
            type='email' placeholder='abc@email.com'{...register("email", { required:true, pattern: /^\S+@\S+$/i })}/>
          {errors.email && errors.email.type === 'required' && <p className='text-red-500 text-sm'>⚠ 이메일을 입력해주세요</p>}
          {errors.email && errors.email.type === 'pattern' && <p className='text-red-500 text-sm'>⚠ 올바른 형식의 이메일을 입력해주세요</p>}
          {props.isForgotPwd && <>
          
          <label className='text-black mt-3 mb-2'>비밀번호</label>
          <input className='w-full text-black py-2 px-4 bg-transparent border rounded-md border-black outline-none focus:outline-none'
            type='password' placeholder='********' {...register("password", { required: true, minLength: 8 })} />
          {errors.password && errors.password.type === 'required' && <p className='text-red-500 text-sm'>⚠ 비밀번호를 입력해주세요</p>}
          {errors.password && errors.password.type === 'minLength' && <p className='text-red-500 text-sm'>⚠ 비밀번호는 최소 6글자입니다</p>}
          </>}
          <p className='text-right text-sm text-gray-500 hover:underline cursor-pointer' 
            onClick={() => {props.setForgotPwd(!props.isForgotPwd)}}>
              {props.isForgotPwd ? '비밀번호를 잊어버렸나요?' : '로그인페이지로 돌아가기'}
            </p>
          <input className='w-full text-base text-white bg-black rounded-md mt-6 mb-2 py-3 cursor-pointer'
            type="submit" value={props.isForgotPwd ? '로그인' : '인증메일 보내기'}/>
        </form>
        {props.isForgotPwd && <button className='w-full flex justify-center items-center text-base text-black bg-white border border-black rounded-md mb-2 py-3 cursor-pointer'
          onClick={handleGoogleLogin} 
          ><FcGoogle className='text-xl mr-1'/>구글 계정으로 로그인</button>}
      </div>
    </>
  )
}

export default LoginForm;