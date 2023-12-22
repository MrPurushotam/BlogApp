import React,{useState} from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Signin from "./component/signin";
import Navbar from './component/navbar';
import Home from './component/home';
import CreatePost from "./component/createPost";
import Profile from "./component/profile";
import "./app.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const property={
  position: "top-right",
  autoClose: 5000,
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
  const [isAuth,setIsAuth]=useState(window.localStorage.getItem('isAuth')?true:false)
  return (
    <Router>
      <Navbar isAuth={isAuth}/>
      <ToastContainer/>
      <div className='App'>
        <Routes>
          <Route exact path='/' element={<Home isAuth={isAuth}/>}/>  
          <Route exact path='/signin' element={<Signin isAuth={isAuth} setIsAuth={setIsAuth} />}/>  
          <Route exact path='/write' element={<CreatePost isAuth={isAuth} />} />  
          <Route exact path='/profile' element={<Profile isAuth={isAuth}/>} />  
        </Routes> 
      </div>

     </Router>
  )
}

export default App
