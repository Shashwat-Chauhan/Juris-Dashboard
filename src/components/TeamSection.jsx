  // eslint-disable-next-line no-unused-vars
  import React, { useEffect, useState } from 'react'
  import { db } from '../config/firebase.js'
  import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
  import PropTypes from 'prop-types';

  const TeamSection = ({ designation = "null", title = "null", collectionName = "null" }) => {
    const [team, setTeam] = useState([]);
    const teamCollectionRef = collection(db, `${collectionName}`);
    const [newEntryName, setNewEntryName] = useState("");
    const [newEntryImage, setNewEntryImage] = useState("");

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
    }, []); // Fetch data only on mount

    const handleDelete = async (id) => {
      await deleteDoc(doc(db, `${collectionName}`, id));
      setTeam(team.filter(member => member.id !== id));
    };

    const addEntry = async () => {
      try {
        await addDoc(teamCollectionRef, {
          name: newEntryName,
          image: newEntryImage, // Save image URL
          designation: designation,
        });
        setNewEntryName("");
        setNewEntryImage("");
        getTeam();
      } catch (err) {
        console.error("Error adding entry:", err);
      }
    };

    return (
      <div className="p-6 mb-20 flex flex-col items-center ">
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
              type="text" 
              placeholder="Image URL" 
              className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newEntryImage}
              onChange={(e) => setNewEntryImage(e.target.value)}
            />
            <button 
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={addEntry}
            >
              Add Member
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
                      src={member.image || "https://via.placeholder.com/100"} 
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
