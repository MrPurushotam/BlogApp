import React, { useEffect, useRef, useState } from 'react'
import 'react-quill/dist/quill.bubble.css';
import BlogShare from './Share';

const BlogContainer = ({ post, isAuth, auth, deleteThisPost }) => {
  let dt = new Date(post.author.uploadDate)
  const ref = useRef();
  const [shareClicked, setShareClicked] = useState(false)

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShareClicked(false);
      }
    }
    window.addEventListener('mousedown', handleOutsideClick);
    return () => {
      window.removeEventListener(",mousedown", handleOutsideClick)
    }
  })

  return (
    <div className='w-full px-2 py-3 border-2 border-black rounded-md'>
      <div>
        <div>
          <p className='px-2 py-2 border-b-2 border-black flex justify-between cursor-default'>
            <span className='text-2xl font-semibold '>{post.author.name}</span>
            {isAuth && auth.currentUser && (post.author.id === auth.currentUser.uid) &&
              <span className='material-symbols-outlined hover:text-red-500 ' onClick={() => deleteThisPost(post.id)}>delete</span>}
          </p>
        </div>
        <h2 className='text-center py-3 font-semibold text-3xl'>{post.title}</h2>
        <div className='quill-content-wrapper text-lg sm:text-xl md:text-2xl'>
          <div
            className='mx-auto font-medium text-xl p-2 text-left font-sans max-[45vh] overflow-y-auto break-words leading-relaxed'
            dangerouslySetInnerHTML={{ __html: post.description }}
          />
        </div>
        <div className='flex justify-end items-center mr-4 space-x-3 relative '>
          <i className={`ph-light ph-share-network text-xl hover:bg-gray-200 rounded-full p-1 ${shareClicked ? "bg-gray-200 shadow-md" : ""}`} onClick={() => setShareClicked(prev => !prev)} ></i>
          <p className='text-sm font-semibold tracking-wider'>{
            dt.getHours() + ":" + dt.getMinutes() + " | " + dt.getDate() + "-" + dt.getMonth() + "-" + dt.getFullYear()
          }</p>
          {shareClicked && (
            <div className="absolute top-9 right-0 mt-2" ref={ref}>
              <BlogShare blogTitle={post.title} blogUrl={`${window.location.href}blog/${post.id}`} close={setShareClicked} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogContainer
