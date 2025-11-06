import React, { useEffect, useState } from "react";
import { createEvent, fetchEvents } from "../redux/slices/eventSlice";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { fetchCurrentUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, FileText } from "lucide-react"; // lucide-react for icons

const EventForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    dispatch(fetchCurrentUser());
  }, [token, dispatch, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !startTime || !endTime) {
      alert("Please fill in all fields!");
      return;
    }

    setSubmitting(true);
    await dispatch(
      createEvent({
        title,
        start_time: startTime,
        end_time: endTime,
        status: "BUSY",
      })
    );
    dispatch(fetchEvents());
    setSubmitting(false);
    setTitle("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-100 transition-all hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-blue-600" />
        Create a New Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
            <FileText className="w-4 h-4 text-blue-500" />
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Team Meeting"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
            <Clock className="w-4 h-4 text-green-500" />
            Start Time
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
            <Clock className="w-4 h-4 text-red-500" />
            End Time
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
            submitting
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
          }`}
        >
          {submitting ? "Creating Event..." : "Add Event"}
        </button>
      </form>
    </div>
  );
};

export default EventForm;
