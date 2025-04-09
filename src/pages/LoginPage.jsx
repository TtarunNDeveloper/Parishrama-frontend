import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic
      try {
        const response = await axios.post(`${process.env.REACT_APP_URL}/api/user/login`, {
          phonenumber: phone,
          password
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.data.user.role);
        
        setMessage({ text: "Login Successful!", type: "success" });
        setTimeout(() => navigate("/home"), 1500);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Login failed";
        setMessage({ text: errorMessage, type: "error" });
      }
    } else {
      // Signup logic
      if (password !== confirmPassword) {
        setMessage({ text: "Passwords don't match", type: "error" });
        return;
      }

      if (!/^\d{10}$/.test(phone)) {
        setMessage({ text: "Please enter a valid 10-digit phone number", type: "error" });
        return;
      }

      try {
        await axios.post(`${process.env.REACT_APP_URL}/api/user/signup`, {
          phonenumber: phone,
          password,
          role: "staff" // Default role for new signups
        });

        setMessage({ 
          text: "Registration successful! Contact admin for approval.", 
          type: "success" 
        });
        setIsLogin(true); // Switch back to login after successful registration
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Registration failed";
        setMessage({ text: errorMessage, type: "error" });
      }
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-gray-900">
        <img src={logo} alt="Parishrama Neet Academy Logo" className="mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {message.text && (
          <div className={`text-center p-2 mb-4 rounded ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Phone Number</label>
            <input
              type="tel"
              className="w-full p-2 rounded bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              pattern="\d{10}"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength="6"
            />
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 rounded bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                minLength="6"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 p-2 rounded font-bold text-white mb-4"
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage({ text: "", type: "" });
            }}
            className="w-full text-orange-500 hover:text-orange-700 p-2 rounded font-bold"
          >
            {isLogin ? "Need an account? Register" : "Already have an account? Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;