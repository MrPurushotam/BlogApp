import React, { useEffect, useState, useCallback, useMemo } from 'react'
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MessageToast } from '../App';
import { useNavigate } from 'react-router-dom';
import Loader from './Loading';
import ImageResize from 'quill-image-resize-module-react';

// Register Image Resize module for Quill
Quill.register('modules/imageResize', ImageResize);

const CreatePost = ({ isAuth, setIsAuth }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const quillRef = React.useRef();

  // Upload Blog Function
  const uploadBlog = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await addDoc(collection(db, "blogposts"), {
        title: data.title,
        description: data.description,
        author: { name: auth.currentUser.displayName, id: auth.currentUser.uid, uploadDate: Date.now() }
      });
      MessageToast("success", "Blog Published!! Yepppee!");
      navigate('/');
    } catch (err) {
      console.error(err.message);
      MessageToast("error", err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuth) {
      navigate('/signin');
    }
    if (!auth || !auth.currentUser) {
      window.localStorage.removeItem("isAuth");
      setIsAuth(false);
      navigate("/signin");
    } else if (!auth.currentUser.displayName) {
      MessageToast("warning", "Update Your User Name First");
      navigate('/profile');
    }
  }, [isAuth, setIsAuth, navigate]);

  // Image Handler Function for Quill
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);

      setLoading(true);
      try {
        const storageRef = ref(storage, `blog-images/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        quill.insertEmbed(range.index, 'image', downloadURL);
        quill.setSelection(range.index + 1);
        MessageToast("success", "Image uploaded successfully!");
      } catch (error) {
        console.error('Error uploading image: ', error);
        MessageToast("error", "Failed to upload image");
      }
      setLoading(false);
    };
  }, []);

  // Quill Modules
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        [{ 'align': [] }, { 'image-align': ['left', 'center', 'right'] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize', 'Toolbar']
    }
  }), [imageHandler]);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'script', 'sub', 'super', 
    'link', 'image', 'color', 'background', 'align', 'image-align'
  ];

  return (
    <>
      {loading && <Loader />}
      <div className='w-full h-screen overflow-hidden py-1'>
        <div className='space-y-2 w-full sm:w-10/12 md:w-2/3 mx-auto h-auto sm:border-2 sm:border-black py-3 px-4 bg-sky-100/70'>
          <label className='text-xl font-bold capitalize p-2'>Add Blog Title</label>
          <input type='text'
            style={{ border: !data.title.trim() ? "0.2vh solid red" : "0.2vh solid grey" }}
            className='block text-lg w-full py-2 px-3'
            placeholder='Title...'
            value={data.title}
            onChange={(e) => { setData({ ...data, title: e.target.value }) }}
          />

          <label className='text-xl font-bold capitalize p-2'>Add Blog Description</label>
          <ReactQuill
            ref={quillRef}
            style={{ border: !data.description.trim() ? "0.2vh solid red" : "" }}
            className='blog-description bg-white text-xl'
            theme="snow"
            modules={modules}
            formats={formats}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e })}
            placeholder="Create your personal blog..."
          />

          <button onClick={uploadBlog} className='border-2 bg-sky-400 hover:bg-sky-500 p-2 text-2xl font-bold w-full mx-auto rounded-md' disabled={!data.title.trim() && !data.description.trim()}>Post Blog</button>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
