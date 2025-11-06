import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import {
  createSwapRequest,
  fetchSwappableSlots,
} from "../redux/slices/swapSlice";
import { fetchEvents } from "../redux/slices/eventSlice";

const Marketplace = () => {
  const dispatch = useAppDispatch();
  const { swappableSlots, loading: slotsLoading } = useAppSelector(
    (state) => state.swap
  );
  const { events, loading: eventsLoading } = useAppSelector(
    (state) => state.event
  );

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch all available swappable slots on mount
  useEffect(() => {
    dispatch(fetchSwappableSlots());
  }, [dispatch]);

  // Handle swap request button
  const handleRequestSwap = (slotId: number) => {
    setSelectedSlot(slotId);
    dispatch(fetchEvents()); // Fetch the user's events dynamically
    setModalOpen(true);
  };

  // Handle when user picks their own slot to offer
  const handleSelectMySlot = (mySlotId: number) => {
    if (!selectedSlot) return;
    dispatch(
      createSwapRequest({
        my_slot_id: mySlotId,
        their_slot_id: selectedSlot,
      })
    );
    setModalOpen(false);
  };

  if (slotsLoading) {
    return <div className="text-center mt-10 text-lg">Loading available slots...</div>;
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Render available swappable slots */}
      {swappableSlots.length === 0 ? (
        <p className="text-gray-600 text-center col-span-full">
          No available slots for swapping.
        </p>
      ) : (
        swappableSlots.map((slot) => (
          <div
            key={slot.id}
            className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <p className="text-gray-800">
              <b>Time:</b> {slot.start_time}
            </p>
            <p className="text-gray-800">
              <b>Status:</b> {slot.status}
            </p>
            <p className="text-gray-800">
              <b>Title:</b> {slot.title || "Untitled"}
            </p>
            <button
              onClick={() => handleRequestSwap(slot.id)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Request Swap
            </button>
          </div>
        ))
      )}

      {/* Modal to select user's own slot */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              Select Your Slot to Offer
            </h2>

            {eventsLoading ? (
              <p className="text-gray-600 text-sm">Loading your events...</p>
            ) : events.length === 0 ? (
              <p className="text-gray-600 text-sm">
                You have no available swappable events.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleSelectMySlot(event.id)}
                    className="w-full border p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-left"
                  >
                    <p className="font-medium">
                      {new Date(event.start_time).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{event.status}</p>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
