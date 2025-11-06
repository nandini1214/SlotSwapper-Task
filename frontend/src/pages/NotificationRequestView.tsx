import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import {
  clearSwapStatus,
  fetchSwapRequests,
  respondSwapRequest,
} from "../redux/slices/swapSlice";

const NotificationsRequestsView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { requests, loading, error, success } = useAppSelector(
    (state) => state.swap
  );

  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming");

  // Fetch requests whenever the active tab changes
  useEffect(() => {
    dispatch(fetchSwapRequests(activeTab));
  }, [dispatch, activeTab]);

  // Auto-clear success/error messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => dispatch(clearSwapStatus()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleRespond = (requestId: number, accept: boolean) => {
    dispatch(respondSwapRequest({ request_id: requestId, accept }));
  };

  return (
   
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Notifications & Requests
        </h2>

        {/* Alerts */}
        {loading && <p className="text-blue-600 text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        {/* Tabs */}
        <div className="flex justify-center mb-6 border-b border-gray-200">
          {["incoming", "outgoing"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "incoming" | "outgoing")}
              className={`px-6 py-3 text-sm font-medium transition-all duration-200 
                ${
                  activeTab === tab
                    ? "border-b-4 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-blue-500"
                }`}
            >
              {tab === "incoming" ? "Received Requests" : "Sent Requests"}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No {activeTab === "incoming" ? "received" : "sent"} requests yet.
            </p>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md bg-gray-50 transition"
              >
                <div className="flex-1">
                  {activeTab === "incoming" ? (
                    <>
                      <p className="text-gray-800">
                        <span className="font-semibold">From:</span> User{" "}
                        {req.requester_id}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Their Slot:</span>{" "}
                        {req.their_slot_id} → <span className="font-semibold">Your Slot:</span>{" "}
                        {req.my_slot_id}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-800">
                        <span className="font-semibold">To:</span> User{" "}
                        {req.receiver_id}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Your Slot:</span>{" "}
                        {req.my_slot_id} → <span className="font-semibold">Their Slot:</span>{" "}
                        {req.their_slot_id}
                      </p>
                    </>
                  )}
                </div>

                {/* Status or Actions */}
                <div className="mt-4 sm:mt-0 sm:ml-6 flex space-x-3">
                  {activeTab === "incoming" && req.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleRespond(req.id, true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(req.id, false)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        req.status === "ACCEPTED"
                          ? "bg-green-100 text-green-700"
                          : req.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
  
  );
};

export default NotificationsRequestsView;
