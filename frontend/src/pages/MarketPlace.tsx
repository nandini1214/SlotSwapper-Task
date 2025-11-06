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

  // Fetch swappable slots on mount
  useEffect(() => {
    dispatch(fetchSwappableSlots());
  }, [dispatch]);

  // Request swap
  const handleRequestSwap = (slotId: number) => {
    setSelectedSlot(slotId);
    dispatch(fetchEvents());
    setModalOpen(true);
  };

  // Select user slot
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

  return (
    <div >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Slot Marketplace
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Browse available slots and request a swap instantly ✨
        </p>

        {/* Loading state */}
        {slotsLoading ? (
          <div className="text-center text-lg text-gray-700 mt-10 animate-pulse">
            Loading available slots...
          </div>
        ) : swappableSlots.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-2xl mb-2">😔</p>
            <p>No available slots for swapping right now.</p>
          </div>
        ) : (
          // Slots Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {swappableSlots.map((slot) => (
              <div
                key={slot.id}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-[1.02] transition-transform duration-200"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {slot.title || "Untitled Event"}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  <b>Time:</b> {new Date(slot.start_time).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <b>Status:</b> {slot.status}
                </p>
                <button
                  onClick={() => handleRequestSwap(slot.id)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Request Swap
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 text-center">
              Select Your Slot to Offer
            </h2>

            {eventsLoading ? (
              <p className="text-center text-gray-600">Loading your events...</p>
            ) : events.length === 0 ? (
              <p className="text-center text-gray-600">
                You have no available events to swap.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleSelectMySlot(event.id)}
                    className="w-full border border-gray-200 p-3 rounded-lg text-left hover:bg-blue-50 transition-colors"
                  >
                    <p className="font-medium text-gray-800">
                      {new Date(event.start_time).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{event.status}</p>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setModalOpen(false)}
              className="mt-5 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-colors"
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
