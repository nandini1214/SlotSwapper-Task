import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { clearSwapStatus, fetchSwapRequests, respondSwapRequest } from "../redux/slices/swapSlice";

const NotificationsRequestsView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { requests, loading, error, success } = useAppSelector(
    (state) => state.swap
  );

  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming");

  // Fetch requests whenever the active tab changes
  useEffect(() => {
    dispatch(fetchSwapRequests( activeTab ));
  }, [dispatch, activeTab]);

  // Clear success/error messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => dispatch(clearSwapStatus()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleRespond = (requestId: number, accept: boolean) => {
    dispatch(respondSwapRequest({ request_id: requestId, accept }));
  };

  // Determine which list to display based on the active tab
//   const displayedRequests = activeTab === "incoming" ? incomingRequests : outgoingRequests;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Notifications / Requests</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-3 py-1 rounded ${activeTab === "incoming" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("incoming")}
        >
          Received Requests
        </button>
        <button
          className={`px-3 py-1 rounded ${activeTab === "outgoing" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("outgoing")}
        >
          Sent Requests
        </button>
      </div>

      {/* Requests List */}
      <div>
        {requests.length === 0 ? (
          <p>No {activeTab === "incoming" ? "received" : "sent"} requests</p>
        ) : (
          <ul className="space-y-2">
            {requests.map((req) => (
              <li
                key={req.id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  {activeTab === "incoming" ? (
                    <>
                      <p>
                        From User {req.requester_id} – Swap their slot {req.their_slot_id} with your slot {req.my_slot_id}
                      </p>
                      <p>Status: {req.status}</p>
                    </>
                  ) : (
                    <>
                      <p>
                        To User {req.receiver_id} – Swap your slot {req.my_slot_id} with their slot {req.their_slot_id}
                      </p>
                      <p>{req.status === "pending" ? "Pending..." : req.status}</p>
                    </>
                  )}
                </div>

                {/* Only show buttons for incoming requests */}
                {(activeTab === "incoming" && req.status == "PENDING" ) ? (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleRespond(req.id, true)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(req.id, false)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                ):(
                    <button 
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    
                    >
                        ACCEPTED
                    </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsRequestsView;
