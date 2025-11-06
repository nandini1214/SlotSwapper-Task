import React from "react";
import EventForm from "../components/EventForm";
import EventList from "../components/EventList";
import { useAppDispatch } from "../app/hook";
import { logout } from "../redux/slices/authSlice";
import { persistor } from "../redux/store";

const Dashboard: React.FC = () => {
    const dispatch =  useAppDispatch()
const handleLogout = () => {
    dispatch(logout());
    localStorage.clear(); // remove all keys (optional)
    persistor.purge(); // clear redux-persist storage
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
    
      <div className="max-w-3xl mx-auto">
        <button onClick={handleLogout}>LogOut</button>
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          My Calendar Dashboard
        </h1>
        <EventForm />
        <EventList />
      </div>
    </div>
  );
};

export default Dashboard;
