import React,{useEffect, useState} from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Signin from "./component/signin";
import Navbar from './component/navbar';
import Home from './component/home';
import CreatePost from "./component/createPost";
import Profile from "./component/profile";
import "./app.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from './component/Loading';

const property={
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
}

export const MessageToast = (type,message) => {
  switch (type) {
      case "success":
        toast.success(message,property);
        break;
      case "info":
        toast.info(message,property);
        break;
      case "warning":
        toast.warning(message,property);
        break;
      case "error":
        toast.error(message,property);
        break;
      default:
        toast(message,property);
    }
  }

const App = () => {
  const [isAuth,setIsAuth]=useState(window.localStorage.getItem('isAuth')?true:false);
  const [loading , setLaoding]=useState(true);

  useEffect(()=>{
    function checkState (){
      try {
        onAuthStateChanged(auth,user=>{
          if(user){
            setIsAuth(true)
          }else{
            console.log("Forced Logged out")
            window.localStorage.removeItem('isAuth')
            setIsAuth(false)
          }
        })
      } catch (error) {
        console.log("Error occured")
      }finally{
        setLaoding(false)
      }
    } 
      
    checkState()
  })


  return (
    <>
      {loading && <Loader/>}
      <Router>
        <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
        <div className='w-full h-auto overflow-y-auto overflow-x-hidden bg-sky-100 '>
        <ToastContainer/>
          <Routes>
            <Route exact path='/' element={<Home isAuth={isAuth}/>}/>
            <Route exact path='/signin' element={<Signin isAuth={isAuth} setIsAuth={setIsAuth} />}/>
            <Route exact path='/write' element={<CreatePost isAuth={isAuth} setIsAuth={setIsAuth} />} />  
            <Route exact path='/profile' element={<Profile isAuth={isAuth}/>} />  
          </Routes> 
        </div>

      </Router>
    </>
  )
}

export default App
