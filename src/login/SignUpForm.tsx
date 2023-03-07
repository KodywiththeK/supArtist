import '../App.css';
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRef } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import DefaultImage from '../images/DefaultProfile.jpeg'
import { useNavigate } from 'react-router-dom';

interface dataType {
  email: string,
  name: string,
  phone_number: string,
  password: string,
  password_confirm: string
}
interface SignUpFormPropsType {
  setForm: (boolean:boolean) => void
  setForgotPwd: (boolean: boolean) => void
}

const SignUpForm = (props:SignUpFormPropsType) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<dataType>();
  const navigate = useNavigate()
  const onSubmit: SubmitHandler<dataType> = (data) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
    .then((result) => {
      updateProfile(result.user, {
        displayName: data.name
      })
      return result
    })
    .then((result) => {
      setDoc(doc(db, 'userInfo', String(result.user.uid)), {
        email: result.user.email,
        name: result.user.displayName,
        phone: result.user.phoneNumber,
        pic: DefaultImage,
        intro: '',
        gender: '',
        bday: '',
        interest: [],
        team: [],
        experience: [],
        heart: [],
        apply: []
      })
    })
    .then(() => {
      alert('회원가입 성공')
      navigate('/')
      props.setForm(true)
    })
    .catch(e => {
      if(String(e).includes('email-already-in-use')) {
        if(confirm('You have already signed up here. Do you want to find your password?')) {
          props.setForm(true)
          props.setForgotPwd(false)
        }
      } else alert(`!!!${e}`)
    })
  }; 

  const passwordRef = useRef<string | null>(null)
  passwordRef.current = watch("password")


  return (<>

      <div className='w-full max-w-sm flex flex-col'>
        <div className='w-full flex flex-col mb-10'>
          <h3 className='text-3xl font-semibold mb-4'>Register</h3>
          <div className='text-base mb-2'>{'Welcome! please fill the form below.'}</div>
        </div>

        <form className='w-full flex flex-col'
          onSubmit={handleSubmit(onSubmit)}
          >
          <label className='text-black mt-3 mb-2'>Email</label>
          <input className='w-full text-black py-2 px-4 bg-transparent border rounded-md border-black outline-none focus:outline-none'
            placeholder='abc@email.com'
            type='email' {...register("email", { required:true, pattern: /^\S+@\S+$/i })}/>
          {errors.email && errors.email.type === 'required' && <p className='text-red-500 text-sm'>⚠ This email field is required</p>}
          {errors.email && errors.email.type === 'pattern' && <p className='text-red-500 text-sm'>⚠ Write email in right form</p>}

          <label className='text-black mt-3 mb-2'>User Name</label>
          <input className='w-full text-black py-2 px-4 bg-transparent border rounded-md border-black outline-none focus:outline-none'
            placeholder='write under 20 letters'
            {...register("name", { required: true, maxLength: 20 })} />
          {errors.name && errors.name.type === "required" && (<p className='text-red-500 text-sm'>⚠ This name field is required</p>)}
          {errors.name && errors.name.type === "maxLength" && (<p className='text-red-500 text-sm'>⚠ Name cannot be more than 20 letters</p>)}

          <label className='text-black mt-3 mb-2'>Phone Number</label>
          <input className='w-full text-black py-2 px-4 bg-transparent border rounded-md border-black outline-none focus:outline-none'
            placeholder='"-"를 제외한 번호를 입력해주세요.'
            {...register("phone_number", { required: true, pattern: /^01([0|1|6|7|8|9])?([0-9]{7,8})$/ })} />
          {errors.phone_number && errors.phone_number.type === "required" && (<p className='text-red-500 text-sm'>⚠ This name field is required</p>)}
          {errors.phone_number && errors.phone_number.type === "pattern" && (<p className='text-red-500 text-sm'>⚠ 형식에 맞는 번호를 입력해주세요.</p>)}
          
          <label className='text-black mt-3 mb-2'>Password</label>
          <input className='w-full text-black py-2 px-4 bg-transparent border rounded-md border-black outline-none focus:outline-none' 
            placeholder='more than 6 characters'
            type='password' {...register("password", { required: true, minLength: 8 })} />
          {errors.password && errors.password.type === 'required' && <p className='text-red-500 text-sm'>⚠ This password field is required</p>}
          {errors.password && errors.password.type === 'minLength' && <p className='text-red-500 text-sm'>⚠ Password must have at least 6 characters</p>}

          <label className='text-black mt-3 mb-2'>Password Confirm</label>
          <input className='w-full text-black py-2 px-4 bg-transparent border rounded-md border-black outline-none focus:outline-none' 
            placeholder='confirm your password'
            type='password' {...register(
              "password_confirm", { 
                required: true, 
                validate: (value) => value === passwordRef.current
              }
            )} 
            />
          {errors.password_confirm && errors.password_confirm.type === 'required' && (<p className='text-red-500 text-sm'>⚠ This confirm field is required</p>)}
          {errors.password_confirm && errors.password_confirm.type === 'validate' && (<p className='text-red-500 text-sm'>⚠ The password does not match</p>)}

          <input className='w-full text-base text-white bg-black rounded-md mt-10 mb-2 py-2 cursor-pointer'
            type="submit" value='Sign Up'/>
        </form>        
      </div>
  </>
  );
}

export default SignUpForm;