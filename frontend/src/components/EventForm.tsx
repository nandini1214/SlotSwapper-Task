import React, { useEffect, useState } from "react";

import { createEvent, fetchEvents } from "../redux/slices/eventSlice";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { fetchCurrentUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const EventForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const {user,token} = useAppSelector((state)=>state.auth)
  const navigate = useNavigate()
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  useEffect(()=>{
    if(!token){
        alert("please login first")
        navigate("/login")
        return
    }
    dispatch(fetchCurrentUser())
  },[token,dispatch,navigate])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !startTime || !endTime) {
      alert("Please fill in all fields!");
      return;
    }

    await dispatch(
      createEvent({
        title,
        start_time: startTime,
        end_time: endTime,
        status: "BUSY",
      })
    );

    // Refresh events after creating
    dispatch(fetchEvents());

    setTitle("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Create Event</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
        >
          Add Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
