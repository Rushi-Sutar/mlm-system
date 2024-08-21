import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PasswordResetModal from "../components/PasswordResetModal"; // Adjust the import path as needed
import { useDispatch } from "react-redux";
import { signin } from "../actions/auth";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Designer } from "../assets";

const LoginCustomer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(""); // State for authentication error
  const [loading, setLoading] = useState(false); // State for loading
  const [showPassword, setShowPassword] = useState(false); // State for password visibility toggle
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = {};
    if (!formData.username) {
      errors.username = "Username is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true); // Show loader
      // Dispatch signin action and handle authentication
      const success = await dispatch(signin(formData, role, navigate));
      setLoading(false); // Hide loader
      if (!success) {
        setAuthError("Username or password is not correct");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="absolute w-full flex items-center justify-between mb-1 bg-white dark:bg-white p-2 md:p-4 shadow-md">
        <div className="flex items-center">
          <img
            src={Designer}
            alt="Logo"
            className="h-8 w-8 mr-2 rounded-full border border-gray-300"
          />
          <span className="text-xl text-zinc-800 dark:text-white font-bold">
            S1 Shoppy
          </span>
        </div>
        {/* <div className="flex items-center space-x-4">
          <NavLink
            to="/login"
            className="flex text-sm items-center justify-center px-3 py-2 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-md shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
          >
            <span>Admin Login</span>
          </NavLink>
        </div> */}
      </div>

      <div className="flex items-center justify-center h-screen bg-zinc-100 dark:bg-white px-4 overflow-hidden">
        <div className="flex flex-col items-center w-full max-w-md p-6 bg-white dark:bg-white shadow-md rounded">
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-zinc-700 dark:text-zinc-300 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 dark:bg-zinc-600 dark:text-zinc-200 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleChange}
                value={formData.username}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>
            <div className="mb-6">
              <label
                className="block text-zinc-700 dark:text-zinc-300 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 dark:bg-zinc-600 dark:text-zinc-200 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="**************"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div className="mb-2 text-red-500 text-sm">
              {authError && <span>{authError}</span>}
            </div>
            <div className="flex items-center mt-4 justify-between">
              <button
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                onClick={() => setRole("customer")}
                disabled={loading} // Disable button when loading
              >
                {loading ? <span>Loading...</span> : "Login"}
              </button>
              {/* <a
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="#"
                onClick={() => setIsModalOpen(true)}
              >
                Forgot Password?
              </a> */}
            </div>
          </form>
          {/* <p className="text-center text-zinc-500 text-xs mt-4">
            New user?{" "}
            <NavLink to="/signup">
              <span>Signup</span>
            </NavLink>
          </p> */}
        </div>
        {/* <PasswordResetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        /> */}
      </div>
    </div>
  );
};

export default LoginCustomer;
