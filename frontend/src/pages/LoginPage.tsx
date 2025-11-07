import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { useToast } from "../app/showToast";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {showToast} = useToast()
  const { loading, error, token ,user} = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) {
      showToast(`welcome!, ${user?.name} `, "success")
      navigate("/")};
  }, [token, navigate]);
   
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then(()=>{
      showToast(`Logged in successfully` , "success")
      navigate("/")
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8 sm:p-10 border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Please log in to continue to <span className="font-semibold">SlotSwapper</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
