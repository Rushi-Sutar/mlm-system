import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../actions/auth";
import { useNavigate } from "react-router-dom";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { IoPersonSharp } from "react-icons/io5";
import { person_icon } from "../../assets";

const UserInfo = () => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const userRole = useSelector((state) => state.auth.userRole);

  const handleProfileClick = () => {
    navigate('/userprofile');
  };

  const handleToggle = () => {
    setIsHovered((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsHovered(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div
        className="flex items-center cursor-pointer px-4"
        onClick={handleToggle}
      >
        <img
          src={person_icon}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-bold px-2">Profile</span>
      </div>
      {isHovered && (
        <div
          className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-300 shadow-lg rounded w-48"
          style={{"zIndex":"9999999"}}
          onClick={handleToggle} // Added to close the dropdown on click
        >
          {userRole === "admin" && (
            <>
              {/* <div className="py-1 cursor-pointer hover:bg-gray-100 w-full block">
                <button
                  className="rounded inline-flex items-center w-full"
                  onClick={handleProfileClick}
                >
                  <span className="px-2">
                    <IoPersonSharp />
                  </span>
                  Profile
                </button>
              </div>
              <hr className="my-2 border-gray-300" /> */}
              <div className="py-1 cursor-pointer hover:bg-gray-100 w-full block">
                <button
                  onClick={() => dispatch(signout(navigate))}
                  className="text-red-500 font-bold cursor-pointer rounded inline-flex items-center w-full"
                >
                  <span className="px-2">
                    <LiaSignOutAltSolid />
                  </span>
                  Logout
                </button>
              </div>
            </>
          )}
          {userRole === "customer" && (
            <>
              <div className="py-1 cursor-pointer hover:bg-gray-100 w-full block">
                <button
                  className="rounded inline-flex items-center w-full"
                  onClick={handleProfileClick}
                >
                  <span className="px-2">
                    <IoPersonSharp />
                  </span>
                  Profile
                </button>
              </div>
              <hr className="my-2 border-gray-300" />
              <div className="py-1 cursor-pointer hover:bg-gray-100 w-full block">
                <button
                  onClick={() => dispatch(signout(navigate))}
                  className="text-red-500 font-bold cursor-pointer rounded inline-flex items-center w-full"
                >
                  <span className="px-2">
                    <LiaSignOutAltSolid />
                  </span>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserInfo;
