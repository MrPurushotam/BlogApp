import React,{useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { auth } from '../firebase'
import { updateProfile } from 'firebase/auth'
import { MessageToast } from '../App'

const Profile = ({isAuth}) => {
  const [username,setUsername]=useState(auth.currentUser && auth.currentUser.displayName?auth.currentUser.displayName:'')
  const navigate=useNavigate()
  useEffect(()=>{
    if(!isAuth){
      navigate('/signin')
    }
  },)
  const updateUsername=async ()=>{
    try{
      updateProfile(auth.currentUser,{
        displayName:username,
      }).then(()=>{
        console.log('pfp updated')
      })
      MessageToast("success",`Display Name updated to ${auth.currentUser.displayName}`)
    }catch(e){
      console.log(e.message)
      MessageToast("error",e.message)
    }
  }
  console.log(auth.currentUser)
  return (
    <div>
      <div className='profile-update'>
        <label htmlFor='username'>Update Username:</label>
        <input className='update-username' name='username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
        <button className='update-btn' disabled={auth.currentUser && auth.currentUser.displayName?true:false}
        onClick={()=>{
          document.querySelector('.update-username').disabled=true;
          updateUsername()
        }}>Update</button>
      </div>
    </div>
  )
}

export default Profile
