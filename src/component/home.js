import React, { useCallback, useEffect, useRef, useState } from 'react'
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore'
import { MessageToast } from '../App'
import { auth, db } from '../firebase'
import BlogContainer from './blog'
import Loader, { SimpleLoader } from './Loading'

const Home = ({ isAuth }) => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore ,setHasMore]=useState(true)
  const [lastdoc,setLastdoc]=useState(null)
  const [containerLoader,setContainerLoader]=useState(false)
  const blogLimit=5;
  const isFetching=useRef(false)

  const fetchBlogs=async (lastVisible=null)=>{
    if(!hasMore || isFetching.current) return;
    isFetching.current=true
    try {
      let q;
      if(lastVisible){
        setContainerLoader(true)
        q=query(
          collection(db,"blogposts"),
          orderBy("author.uploadDate","desc"),
          startAfter(lastVisible),
          limit(blogLimit)
        )
      }else{
        setLoading(true)
        q=query(
          collection(db,"blogposts"),
          orderBy("author.uploadDate",'desc'),
          limit(blogLimit)
        )
      }
      const docs= await getDocs(q)
      const newBlogs= docs.docs.map((doc)=>({...doc.data(),id:doc.id}))
      setBlogs(prev=>[...prev,...newBlogs])
      setLastdoc(docs.docs[docs.docs.length-1])
      setHasMore(newBlogs.length===blogLimit)
    } catch (error) {
      console.log("Error occured ",error.message)
      MessageToast("error", error.message)
    }finally{
      isFetching.current=false
      setContainerLoader(false)
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchBlogs()
  }, [])

  const deleteThisPost = async (id) => {
    setLoading(true)
    try {
      const getDoc = doc(db, 'blogposts', id);
      await deleteDoc(getDoc);
      setBlogs(blogs.filter(obj => obj.id !== id))

    } catch (error) {
      console.log("Error occured ", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleScroll=useCallback(()=>{
    if(window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !loading && hasMore && !isFetching.current){
      fetchBlogs(lastdoc)
    }
  },[loading,hasMore,lastdoc])

  useEffect(()=>{
    window.addEventListener("scroll",handleScroll)
    return ()=>window.removeEventListener("scroll",handleScroll)
  },[handleScroll])

  return (
    <>
      {loading && <Loader/>}
      <div className=' w-full sm:w-10/12 md:w-2/3 mx-auto max-h-full min-h-[100vh] overflow-y-auto py-1 px-2 space-y-3 bg-sky-100/80'>
        {blogs.map((post, i) => {
          return(
            <BlogContainer post={post} key={i} isAuth={isAuth} auth={auth} deleteThisPost={deleteThisPost} />
          )
        })}
        {containerLoader && <SimpleLoader/>}
        {!hasMore && !containerLoader && blogs.length > 0 && <p className="text-center mt-4">You have enterd to start</p>}
      </div>
    </>
  )
}

export default Home
