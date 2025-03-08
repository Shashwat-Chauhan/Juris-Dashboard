// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/desgwlbl9/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "tmpqjdfg"; // Found in Cloudinary settings

export default function AdminBlogPanel() {
  const [blog, setBlog] = useState({
    heading: "",
    subHeading: "",
    author: "",
    date: "",
    content: "",
    imageUrl: "", // New field for image URL
  });

  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null); // Ref for file input

  // Upload Image to Cloudinary
  const uploadToCloudinary = async (file) => {
    if (!file) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setUploading(false);
      return data.secure_url; // Returns the Cloudinary image URL
    } catch (error) {
      setUploading(false);
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Submit Blog to Firestore
  const submitBlog = async (e) => {
    e.preventDefault();
    const collectionRef = collection(db, "blogs");

    try {
      let imageUrl = blog.imageUrl;

      // If a new image is selected, upload it first
      if (blog.imageUrl instanceof File) {
        imageUrl = await uploadToCloudinary(blog.imageUrl);
        if (!imageUrl) {
          alert("Image upload failed.");
          return;
        }
      }

      const newBlog = {
        heading: blog.heading,
        subHeading: blog.subHeading,
        author: blog.author,
        date: blog.date,
        content: blog.content,
        imageUrl: imageUrl, // Store Cloudinary Image URL
      };

      const blogRef = await addDoc(collectionRef, newBlog);
      if (blogRef.id) {
        alert("Blog added Successfully");
        setBlog({
          heading: "",
          subHeading: "",
          author: "",
          date: "",
          content: "",
          imageUrl: "",
        });
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (content) => {
    setBlog((prev) => ({ ...prev, content }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlog((prev) => ({ ...prev, imageUrl: file }));
      setImagePreview(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-2xl bg-white p-6 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Blog</h2>
        <form onSubmit={submitBlog} className="space-y-4">
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
            placeholder="Author"
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

          {/* Image Upload */}
          <div className="border p-4 rounded-lg bg-white">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef} // Ref for file input
              className="w-full p-2 border rounded-lg"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Content Editor */}
          <div className="border p-4 min-h-[400px] rounded-lg bg-white">
            <ReactQuill value={blog.content} onChange={handleEditorChange} className="w-full h-full" />
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded-lg ${
              uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-800"
            }`}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Submit Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}
