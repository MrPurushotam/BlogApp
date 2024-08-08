import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { updateProfile } from 'firebase/auth'
import { MessageToast } from '../App'
import Loader from './Loading'

const Profile = ({ isAuth }) => {
  const [username, setUsername] = useState(auth.currentUser && auth.currentUser.displayName ? auth.currentUser.displayName : '')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    if (!isAuth) {
      navigate('/signin')
    }
  },)
  const updateUsername = async () => {
    setLoading(true)
    updateProfile(auth.currentUser, {
      displayName: username,
    }).then(() => {
      console.log('pfp updated')
      MessageToast("success", `Display Name updated to ${auth.currentUser.displayName}`)
    }).catch(e => {
      console.log(e.message)
      MessageToast("error", e.message)
    })
    setLoading(false)
  }
  return (
    <div>
      {loading && <Loader />}
      <div className='w-full h-screen py-3'>
        <div className='mx-auto flex justify-center flex-col w-2/3 bg-sky-100/70 border-2 border-black rounded-sm py-3 px-2 space-y-2'>
          <label htmlFor='username' className='font-semibold text-xl p-2'>Update Username</label>
          <input className='border-2 border-gray-700/70 rounded-sm p-2' name='username' value={username} onChange={(e) => setUsername(e.target.value)} disabled={username} />
          <button className='border-2  bg-sky-400 hover:bg-sky-500 p-2 text-xl font-bold w-1/2 mx-auto rounded-md' disabled={auth.currentUser?.displayName}
            onClick={() => {
              updateUsername()
            }}>Update</button>
        </div>
      </div>
    </div>
  )
}

export default Profile
