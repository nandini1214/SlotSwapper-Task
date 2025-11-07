import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import {
  createSwapRequest,
  fetchSwappableSlots,
} from "../redux/slices/swapSlice";
import { fetchEvents } from "../redux/slices/eventSlice";
import { Calendar, Loader2, AlertCircle, CalendarX2 } from "lucide-react";
import { useToast } from "../app/showToast";
import toast from "react-hot-toast";

const Marketplace = () => {
  const dispatch = useAppDispatch();
  const {showToast} = useToast();
  const {
    swappableSlots,
    loading: slotsLoading,
    error,
  } = useAppSelector((state) => state.swap);
  const { events, loading: eventsLoading } = useAppSelector(
    (state) => state.event
  );

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSwappableSlots());
  }, [dispatch]);

 const handleRequestSwap = async (slotId: number) => {
    setSelectedSlot(slotId);
    showToast("Fetching your available events...", "loading"); 

    try {
      await dispatch(fetchEvents()).unwrap(); 
      toast.dismiss(); 
      showToast("Events loaded successfully 🎉", "success");
      setModalOpen(true);
    } catch (err) {
      toast.dismiss();
      showToast("Failed to load your events. Please try again.", "error");
    }
  };

  const handleSelectMySlot = (mySlotId: number) => {
    if (!selectedSlot) return;
    dispatch(
      createSwapRequest({ my_slot_id: mySlotId, their_slot_id: selectedSlot })
    );
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
        {slotsLoading && (
          <div className="flex justify-center items-center mt-20 text-gray-600">
            <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading available
            slots...
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center text-gray-600 mt-20 space-y-3">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="text-lg font-medium">{error}</p>
          </div>
        )}

        {!slotsLoading && !error && swappableSlots.length === 0 && (
          <div className="flex flex-col items-center justify-center text-gray-600 mt-20 space-y-3">
            <CalendarX2 className="w-10 h-10 text-gray-400" />
            <p>No available slots right now.</p>
          </div>
        )}

        {!slotsLoading && !error && swappableSlots.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {swappableSlots.map((slot) => (
              <div
                key={slot.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {slot.title || "Untitled Event"}
                </h3>
                <p className="text-gray-600 text-sm mb-1">
                  <b>Starts:</b> {new Date(slot.start_time).toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm">
                  <b>Status:</b> {slot.status}
                </p>
                <button
                  onClick={() => handleRequestSwap(slot.id)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
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

            {eventsLoading && (
              <div className="text-center text-gray-600 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading your
                events...
              </div>
            )}
            {events.length === 0 && (
              <p className="text-center text-gray-600">
                You have no available events to swap.
              </p>
            )}
            {!eventsLoading && events.length > 0 && (
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
