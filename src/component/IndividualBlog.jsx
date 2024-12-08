import { getDoc, doc, collection, query, where, orderBy, getDocs, deleteDoc, limit } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import BlogContainer from './blog';
import Loader from './Loading';

const IndividualBlog = ({ isAuth }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [blog, setBlog] = useState(null);
    const [authorId, setAuthorId] = useState(null);
    const [authorPosts, setAuthorPosts] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchBlogData = async () => {
            setLoading(true);
            try {
                // Fetch the blog document by ID
                const blogRef = doc(db, "blogposts", id);
                const blogSnapshot = await getDoc(blogRef);

                if (blogSnapshot.exists()) {
                    const blogData = blogSnapshot.data();
                    setBlog({ id: blogSnapshot.id, ...blogData });
                    setAuthorId(blogData.author.id);
                }
            } catch (error) {
                console.error("Error fetching blog data:", error);
            }
            setLoading(false);
        };

        fetchBlogData();
    }, [id]);

    useEffect(() => {
        const fetchAuthorPosts = async () => {
            if (!authorId) return;

            try {
                const authorPostsQuery = query(
                    collection(db, "blogposts"),
                    where("author.id", "==", authorId),
                    orderBy("author.uploadDate", "desc"),
                    limit(5)
                );
                const authorPostsSnapshot = await getDocs(authorPostsQuery);

                const posts = authorPostsSnapshot.docs.filter(doc => doc.id !== id).map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAuthorPosts(posts);
            } catch (error) {
                console.error("Error fetching author posts:", error);
            }
        };

        fetchAuthorPosts();
    }, [authorId,id]);

    const deleteThisPost = async (id) => {
        setLoading(true);
        try {
            const getDoc = doc(db, 'blogposts', id);
            await deleteDoc(getDoc);
            navigate("/");
        } catch (error) {
            console.log("Error occurred", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full h-screen flex'>
            {loading && <Loader />}
            <div className='shadow-md shadow-black h-full w-1/2 mx-auto px-5 py-3 space-y-3'>
                {blog && (
                    <BlogContainer auth={auth} deleteThisPost={deleteThisPost} isAuth={isAuth} post={blog} key={blog.id} />
                )}
                <div className="space-y-2  flex flex-col">
                    <h2 className="text-center text-black font-semibold text-2xl py-1"> Other post by same author.</h2>

                    {authorPosts.map(post => {
                        let dt = new Date(post.author.uploadDate)
                        return (
                            <div className="w-full py-3 px-5 border-2 border-gray-500 rounded-md hover:border-blue-600 hover:shadow-sm hover:shadow-sky-500 " key={post.id} onClick={() => navigate(`/blog/${post.id}`)}>
                                <div>
                                    <p className='px-2 py-2 border-b-2 border-black flex justify-between cursor-default'>
                                        <span className='text-2xl font-semibold '>{post.author.name}</span>
                                        <span className='text-sm font-semibold tracking-wider'>{
                                            dt.getHours() + ":" + dt.getMinutes() + " | " + dt.getDate() + "-" + dt.getMonth() + "-" + dt.getFullYear()
                                        }</span>
                                    </p>
                                </div>
                                <h2 className='text-center py-3 font-semibold text-3xl'>{post.title}</h2>
                            </div>

                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default IndividualBlog;
