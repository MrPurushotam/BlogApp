import React,{useEffect, useState} from 'react'
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import { collection,addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { MessageToast } from '../App';
import { useNavigate } from 'react-router-dom';

const CreatePost = ({isAuth}) => {
  const navigate=useNavigate()
  const [data,setData]=useState({title:"",description:""})
  const uploadBlog=async (e)=>{
    e.preventDefault()
    try{
      const docRef=await addDoc(collection(db,"blogposts"),{
        title:data.title,
        description:data.description,
        author:{name:auth.currentUser.displayName,id:auth.currentUser.uid,uploadDate:Date.now()}
      })
      MessageToast("success","Blog Published!! Yepppee!")
      navigate('/')
    }catch(err){
      console.log(err.message)
      MessageToast("error",e.message)
    }
  }
  useEffect(()=>{
    if(!isAuth){
      navigate('/signin')
    }
  },)
  useEffect(()=>{
    if(!auth.currentUser.displayName){
      MessageToast("warning","Update Your User Name First")
      navigate('/profile')
    }
  })
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
        {'indent': '-1'}, {'indent': '+1'}],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],  
    ]
  } 
  const formats = [
    'header', 'bold', 'italic',
    'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent','script','sub',
    'color','background','align'
  ]
  return (
    <div>
      <div className='createpost-container'>
        <label>Add Blog Title</label>
        <input type='text' 
        style={{border:!data.title.trim()?"0.2vh solid red":""}}
        className='blog-title' 
        placeholder='Title...' 
        value={data.title} 
        onChange={(e)=>
          {setData({...data,title:e.target.value})}
        }
        />
        
        <label>Add Blog Description</label>
        <ReactQuill
          style={{border:!data.description.trim()?"0.2vh solid red":""}}
          className='blog-description'
          theme="snow" modules={modules} 
          formats={formats} 
          value={data.description} 
          onChange={(e)=>setData({...data,description:e})} 
          placeholder="Create your personal blog..." 
        />

        <button onClick={uploadBlog} className='blog-post' disabled={!data.title.trim() && !data.description.trim()}>Post BLog</button>
      </div>
    </div>
  )
}

export default CreatePost
