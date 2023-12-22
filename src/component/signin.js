import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signInWithPopup } from 'firebase/auth'
import {auth,provider} from '../firebase'
import React, { useState,useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageToast } from '../App'

const Signin = (props) => {
  const navigate=useNavigate()
  const ads=useRef(["https://i.gifer.com/O80B.gif","https://31.media.tumblr.com/95d7ec7c3aad1a23c4fb9af6c3feacba/tumblr_n5vzyibcnR1su6wxjo1_1280.gif",'https://media2.giphy.com/media/3o7TKqL3KciKesxCRq/giphy.gif','https://i.pinimg.com/originals/7d/b6/6e/7db66e5cae9ee7b8fa2d5384a39a552c.gif','https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a9bd6a13-e21d-49dd-ab5c-ab856df1e140/ddunbry-2814da4b-ef4a-482a-86de-f781bd4a0bdb.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2E5YmQ2YTEzLWUyMWQtNDlkZC1hYjVjLWFiODU2ZGYxZTE0MFwvZGR1bmJyeS0yODE0ZGE0Yi1lZjRhLTQ4MmEtODZkZS1mNzgxYmQ0YTBiZGIuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.2PAiLBG2fwewHG6YEI7zye00-O40HaKN3XZALBJ0-8g','https://31.media.tumblr.com/03f4cf3fc8bfdb64f14e585290773b45/tumblr_mue08eC4Py1s8s2vgo1_500.gif','https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/08b0802e-3344-4932-86dc-15deea735a0d/dbw7dy9-a8759213-e915-41ba-a600-94ef366a2121.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzA4YjA4MDJlLTMzNDQtNDkzMi04NmRjLTE1ZGVlYTczNWEwZFwvZGJ3N2R5OS1hODc1OTIxMy1lOTE1LTQxYmEtYTYwMC05NGVmMzY2YTIxMjEuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.YirZG0UcO2HXw1uXTT0xwsFLlvE0Ce-wx2mHsj7mZqE'])
  const decide=useRef(Math.floor(Math.random()*ads.current.length))
  const {isAuth,setIsAuth}=props
  const [method,setMethod]=useState("manual")
  const [login,setLogin]=useState(false)
  const [data,setData]=useState({
    email:"",
    password:"",
    confrimpassword:""
  })
  const check=(type,toBeChecked)=>{
    let x;
    if(type==='email'){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      x= emailRegex.test(toBeChecked);
    }else if(type==='password' || type==='confrimpassword'){
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      x= passwordRegex.test(toBeChecked);
    }
    if(x){
      document.getElementById(type).style.borderColor='red'
      x=""
    }
  }

  useEffect(()=>{
    if(isAuth){
      navigate('/')
    }
  },)


  const submit=(e)=>{
    e.preventDefault()
    if(method==='manual' && !login){
      createUserWithEmailAndPassword(auth,data.email,data.password).then(result=>{
        MessageToast("success","Cheers🥂! User Created!")
        setData({email:"",password:"",confrimpassword:""})
        setLogin(true)
      }).catch(err=>{
        console.log(err.message)
        setData({email:"",password:"",confrimpassword:""})
      })
    }else if(method==='manual' && login){
      signInWithEmailAndPassword(auth,data.email,data.password).then(result=>{
        MessageToast("success","User logged in!")
        window.localStorage.setItem('isAuth',true)
        setIsAuth(true)
        setData({email:"",password:""})
        navigate('/')
      }).catch(err=>{
        console.log(err.message)
        MessageToast("error",err.message)
        setData({email:"",password:""})        
      })
    }else if(method==="google"){
      signInWithPopup(auth,provider).then((result)=>{
        MessageToast("success","Cheers🥂! User Created & Logged in!")
        setIsAuth(true)
        navigate('/')
      }).catch(err=>{
        console.log(err.message)
        MessageToast("error",err.message)
      })
    }
  }
  return (
    <div>
      <div className='signin-choice'>
        <span style={{color:method==='manual'?'red':""}} className='choose' onClick={()=>setMethod('manual')}>Email</span>
        <span className='choose' style={{color:method==='google'?'red':""}} onClick={()=>setMethod('google')}>Google</span>
      </div>
      <div className='display-gif'>
        <img alt='ads' src={ads.current[decide.current]}/>
      </div>

      <div className='login-form'>
      {method==="manual"?
        <div>
          {!login?
          <>
          <h2 className='form-type'>SignUp Using Email</h2>
          <label htmlFor="email">Email
            <input type="email" required name="email" id="email" value={data.email} disabled={check('email',data.email)} onChange={(e)=>setData({...data,email:e.target.value})}/>
          </label>
          <label htmlFor='password'>Password
            <input type="password" required name="password" id="password" value={data.password} disabled={check('password',data.password)} onChange={(e)=>setData({...data,password:e.target.value})}/>
          </label>
          <label htmlFor='confrimpassword'>Confirm Password
            <input type="password" required name="confrimpassword" id="confrimpassword" value={data.confrimpassword} disabled={check('confrimpassword',data.confrimpassword)} onChange={(e)=>setData({...data,confrimpassword:e.target.value})}/>
          </label>
          <button onClick={submit} disabled={!(data.confrimpassword===data.password)}>Signup</button>
          <Link onClick={()=>{
            setData({email:"",password:"",confrimpassword:""})
            setLogin(true)
          }} className='change-form-link'>Login in?</Link>
          </>
        :
        <>
          <h2 className='form-type'>Login Using Email</h2>
          <label htmlFor="email">Email</label>
            <input type="email" required name="email" id="email" value={data.email} disabled={check('email',data.email)} onChange={(e)=>setData({...data,email:e.target.value})}/>
          <label htmlFor='password'>Password</label>
            <input type="password" required name="password" id="password" value={data.password} disabled={check('password',data.password)} onChange={(e)=>setData({...data,password:e.target.value})}/>
          <button onClick={submit} disabled={check('password',data.password)}>Login</button>
          <Link onClick={()=>{
            setData({email:"",password:"",confrimpassword:""})
            setLogin(false)
          }} className='change-form-link'>Sign up?</Link>

        </>}
        </div>
        :
        <div  className='s'>
          <button className='singin-google-btn' onClick={submit}>Singin With Google</button>
        </div>
        }
      </div>
    </div>
  ) 
}

export default Signin
