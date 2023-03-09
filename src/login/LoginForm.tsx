import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { signInWithGoogle } from './googleLogin';

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
  const onSubmit: SubmitHandler<loginType> = (data) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        alert('로그인 되었습니다.')
      })
      .then(() => {
        navigate('/')
      })
      .catch(() => {
        confirm('로그인 정보가 없거나 올바르지 않습니다. 회원가입 하시겠습니까?')
          && props.setForm(false)
      })
  }; 
  const resetPasswordRequest: SubmitHandler<setPwdType> = (data) => {
    sendPasswordResetEmail(auth, data.email)
      .then(() => {
        alert('비밀번호 재설정 이메일이 발송되었습니다. 해당 메일함을 확인하세요.')
        props.setForgotPwd(true)
      })
      .catch(e => {
        if (e.code === 'auth/user-not-found') {
          alert('User not found');
        } else {
          alert('There was a problem with your request');
        }
      })
  }

  const handleGoogleLogin = async() => {
    await signInWithGoogle()
    .then(() => alert('로그인 되었습니다.'))
    .then(() => navigate('/'))
  }


  return (
    <>
      <div className='w-full max-w-sm flex flex-col items-center'>
        <div className='w-full flex flex-col mb-10'>
          <h3 className='text-3xl font-semibold mb-4'>{props.isForgotPwd ? 'Login' : 'Password Reset'}</h3>
          <div className='text-base mb-2'>{props.isForgotPwd ? 'Welcome! Please enter your details.' : 'Write your Email to reset the password'}</div>
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