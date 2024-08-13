import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageToast } from '../App'
import Loader from './Loading'

const Signin = (props) => {
  const navigate = useNavigate()
  const ads = useRef(["https://i.gifer.com/O80B.gif", "https://31.media.tumblr.com/95d7ec7c3aad1a23c4fb9af6c3feacba/tumblr_n5vzyibcnR1su6wxjo1_1280.gif", 'https://media2.giphy.com/media/3o7TKqL3KciKesxCRq/giphy.gif', 'https://i.pinimg.com/originals/7d/b6/6e/7db66e5cae9ee7b8fa2d5384a39a552c.gif', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a9bd6a13-e21d-49dd-ab5c-ab856df1e140/ddunbry-2814da4b-ef4a-482a-86de-f781bd4a0bdb.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2E5YmQ2YTEzLWUyMWQtNDlkZC1hYjVjLWFiODU2ZGYxZTE0MFwvZGR1bmJyeS0yODE0ZGE0Yi1lZjRhLTQ4MmEtODZkZS1mNzgxYmQ0YTBiZGIuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.2PAiLBG2fwewHG6YEI7zye00-O40HaKN3XZALBJ0-8g', 'https://31.media.tumblr.com/03f4cf3fc8bfdb64f14e585290773b45/tumblr_mue08eC4Py1s8s2vgo1_500.gif', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/08b0802e-3344-4932-86dc-15deea735a0d/dbw7dy9-a8759213-e915-41ba-a600-94ef366a2121.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzA4YjA4MDJlLTMzNDQtNDkzMi04NmRjLTE1ZGVlYTczNWEwZFwvZGJ3N2R5OS1hODc1OTIxMy1lOTE1LTQxYmEtYTYwMC05NGVmMzY2YTIxMjEuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.YirZG0UcO2HXw1uXTT0xwsFLlvE0Ce-wx2mHsj7mZqE'])
  const decide = useRef(Math.floor(Math.random() * ads.current.length))
  const [disable, setDisable] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isAuth, setIsAuth } = props
  const [login, setLogin] = useState(false)
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [valid, setValid] = useState({
    email: true,
    password: true,
    confirmPassword: true
  })

  const check = (type, toBeChecked) => {
    let isValid;
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(toBeChecked);
    } else if (type === 'password') {
      const passwordRegex =  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/ ;
      isValid = passwordRegex.test(toBeChecked);
    } else if (type === 'confirmPassword') {
      isValid = toBeChecked === data.password;
    }

    setValid((prev) => ({ ...prev, [type]: isValid }));
  }

  useEffect(() => {
    if (isAuth) {
      navigate('/')
    }
  }, [isAuth, navigate])

  const submit = (e) => {
    setDisable(true)
    setLoading(true)
    e.preventDefault()

    if (!login) {
      createUserWithEmailAndPassword(auth, data.email, data.password).then(result => {
        MessageToast("success", "Cheers🥂! User Created!")
        setData({ email: "", password: "", confirmPassword: "" })
        setLogin(true)
        setDisable(false)
        setLoading(false)
      }).catch(err => {
        console.log(err.message)
        setDisable(false)
        setLoading(false)
        setData({ email: "", password: "", confirmPassword: "" })
      })
    } else if (login) {
      signInWithEmailAndPassword(auth, data.email, data.password).then(result => {
        MessageToast("success", "User logged in!")
        window.localStorage.setItem('isAuth', true)
        setIsAuth(true)
        setDisable(false)
        setLoading(false)
        setData({ email: "", password: "" })
        navigate('/')
      }).catch(err => {
        console.log(err.message)
        MessageToast("error", err.message)
        setDisable(false)
        setLoading(false)
        setData({ email: "", password: "" })
      })
    }
  }
  
  const loginWithGoogle = async () => {
    setDisable(true)
    setLoading(true)
    
    signInWithPopup(auth, provider).then((result) => {
      window.localStorage.setItem('isAuth', true)
      setIsAuth(true)
      setDisable(false)
      setLoading(false)
      navigate('/')
      MessageToast("success", "Cheers🥂! User Created & Logged in!")
    }).catch(err => {
      console.log(err.message)
      MessageToast("error", err.message)
      setDisable(false)
      setLoading(false)
    })
  }

  return (
    <>
      {loading && <Loader />}
      <div className="w-full h-screen flex justify-center ">
        <div className="min-h-2/3 h-full overflow-hidden w-full sm:w-10/12 md:w-2/3 rounded-sm border-2 border-black/90 flex flex-col space-y-2 bg-sky-100/65 ">
          <div className='w-full relative h-[43vh] overflow-hidden p-3'>
            <img className='flex aspect-[3/2] mx-auto items-center justify-center h-full border-2 border-black rounded-md' alt='watch 👀' src={ads.current[decide.current]} />
          </div>

          <h2 className='font-bold text-lg sm:text-xl md:text-2xl px-3 mx-auto uppercase'>{login ? "Signin" : "Signup"}</h2>
          <p className='text-base sm:text-lg md:text-xl font-medium text-center'>{login ? "Fill your details to login." : "Fill your details to create account."}</p>

          <button className=" mx-auto w-1/2 flex items-center justify-center px-6 py-2 text-xs sm:text-sm  font-bold uppercase text-center align-middle rounded-lg border border-black/25 gap-3 text-gray-700 bg-white cursor-pointer transition-all duration-600 ease-in-out hover:scale-102"
            onClick={loginWithGoogle}>
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
              <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
              <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
              <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
              <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
            </svg>
            Continue with Google
          </button>
          <p className='font-bold text-lg sm:text-xl md:text-2xl text-center p-1 '>OR</p>
          <div className='flex flex-col p-2 space-y-2 w-10/12 sm:w-1/2 mx-auto '>
            {!login ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                  <input
                    autoFocus={true}
                    title='Email'
                    className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${valid.email ? 'border-gray-300' : 'border-red-500'}`}
                    type="email"
                    required
                    name="email"
                    id="email"
                    value={data.email}
                    disabled={disable}
                    onChange={(e) => { setData({ ...data, email: e.target.value }); check("email", e.target.value) }}
                  />
                </div>
                <div >
                  <label htmlFor='password' className="block text-lg font-medium text-gray-700">Password</label>
                  <input
                    title='Password'
                    className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${valid.password ? 'border-gray-300' : 'border-red-500'}`}
                    type="password"
                    required
                    name="password"
                    id="password"
                    value={data.password}
                    disabled={disable}
                    onChange={(e) => { setData({ ...data, password: e.target.value }); check("password", e.target.value) }}
                  />
                </div>
                <div >
                  <label htmlFor='confirmPassword' className="block text-lg font-medium text-gray-700">Confirm Password</label>
                  <input
                    title='Retype Password'
                    className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${valid.confirmPassword ? 'border-gray-300' : 'border-red-500'}`}
                    type="password"
                    required
                    name="confirmPassword"
                    id="confirmPassword"
                    value={data.confirmPassword}
                    disabled={disable}
                    onChange={(e) => { setData({ ...data, confirmPassword: e.target.value }); check("confirmPassword", e.target.value) }}
                  />
                </div>

                <button
                  className="text-2xl py-2 font-bold mx-auto w-full bg-sky-500 text-white rounded-md shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors"
                  onClick={submit}
                  disabled={disable || !(valid.email && valid.password && valid.confirmPassword)}
                >
                  Signup
                </button>

                <span className='text-base sm:text-lg md:text-xl break-words mx-auto'>
                  Already have an account.
                  <Link
                    onClick={() => {
                      setData({ email: "", password: "", confirmPassword: "" })
                      setLogin(true)
                    }}
                    className='font-bold text-blue-500 underline ml-1 hover:text-blue-600'
                  >
                    Login?
                  </Link>
                </span>
              </>
            ) : (
              <>
                <div className='space-y-1'>
                  <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                  <input
                    className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${valid.email ? 'border-gray-300' : 'border-red-500'}`}
                    type="email"
                    required
                    name="email"
                    id="email"
                    value={data.email}
                    disabled={disable}
                    onChange={(e) => { setData({ ...data, email: e.target.value }); check("email", e.target.value) }}
                  />
                </div>
                <div className='space-y-1'>
                  <label htmlFor='password' className="block text-lg font-medium text-gray-700">Password</label>
                  <input
                    className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${valid.password ? 'border-gray-300' : 'border-red-500'}`}
                    type="password"
                    required
                    name="password"
                    id="password"
                    value={data.password}
                    disabled={disable}
                    onChange={(e) => { setData({ ...data, password: e.target.value }); }}
                  />
                </div>
                <button
                  className="text-2xl py-2 font-bold mx-auto w-full bg-sky-500 text-white rounded-md shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors"
                  onClick={submit}
                  disabled={disable || !valid.email}
                >
                  Login
                </button>
                <span className='text-base sm:text-lg md:text-xl break-words mx-auto'>
                  Don't have an account.
                  <Link
                    onClick={() => {
                      setData({ email: "", password: "", confirmPassword: "" })
                      setLogin(false)
                    }}
                    className='text-blue-500 hover:text-blue-600 underline text-center'
                  >
                    Signup?
                  </Link>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Signin
