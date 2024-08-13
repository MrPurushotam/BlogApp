import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Navbar = (props) => {
  const navigate = useNavigate();
  const [SigninButtonText, setSigninButtonText] = useState("Signin");
  const { isAuth, setIsAuth } = props;

  useEffect(() => {
    const interval = setInterval(() => {
      setSigninButtonText(prev => prev === 'Signin' ? "Signup" : "Signin");
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const signout = async () => {
    await signOut(auth).then(() => {
      console.log('logged out!');
      window.localStorage.removeItem('isAuth');
      setIsAuth(false);
      navigate('/');
    });
  };

  return (
    <div className="sticky top-0 z-20 w-full px-4 py-3 flex justify-between items-center bg-black sm:px-6">
      <div className="text-2xl sm:text-3xl font-bold text-white cursor-pointer" onClick={() => navigate("/")}>
        Space
      </div>

      <div className="sm:flex text-lg sm:text-xl font-semibold justify-center space-x-4 items-center text-white">
        <Link to="/" className="blue-underline-hover ">Home</Link>
        <Link to="/profile" className="blue-underline-hover hidden sm:block">Profile</Link>
        <Link to="/write" className="blue-underline-hover hidden sm:block">Write</Link>
      </div>

      <div className="flex space-x-3">
        <button className="bg-sky-600/70 hover:bg-sky-600 text-white rounded-md shadow-sm shadow-white font-semibold text-base sm:text-lg p-2 sm:p-3"
          onClick={() => navigate('/write')}>
          Create Post
        </button>
        {
          isAuth ?
            <button
              className="bg-red-500 hover:bg-red-600 text-white rounded-md shadow-md shadow-red-200 font-semibold text-base sm:text-lg p-2 sm:p-3"
              onClick={signout}>Logout</button>
            :
            <button
              className="
                min-w-[80px] sm:min-w-[100px] relative cursor-pointer
                p-2 sm:p-3 rounded-md
                shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] shadow-md shadow-[#501b46]
                bg-gradient-to-t from-[#391149] to-[#501b46]
                text-white text-base sm:text-lg font-semibold
                transition-all duration-1000 ease-[cubic-bezier(0.15,0.83,0.66,1)]
                hover:text-white hover:scale-110 hover:-translate-y-[3px]
                before:content-[''] before:absolute before:bottom-0 before:left-[15%]
                before:w-[70%] before:h-[1px]
                before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent
                before:opacity-20 hover:before:opacity-100
                before:transition-all before:duration-1000 before:ease-[cubic-bezier(0.15,0.83,0.66,1)]
              "
              onClick={() => navigate("signin")}
            >
              {SigninButtonText}
            </button>
        }
      </div>
    </div>
  );
}

export default Navbar;
