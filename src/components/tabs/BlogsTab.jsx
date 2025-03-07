// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { addDoc, collection, db } from '../../config/firebase';


export default function AdminBlogPanel() {
  const [blog, setBlog] = useState({
    heading: "",
    subHeading: "",
    author: "",
    date: "",
    content: "",
  });
  
  const submitBlog = async(e) => {
    e.preventDefault()
    const collectionRef = collection(db, "blogs")
    
    try{
      const newBlog = {
        heading: blog.heading,
        subHeading: blog.subHeading,
        author: blog.author,
        date: blog.date,
        content: blog.content,
      }
      const blogRef = await addDoc(collectionRef, newBlog)
      if(blogRef.id){
        alert("Blog added Successfully")
        setBlog({
          heading: "",
          subHeading: "",
          author: "",
          date: "",
          content: "",
      })
      }
    }catch(error){
      console.log(error)
    }
  }
 

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (content) => {
    setBlog((prev) => ({ ...prev, content }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Blog submitted: ", blog);
  };

  return (
    <div className="flex justify-center items-center  min-h-screen  p-4">
      <div className="w-full max-w-2xl bg-white p-6 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Blog</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="heading"
            value={blog.heading}
            onChange={handleChange}
            placeholder="Blog Title"
            className="w-full p-2 border rounded-lg"
            required
          />
          
          <input
            type="text"
            name="subHeading"
            value={blog.subHeading}
            onChange={handleChange}
            placeholder="Sub Heading"
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="text"
            name="author"
            value={blog.author}
            placeholder='Author'
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="date"
            name="date"
            value={blog.date}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          
          <div className="border p-4 min-h-[400px] rounded-lg bg-white">
            <ReactQuill value={blog.content} onChange={handleEditorChange} className="w-full h-full" />
          </div>
          <button type="submit" onClick={submitBlog} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-800 hover:cursor-pointer">
            Submit Blog
          </button>
        </form>
      </div>
    </div>
  );
}
