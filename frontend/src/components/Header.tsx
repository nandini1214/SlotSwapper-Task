import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hook";
import { logout } from "../redux/slices/authSlice";
import { persistor } from "../redux/store";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    persistor.purge();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-bold text-blue-700">
          SlotSwapper
        </Link>
        <nav className="flex items-center gap-6">
         
          <Link
            to="/marketplace"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Marketplace
          </Link>
          <Link
            to="/requests"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Requests
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Log Out
          </button>
          
        </nav>
      </div>
    </header>
  );
};

export default Header;
