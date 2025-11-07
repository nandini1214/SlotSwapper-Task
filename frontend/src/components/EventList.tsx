import React, { useEffect } from "react";
import { deleteEvent, updateEvent, fetchEvents } from "../redux/slices/eventSlice";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { CalendarDays, Trash2, RefreshCcw, Clock } from "lucide-react";
import Swal from "sweetalert2";

const EventList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
        title: "Are you sure , you want to delete?",
        text: "You won't be able to undo this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d3311fff",
        cancelButtonColor: "#99a0aaff",
        confirmButtonText: "Yes, Delete",
      });
    
      if (result.isConfirmed) {
          dispatch(deleteEvent(id)).then(()=>{
           Swal.fire("Deleted", "Your Event Got deleted", "success");
          });
       

      }
   
  };

  const toggleStatus = (event: any) => {
    const newStatus = event.status === "BUSY" ? "SWAPPABLE" : "BUSY";
    dispatch(
      updateEvent({
        id: event.id,
        title: event.title,
        start_time: event.start_time,
        end_time: event.end_time,
        status: newStatus,
      })
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-600">
        <Clock className="w-5 h-5 mr-2 animate-spin text-blue-500" />
        Loading events...
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-blue-600" />
          My Events
        </h2>
        <button
          onClick={() => dispatch(fetchEvents())}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {events?.length === 0 ? (
        <p className="text-gray-500 text-center py-6">
          No events found. Create one to get started!
        </p>
      ) : (
        <ul className="space-y-4">
          {events?.map((event) => (
            <li
              key={event.id}
              className="flex flex-col sm:flex-row justify-between sm:items-center border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all bg-gray-50"
            >
              {/* Left side: Event Info */}
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {event.title || "Untitled Event"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(event.start_time).toLocaleString()} →{" "}
                  {new Date(event.end_time).toLocaleString()}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                    event.status === "BUSY"
                      ? "bg-red-100 text-red-700"
                      : event.status === "SWAPPABLE"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              {/* Right side: Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
                <button
                  onClick={() => toggleStatus(event)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    event.status === "BUSY"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }`}
                >
                  {event.status === "BUSY" ? "Make Swappable" : "Mark Busy"}
                </button>

                <button
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
