import React from "react";
import EventForm from "../components/EventForm";
import EventList from "../components/EventList";

const Dashboard: React.FC = () => {
  return (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          📅 My Calendar Dashboard
        </h1>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
            
            <EventForm />
          <EventList />
          
        </div>
      </div>
    
  );
};

export default Dashboard;
