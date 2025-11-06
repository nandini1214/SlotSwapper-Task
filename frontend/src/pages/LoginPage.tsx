import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hook";


export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  console.log(token)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password);
    dispatch(loginUser({ email, password })).then(()=> navigate("/"))
      
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
        />
<p className="text-red-500">
  {typeof error === "string" ? error : JSON.stringify(error)}
</p>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
