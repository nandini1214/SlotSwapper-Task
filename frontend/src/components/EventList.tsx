import React, { useEffect } from "react";

import {
  
  deleteEvent,
  updateEvent,
  fetchEvents,
} from "../redux/slices/eventSlice";
import { useAppDispatch, useAppSelector } from "../app/hook";

const EventList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  if (loading) return <p>Loading events...</p>;

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteEvent(id));
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

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">My Events</h2>
      {events.length === 0 ? (
        <p className="text-gray-500">No events found.</p>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(event.start_time).toLocaleString()} →{" "}
                  {new Date(event.end_time).toLocaleString()}
                </p>
                <span
                  className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                    event.status === "BUSY"
                      ? "bg-red-200 text-red-700"
                      : event.status === "SWAPPABLE"
                      ? "bg-green-200 text-green-700"
                      : "bg-yellow-200 text-yellow-700"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(event)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  {event.status === "BUSY"
                    ? "Make Swappable"
                    : "Mark Busy"}
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
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
