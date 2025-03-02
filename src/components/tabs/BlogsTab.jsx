// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AdminBlogPanel() {
  const [blog, setBlog] = useState({
    title: "",
    date: "",
    content: "",
  });

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-6 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Blog</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={blog.title}
            onChange={handleChange}
            placeholder="Blog Title"
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
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Submit Blog
          </button>
        </form>
      </div>
    </div>
  );
}
