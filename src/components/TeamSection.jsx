import React, { useEffect, useRef, useState } from "react";
import { db } from "../config/firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import PropTypes from "prop-types";
import alt_image from "../assets/alt_image.png";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/desgwlbl9/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "tmpqjdfg"; // Found in Cloudinary settings

const TeamSection = ({ designation = "null", title = "null", collectionName = "null" }) => {
  const [team, setTeam] = useState([]);
  const teamCollectionRef = collection(db, `${collectionName}`);
  const [newEntryName, setNewEntryName] = useState("");
  const [newEntryImage, setNewEntryImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null); // ✅ Ref for the file input

  // Fetch Team Members
  const getTeam = async () => {
    try {
      const querySnapshot = await getDocs(teamCollectionRef);
      const teamData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTeam(teamData);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  useEffect(() => {
    getTeam();
  }, []);

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

  // Add Team Member
  const addEntry = async () => {
    if (!newEntryName || !newEntryImage) {
      alert("Please enter a name and select an image.");
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(newEntryImage);
      if (!imageUrl) {
        alert("Image upload failed.");
        return;
      }

      // Store Name, Image URL, and Designation in Firestore
      await addDoc(teamCollectionRef, {
        name: newEntryName,
        image: imageUrl,  // 🔥 Storing the Cloudinary Image URL in Firestore
        designation: designation,
      });

      setNewEntryName("");
      setNewEntryImage(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // ✅ Reset file input
      getTeam(); // Refresh team list
    } catch (err) {
      console.error("Error adding entry:", err);
    }
  };

  // Delete Team Member
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, `${collectionName}`, id));
    setTeam(team.filter((member) => member.id !== id));
  };

  return (
    <div className="p-6 mb-20 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-gray-50 p-6 shadow-lg rounded-2xl">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800">{title}</h1>

        {/* Input Fields */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <input
            type="text"
            placeholder="Enter Name"
            className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={newEntryName}
            onChange={(e) => setNewEntryName(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef} // ✅ Attach ref to input
            className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={(e) => setNewEntryImage(e.target.files[0])}
          />
          <button
            className={`w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold ${
              uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            } transition`}
            onClick={addEntry}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Add Member"}
          </button>
        </div>

        {/* Team List */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700">Current Team</h2>
          {team.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {team.map((member) => (
                <div key={member.id} className="bg-white p-4 shadow-md rounded-lg flex flex-col items-center">
                  <img
                    src={member.image || alt_image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
                  />
                  <p className="mt-3 text-gray-800 font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{designation}</p>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="mt-3 bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-3 text-center">No members added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

TeamSection.propTypes = {
  designation: PropTypes.string,
  title: PropTypes.string,
  collectionName: PropTypes.string,
};

export default TeamSection;
