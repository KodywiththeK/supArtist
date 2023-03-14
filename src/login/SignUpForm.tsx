import '../App.css';
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRef } from 'react';
import { createUserWithEmailAndPassword, updateProfile, User, UserCredential } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import DefaultImage from '../images/DefaultProfile.jpeg'
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useMutation } from '@tanstack/react-query'
import useUserQuery from '../reactQuery/userQuery';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

interface dataType {
  email: string,
  name: string,
  // phone_number: string,
  password: string,
  password_confirm: string
}
interface SignUpFormPropsType {
  setForm: (boolean:boolean) => void
  setForgotPwd: (boolean: boolean) => void
}


export const defaultImage = async() => {
  return await getDownloadURL(ref(getStorage(), 'DefaultProfile.jpeg'))
}

const SignUpForm = (props:SignUpFormPropsType) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<dataType>();
  const navigate = useNavigate()
  

  //recoil
  // const [userData, setUserData] = useRecoilState(user)
  // const names = userData.map(i => i.name)

  //react-query
  const {isLoading:userLoading, data:userData} = useUserQuery()
  const names = userData?.map(i => ({...i})).map(i => i.name)

  // const { mutate } = useMutation(setUser)
  
  const onSubmit: SubmitHandler<dataType> = async(data) => {
    const image = await defaultImage();
    createUserWithEmailAndPassword(auth, data.email, data.password)
    .then(async(result) => {
      await updateProfile(auth.currentUser as User, {
        displayName: data.name,
        photoURL: image
      })
      console.log(result)
      return result
    })
    .then(async(result) => {
      await setDoc(doc(db, 'userInfo', String(result.user.uid)), {
        email: result.user.email,
        name: result.user.displayName,
        phone: '',
        pic: result.user.photoURL,
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
    })
    .then(async() => {
      // const userResult = await getUserData();
      // setUserData(userResult)
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
          <label className='text-black mt-3 mb-2'>이메일</label>
          <input className='w-full text-black py-2 px-4 bg-transparent border rounded-md border-black outline-none focus:outline-none'
            placeholder='abc@email.com'
            type='email' {...register("email", { required:true, pattern: /^\S+@\S+$/i })}/>
          {errors.email && errors.email.type === 'required' && <p className='text-red-500 text-sm'>⚠ 이메일은 필수 입력값입니다.</p>}
          {errors.email && errors.email.type === 'pattern' && <p className='text-red-500 text-sm'>⚠ 올바른 형식의 이메일을 입력해주세요.</p>}

          <label className='text-black mt-3 mb-2'>사용자 이름</label>
          <input 
            className='w-full text-black py-2 px-4 bg-transparent border rounded-md border-black outline-none focus:outline-none'
            placeholder='write under 20 letters'
            {...register("name", { 
              validate: (value) => !names?.includes(value),
              required: true, maxLength: 20 
              })} />
          {errors.name && errors.name.type === "required" && (<p className='text-red-500 text-sm'>⚠ 사용자 이름은 필수 입력값입니다.</p>)}
          {errors.name && errors.name.type === "maxLength" && (<p className='text-red-500 text-sm'>⚠ 20글자 이내로 입력해주세요.</p>)}
          {errors.name && errors.name.type === "validate" && (<p className='text-red-500 text-sm'>⚠ 해당 이름은 이미 사용중인 사용자가 있습니다.</p>)}

          {/* <label className='text-black mt-3 mb-2'>휴대폰 번호</label>
          <input className='w-full text-black py-2 px-4 bg-transparent border rounded-md border-black outline-none focus:outline-none'
            placeholder='"-"를 제외한 번호를 입력해주세요.'
            {...register("phone_number", { required: true, pattern: /^01([0|1|6|7|8|9])?([0-9]{7,8})$/ })} />
          {errors.phone_number && errors.phone_number.type === "required" && (<p className='text-red-500 text-sm'>⚠ 휴대폰 번호는 필수 입력값입니다.</p>)}
          {errors.phone_number && errors.phone_number.type === "pattern" && (<p className='text-red-500 text-sm'>⚠ 형식에 맞는 번호를 입력해주세요.</p>)}
           */}
          <label className='text-black mt-3 mb-2'>비밀번호</label>
          <input className='w-full text-black py-2 px-4 bg-transparent border rounded-md border-black outline-none focus:outline-none' 
            placeholder='최소 6글자 이상 입력해주세요'
            type='password' {...register("password", { required: true, minLength: 8 })} />
          {errors.password && errors.password.type === 'required' && <p className='text-red-500 text-sm'>⚠ 비밀번호는 필수 입력값입니다.</p>}
          {errors.password && errors.password.type === 'minLength' && <p className='text-red-500 text-sm'>⚠ 비밀번호는 최소 6자 이상 입력해주세요.</p>}

          <label className='text-black mt-3 mb-2'>비밀번호 확인</label>
          <input className='w-full text-black py-2 px-4 bg-transparent border rounded-md border-black outline-none focus:outline-none' 
            placeholder='한번 더 확인해주세요'
            type='password' {...register(
              "password_confirm", { 
                required: true, 
                validate: (value) => value === passwordRef.current
              }
            )} 
            />
          {errors.password_confirm && errors.password_confirm.type === 'required' && (<p className='text-red-500 text-sm'>⚠ 비밀번호 확인은 필수 항목입니다.</p>)}
          {errors.password_confirm && errors.password_confirm.type === 'validate' && (<p className='text-red-500 text-sm'>⚠ 입력값이 비밀번호와 다릅니다.</p>)}

          <input className='w-full text-base text-white bg-black rounded-md mt-10 mb-2 py-2 cursor-pointer'
            type="submit" value='회원가입하기'/>
        </form>        
      </div>
  </>
  );
}

export default SignUpForm;