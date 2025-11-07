
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";

import Marketplace from "./pages/MarketPlace";
import NotificationsRequestsView from "./pages/NotificationRequestView";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import { Toaster } from "react-hot-toast";

function App() {
  console.log(localStorage.getItem("access_token"))

  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="requests" element={<NotificationsRequestsView />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Register/>}/>
      </Routes>
    
     <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: { background: "#D1FAE5", color: "#065F46" },
          },
          error: {
            style: { background: "#FEE2E2", color: "#991B1B" },
          },
        }}
      />
    </BrowserRouter>
    
  )
  
  
}

export default App;
