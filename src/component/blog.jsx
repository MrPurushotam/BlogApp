import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css';

const BlogContainer = ({post,isAuth , auth , deleteThisPost}) => {
    let dt=new Date(post.author.uploadDate)
    return(
      <div className='w-full px-2 py-3 border-2 border-black rounded-md'>
        <div>
            <div>
                <p className='px-2 py-2 border-b-2 border-black flex justify-between cursor-default'>
                    <span className='text-2xl font-semibold '>{post.author.name}</span>
                    {isAuth && auth.currentUser && (post.author.id===auth.currentUser.uid) && 
                    <span className='material-symbols-outlined hover:text-red-500 ' onClick={()=>deleteThisPost(post.id)}>delete</span>}
                </p>
            </div>
          <h2 className='text-center py-3 font-semibold text-3xl'>{post.title}</h2>
          <div className='quill-content-wrapper text-lg sm:text-xl md:text-2xl'>
            <ReactQuill
              value={post.description}
              readOnly={true}
              theme='bubble'
              modules={{toolbar:false}}
              className='font-medium text-xl p-2 text-left font-sans max-[45vh] overflow-y-auto break-words leading-relaxed'
              />
          </div>
          <p className='flex justify-end mr-4 text-base font-bold'>{
            dt.getHours()+":"+dt.getMinutes()+" | "+dt.getDate() + "-" + dt.getMonth()+"-"+dt.getFullYear()
          }</p>
        </div>
      </div>
    )
}

export default BlogContainer
