import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import React from "react";

function ManageBlogs() {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null); // Track which blog is being edited
  const [editForm, setEditForm] = useState({ heading: "", subHeading: "", author: "" });

  // Fetch Blogs from Firestore
  const getBlogs = async () => {
    try {
      const collectionRef = collection(db, "blogs");
      const querySnapshot = await getDocs(collectionRef);
      const blogsData = querySnapshot.docs.map((doc) => {
        const blog = doc.data();
        return {
          id: doc.id,
          ...blog,
          date: blog.date?.toDate ? blog.date.toDate().toLocaleDateString() : "Unknown Date",
        };
      });
      setData(blogsData);
    } catch (error) {
      console.log("Error fetching blogs:", error);
    }
  };

  // Delete Blog from Firestore
  const deleteBlog = async (id) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      setData((prevData) => prevData.filter((blog) => blog.id !== id));
    } catch (error) {
      console.log("Error deleting blog:", error);
    }
  };

  // Enable Edit Mode
  const handleEdit = (blog) => {
    setEditId(blog.id);
    setEditForm({ heading: blog.heading, subHeading: blog.subHeading, author: blog.author });
  };

  // Handle Input Change in Edit Form
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Save Edited Blog to Firestore
  const saveEdit = async (id) => {
    try {
      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, {
        heading: editForm.heading,
        subHeading: editForm.subHeading,
        author: editForm.author,
      });

      // Update UI
      setData((prevData) =>
        prevData.map((blog) => (blog.id === id ? { ...blog, ...editForm } : blog))
      );

      setEditId(null); // Exit Edit Mode
    } catch (error) {
      console.log("Error updating blog:", error);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">Manage Blogs</h1>
      <div className="grid gap-4">
        {data.length > 0 ? (
          data.map((blog) => (
            <div key={blog.id} className="flex justify-between items-center p-4 rounded-lg shadow-md bg-white">
              {editId === blog.id ? (
                // Edit Mode
                <div className="flex-1">
                  <input
                    type="text"
                    name="heading"
                    value={editForm.heading}
                    onChange={handleChange}
                    className="w-full border p-2 mb-2 rounded"
                  />
                  <input
                    type="text"
                    name="subHeading"
                    value={editForm.subHeading}
                    onChange={handleChange}
                    className="w-full border p-2 mb-2 rounded"
                  />
                  <input
                    type="text"
                    name="author"
                    value={editForm.author}
                    onChange={handleChange}
                    className="w-full border p-2 mb-2 rounded"
                  />
                  <button onClick={() => saveEdit(blog.id)} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
                    Save
                  </button>
                  <button onClick={() => setEditId(null)} className="px-4 py-2 bg-gray-400 text-white rounded">
                    Cancel
                  </button>
                </div>
              ) : (
                // View Mode
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">{blog.heading}</h2>
                  <p className="text-black mt-2">{blog.subHeading}</p>
                  <p className="text-gray-600 mt-2">Author: {blog.author}</p>
                  <p className="text-sm text-gray-500 mt-2">Published on: {blog.date}</p>
                </div>
              )}

              <div className="flex gap-2">
                {editId !== blog.id && (
                  <button
                    onClick={() => handleEdit(blog)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteBlog(blog.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No blogs available</p>
        )}
      </div>
    </div>
  );
}

export default ManageBlogs;
