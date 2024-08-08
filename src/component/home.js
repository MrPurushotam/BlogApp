import React, { useEffect, useState } from 'react'
import { collection, deleteDoc,doc, getDocs,orderBy,query } from 'firebase/firestore'
import { MessageToast } from '../App'
import { auth, db } from '../firebase'
import BlogContainer from './blog'

const Home = ({ isAuth }) => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function getData() {
      try {
        const q= query(collection(db, "blogposts"),orderBy("author.uploadDate","desc"))
        const docs = await getDocs(q);
        setBlogs(docs.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        setLoading(false)
      } catch (e) {
        console.log(e.message)
        MessageToast("error", e.message)
      }
    }
    if (loading) {
      getData()
    }
  }, [loading])

  const deleteThisPost = async (id) => {
    const getDoc = doc(db, 'blogposts', id);
    await deleteDoc(getDoc);
    setBlogs(blogs.filter(obj => obj.id !== id))
  }
  return (
    <div className='w-2/3 mx-auto max-h-full min-h-[100vh] overflow-y-auto border-2 border-black py-1 px-2 space-y-3 bg-sky-100/80'>
      {blogs.map((post, i) => (
        <BlogContainer post={post} key={i} isAuth={isAuth} auth={auth} deleteThisPost={deleteThisPost} />
      ))}
    </div>
  )
}

export default Home
