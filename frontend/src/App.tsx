
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Marketplace from "./pages/MarketPlace";
import NotificationsRequestsView from "./pages/NotificationRequestView";

function App() {
  console.log(localStorage.getItem("access_token"))

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<Register/>}/>
        <Route path="/market" element={<Marketplace/>}/>
        <Route path="/notification" element={<NotificationsRequestsView/>}/>
      </Routes>
     
    </BrowserRouter>
  )
  
  
}

export default App;
