import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { MessageToast } from '../App';
import { useNavigate } from 'react-router-dom';
import Loader from './Loading';

const CreatePost = ({ isAuth ,setIsAuth }) => {
  const navigate = useNavigate()
  const [data, setData] = useState({ title: "", description: "" })
  const [loading ,setLoading]=useState(false)
  const uploadBlog = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      await addDoc(collection(db, "blogposts"), {
        title: data.title,
        description: data.description,
        author: { name: auth.currentUser.displayName, id: auth.currentUser.uid, uploadDate: Date.now() }
      })
      MessageToast("success", "Blog Published!! Yepppee!")
      navigate('/')
    } catch (err) {
      console.log(err.message)
      MessageToast("error", e.message)
    }
    setLoading(false)
  }
  useEffect(() => {
    if (!isAuth) {
      navigate('/signin')
    }
    if(!auth || !auth.currentUser){
      window.localStorage.removeItem("isAuth")
      setIsAuth(false)
      navigate("/signin")
    }
    else if (!auth.currentUser.displayName) {
      MessageToast("warning", "Update Your User Name First")
      navigate('/profile')
    }
  })

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' },
      { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
    ]
  }
  const formats = [
    'header', 'bold', 'italic',
    'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'script', 'sub',
    'color', 'background', 'align'
  ]
  return (
    <>
      {loading && <Loader/>}
      <div className='w-full h-screen overflow-hidden py-1 bg-sky-100/70'>
        <div className='space-y-2 w-2/3 mx-auto h-auto border-2 border-black py-3 px-4'>
          <label className='text-lg font-bold capitalize p-2'>Add Blog Title</label>
          <input type='text'
            style={{ border: !data.title.trim() ? "0.2vh solid red" : "0.2vh solid grey" }}
            className='block text-base w-full py-2 px-3'
            placeholder='Title...'
            value={data.title}
            onChange={(e) => { setData({ ...data, title: e.target.value }) }}
          />

          <label className='text-lg font-bold capitalize p-2'>Add Blog Description</label>
          <ReactQuill
            style={{ border: !data.description.trim() ? "0.2vh solid red" : "" }}
            className='blog-description bg-white'
            theme="snow" modules={modules}
            formats={formats}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e })}
            placeholder="Create your personal blog..."
          />

          <button onClick={uploadBlog} className='border-2  bg-sky-400 hover:bg-sky-500 p-2 text-xl font-bold w-full mx-auto rounded-md' disabled={!data.title.trim() && !data.description.trim()}>Post Blog</button>
        </div>
      </div>
    </>
  )
}

export default CreatePost
