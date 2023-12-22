import { signOut } from 'firebase/auth';
import React from 'react'
import  {Link} from 'react-router-dom';
import { auth } from '../firebase';


const Navbar = (props) => {
  const {isAuth}=props
  const signout=()=>{
    signOut(auth).then((res)=>{
      console.log('logged out!')
      window.localStorage.removeItem('isAuth')
    })
  }
  return (
    <div>
      <div className='nav-container'>
        <div className='nav-child'>
            <Link to={'/'} className='nav-home link'>Home</Link>
            {isAuth?<>
            <Link to={'/write'} className='nav-upload link'>Write a Blog?</Link>
            <Link to={'/profile'} className='nav-profile link'>Profile</Link>
            </>:""}
        </div>
        {isAuth?<Link to={'/signin'} className='nav-login' onClick={signout}>Logout</Link>:<Link to={'/signin'} className='nav-login' >Login</Link>}
      </div>
    </div>
  )
}

export default Navbar
