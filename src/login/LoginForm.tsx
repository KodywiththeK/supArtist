import { signInWithEmailAndPassword, sendPasswordResetEmail, AuthProvider, GoogleAuthProvider, UserCredential, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from "firebase/firestore";
import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';

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
  const provider = new GoogleAuthProvider();
  const SignInWithSocialMedia = (provider:AuthProvider) => {
    new Promise<UserCredential>((resolve, reject) => {
      signInWithPopup(auth, provider)
        .then(result => {resolve(result)})
        .then(() => alert('로그인 되었습니다.'))
        .then(() => navigate('/'))
        .catch(error => reject(error))
    })
  }
  // const docRef = doc(db, 'userInfo', )

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
          <label className='text-black mt-5 mb-2'>Email</label>
          <input className='w-full text-black py-2 px-4 bg-transparent border rounded-md border-black outline-none focus:outline-none'
            type='email' placeholder='abc@email.com'{...register("email", { required:true, pattern: /^\S+@\S+$/i })}/>
          {errors.email && errors.email.type === 'required' && <p className='text-red-500 text-sm'>⚠ This email field is required</p>}
          {errors.email && errors.email.type === 'pattern' && <p className='text-red-500 text-sm'>⚠ Write the right pattern</p>}
          {props.isForgotPwd && <>
          
          <label className='text-black mt-3 mb-2'>Password</label>
          <input className='w-full text-black py-2 px-4 bg-transparent border rounded-md border-black outline-none focus:outline-none'
            type='password' placeholder='more than 6 characters' {...register("password", { required: true, minLength: 8 })} />
          {errors.password && errors.password.type === 'required' && <p className='text-red-500 text-sm'>⚠ This field is required</p>}
          {errors.password && errors.password.type === 'minLength' && <p className='text-red-500 text-sm'>⚠ Password must have at least 6 characters</p>}
          </>}
          <p className='text-right text-sm text-gray-500 hover:underline cursor-pointer' 
            onClick={() => {props.setForgotPwd(!props.isForgotPwd)}}>
              {props.isForgotPwd ? 'Forgot password?' : 'Back to Login page'}
            </p>
          <input className='w-full text-sm text-white bg-black rounded-md mt-6 mb-2 py-3 cursor-pointer'
            type="submit" value={props.isForgotPwd ? 'Log In' : 'Send Email'}/>
        </form>
        {props.isForgotPwd && <button className='w-full flex justify-center items-center text-sm text-black bg-white border border-black rounded-md mb-2 py-3 cursor-pointer'
          onClick={() => SignInWithSocialMedia(provider)} 
          ><FcGoogle className='text-xl mr-1'/>Log in with Google</button>}
        
      </div>
    </>
  )
}

export default LoginForm;