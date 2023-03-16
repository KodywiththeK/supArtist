import '../App.css';
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRef, useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, User, UserCredential, sendEmailVerification, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import DefaultImage from '../images/DefaultProfile.jpeg'
import { useNavigate } from 'react-router-dom';
import useUserQuery from '../reactQuery/userQuery';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import AlertModal from '../common/AlertModal';
import ConfirmModal from '../common/ConfirmModal';

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

  
  // Alert modal control
  const [alertModal, setAlertModal] = useState(false)
  const alertTitle = '인증메일 전송'
  const [alertDes, setAlertDes] = useState('')


  // confirm modal control
  const [confirmModal, setConfirmModal] = useState(false)
  const getModalAnswer = (answer:boolean) => {
    console.log(answer)
    if(answer) {
      props.setForm(true)
      props.setForgotPwd(false)
    }
  }
  const confirmTitle = '회원가입 오류'
  const confirmDes = '이미 가입되어있는 메일입니다. 비밀번호를 잊으셨다면, 비밀번호 찾기로 이동시겠습니까?'
  const confirmBtn = '비밀번호 찾기'
  
  //회원가입 handler
  const onSubmit: SubmitHandler<dataType> = async(data) => {
    try {
      const image = await defaultImage();
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password)
      await sendEmailVerification(result.user)
      .then(() => {
        alert('해당 메일로 인증메일이 발송되었습니다. 메일 인증을 완료하신 후, 로그인이 가능합니다.')
      }).catch((e) => {
        console.log(e)
      })

      await updateProfile(auth.currentUser as User, {
        displayName: data.name,
        photoURL: image
      })
      
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

      await setDoc(doc(db, 'userChats', String(result.user.uid)), {})
      await signOut(auth)
      navigate('/login')
      props.setForm(true)

    } catch(e) {
      if(String(e).includes('email-already-in-use')) {
        setConfirmModal(true)
      } else {
        setAlertDes(`${e}`)
        setAlertModal(true)
      }
      console.error(`!!!${e}`)
    }
  }; 

  const passwordRef = useRef<string | null>(null)
  passwordRef.current = watch("password")


  return (<>
    <AlertModal alertModal={alertModal} setAlertModal={setAlertModal} title={alertTitle} des={alertDes}/>
    <ConfirmModal confirmModal={confirmModal} setConfirmModal={setConfirmModal} getModalAnswer={getModalAnswer} title={confirmTitle} des={confirmDes} confirmBtn={confirmBtn}/>
    <div className='w-full max-w-sm flex flex-col'>
      <div className='w-full flex flex-col mb-10'>
        <h3 className='text-3xl font-semibold mb-4'>회원가입</h3>
        <div className='text-base mb-2'>환영합니다😃 가입 양식에 맞게 정보를 입력해주세요!</div>
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