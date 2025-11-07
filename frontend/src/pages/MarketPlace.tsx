import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { createSwapRequest, fetchSwappableSlots } from "../redux/slices/swapSlice";
import { fetchEvents } from "../redux/slices/eventSlice";
import { Calendar, Clock, User2, Loader2 } from "lucide-react";

const Marketplace = () => {
  const dispatch = useAppDispatch();
  const { swappableSlots, loading: slotsLoading } = useAppSelector((state) => state.swap);
  const { events, loading: eventsLoading } = useAppSelector((state) => state.event);

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSwappableSlots());
  }, [dispatch]);

  const handleRequestSwap = (slotId: number) => {
    setSelectedSlot(slotId);
    dispatch(fetchEvents());
    setModalOpen(true);
  };

  const handleSelectMySlot = (mySlotId: number) => {
    if (!selectedSlot) return;
    dispatch(createSwapRequest({ my_slot_id: mySlotId, their_slot_id: selectedSlot }));
    setModalOpen(false);
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-700 flex items-center justify-center gap-2">
            <Calendar className="w-8 h-8 text-blue-600" /> Slot Marketplace
          </h1>
          <p className="text-gray-600 mt-2">
            Browse available slots and request a swap instantly ✨
          </p>
        </div>

        {/* Loading / Empty / Grid */}
        {slotsLoading ? (
          <div className="flex justify-center items-center mt-20 text-gray-600">
            <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading available slots...
          </div>
        ) : swappableSlots.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-5xl mb-4">😔</p>
            <p className="text-lg">No available slots for swapping right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {swappableSlots.map((slot) => (
              <div
                key={slot.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all p-6"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {slot.title || "Untitled Event"}
                </h2>

                <div className="text-sm text-gray-700 space-y-1">
                  <p className="flex items-center gap-2">
                    <User2 className="w-4 h-4 text-blue-600" />
                    <b>Hosted by:</b> {slot.user?.name || "Unknown"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <b>Time:</b> {new Date(slot.start_time).toLocaleString()}
                  </p>
                  <p>
                    <b>Status:</b> <span className="text-blue-600">{slot.status}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleRequestSwap(slot.id)}
                  className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  Request Swap
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Swap Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 text-center">
              Select Your Slot to Offer
            </h2>

            {eventsLoading ? (
              <div className="text-center text-gray-600 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading your events...
              </div>
            ) : events.length === 0 ? (
              <p className="text-center text-gray-600">
                You have no available events to swap.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleSelectMySlot(event.id)}
                    className="w-full border border-gray-200 p-3 rounded-lg text-left hover:bg-blue-50 transition-colors"
                  >
                    <p className="font-medium text-gray-800">
                      {event.title || "Untitled Event"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.start_time).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{event.status}</p>
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
