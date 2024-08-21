import React from 'react';
import { useDispatch } from 'react-redux';
import { signout } from '../actions/auth';
import { useNavigate } from 'react-router-dom';
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaBars } from "react-icons/fa";
// import UserInfo from './profile/UpdateUserProfile';
import UserProfile from './profile/UserProfile';
import { Designer } from '../assets';

const Header = ({ toggleMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 shadow-md">
      <div className="max-w-7xl mx-auto sm:px-6 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="lg:hidden text-zinc-800 dark:text-white mr-2"
              onClick={toggleMenu}
            >
              <FaBars size={24} />
            </button>
            <img src={Designer} alt="Logo" className="h-8 w-8 mr-4 rounded-full border border-gray-300" />
            <span className="text-xl text-zinc-800 dark:text-white font-bold">S1 Shoppy</span>
          </div>
          {/* <button
            // onClick={() => dispatch(signout(navigate))}
            className="bg-red-500 text-white font-bold  px-3 py-2 rounded inline-flex items-center transition-all hover:bg-red-600 hover:text-white"
          >
            <RiLogoutBoxRLine />
            
          </button> */}
          <UserProfile/>
        </div>
      </div>
    </div>
  );
};


export default Header;
