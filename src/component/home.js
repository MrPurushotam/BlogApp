import React, { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { MessageToast } from '../App'
import { auth, db } from '../firebase'

const Home = ({isAuth}) => {
  const [blogs,setBlogs]=useState([])
  const [loading,setLoading]=useState(true)
  useEffect(()=>{
    async function getData(){
      try{
        const docs=await getDocs(collection(db,"blogposts"));
        MessageToast('info',"check console")
        setBlogs(docs.docs.map((doc)=>({...doc.data(),id:doc.id})))
        setLoading(false)
      }catch(e){
        console.log(e.message)
        MessageToast("error",e.message)
      }
    }
    if(loading){
      getData()
    }
  },[loading])

  const deleteThisPost=async(id)=>{
    const getDoc= doc(db,'blogposts',id);
    await deleteDoc(getDoc);
    setBlogs(blogs.filter(obj=>obj.id!==id ))
  }
  console.log(isAuth)
  return (
  <>
  {blogs.map((post,i)=>(
    <div className='container' key={i}>
      <div className='home-blog-container'>
        <p className='blog-post-header'>
          <span className='bp-uname'>{post.author.name ||"No Name"}</span>
          {isAuth && (post.author.id===auth.currentUser.uid) && 
          <span className='material-symbols-outlined delete-icon' onClick={()=>deleteThisPost(post.id)}>delete</span>}
        </p>
        <h2 className='home-blog-title'>{post.title}</h2>
        <div dangerouslySetInnerHTML={{__html:post.description}} className="home-blog"></div>
        <p className='home-blog-date'>{new Date(post.author.uploadDate).toISOString()}</p>
      </div>
    </div>
  ))}
  </>
  )
}

export default Home
