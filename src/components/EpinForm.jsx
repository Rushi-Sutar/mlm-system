import React, { useEffect, useState } from "react";
import { addEPins, fetchPins } from "../actions/ePin";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "../actions/auth";
import { useNavigate } from "react-router-dom";
import Loader from "./report/Loader";
import { getAllCustomers } from "../actions/allCustomers";

const EpinForm = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adminUsername = useSelector((state)=> state?.auth?.authData?.admin?.username || "")
  const userRole = useSelector((state) => state.auth.userRole);
  const epinAdded = useSelector((state) => state.epins.epin_added);
  const adminId = useSelector((state)=> state.auth.authData.admin?.adminid)
  const customerUsername = useSelector((state)=> state.auth.authData.customer?.username)
  const ePins = useSelector((state)=> state.epins.epins)
  const [submitStatus, setSubmitStatus] = useState(null);
  const usernameData = useSelector((state)=> state.allCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [filteredUsernames, setFilteredUsernames] = useState(usernameData);
  const [showDropdown, setShowDropdown] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    amount_received: "",
    count_of_pins: "",
    discount: "",
    validity_months: "",
    customer_id: "",
    admin_username: adminUsername
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSubmitStatus(null); // Reset submit status when modal closes
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setFormData({...formData, username: value });

    if (value.length > 0) {
      const filtered = usernameData.filter((user) =>
        user.username.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsernames(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (username) => {
    setFormData({...formData, username });
    setShowDropdown(false);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
       let a = dispatch(addEPins(formData, navigate));
      //  dispatch(signin(formData, role, navigate));
      setFormData({
        // Reset form fields
        username: "",
        amount_received: "",
        count_of_pins: "",
        discount: "",
        validity_months: "",
        customer_id: "",
        admin_username:adminUsername
      });
      setTimeout(()=>{
        dispatch({ type: 'CLEAR_EPINS_SUCCESS'})
      },6000)
    } catch (error) {
      console.error("Error adding ePin:", error);
      setSubmitStatus("failure");
    }
  };

  const { pins, amount_received, expiry_date, status,used_pins } = ePins;
  useEffect(() => {
    let userName = userRole && userRole == "admin" && adminUsername || customerUsername
    dispatch(fetchPins(userName)); //customerId
    dispatch(getAllCustomers());
  }, [dispatch])

  return (
    <div className="p-4 bg-zinc-50 h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">E-PIN</h1>
        {userRole && userRole == "admin" && (
          <button
            className="bg-purple-500 hover:bg-purple-800 text-white py-2 px-4 rounded-lg"
            onClick={openModal}
            style={{ background: "#3AA6B9" }}
          >
            + Add E-pin
          </button>
        )}
      </div>
      {Object.keys(ePins).length > 0 ? (
        <div className="overflow-x-auto max-h-[75vh]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th> */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Username
                </th>
                {/* <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              E-Pin Count
            </th> */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Pins
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Used Pins
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Expiry Date
                </th>
                {/* <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ePins && ePins.length > 0 ? (
                ePins.map((detail, index) => {
                  const maxPins = Math.max(
                    detail.pins.length,
                    detail.used_pins.length
                  );
                  return Array.from({ length: maxPins }).map((_, pinIndex) => (
                    <tr
                      key={`row-${index}-pin-${pinIndex}`}
                      className="border-b border-zinc-200 dark:border-zinc-600"
                    >
                      <td className="px-6 py-4 text-sm">{detail.username}</td>
                      {/* <td className="px-6 py-4 text-sm">{detail.count_of_pins}</td> */}
                      <td className="px-6 py-4 text-sm">
                        {detail.pins[pinIndex] || ""}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-500">
                        {detail.used_pins[pinIndex] || ""}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {detail.amount_received}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(detail.expiry_date).toLocaleDateString()}
                      </td>
                      {/* <td className="px-6 py-4 text-sm">{detail.Status}</td> */}
                    </tr>
                  ));
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No E-pins found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <Loader />
      )}

      {isModalOpen && (
        <div
          id="epinModal"
          className="fixed inset-0 bg-zinc-600 bg-opacity-50 flex items-center justify-center"
        >
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-lg max-w-md w-full mx-4 sm:max-w-lg md:max-w-sm">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Add New E-Pin</h2>
              <button
                id="closeModalBtn"
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-2xl font-bold"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <form className="text-sm" onSubmit={handleSubmit}>
              <div className="mb-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    className="block w-full p-2 border border-zinc-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropdown(true)}
                  />
                  {showDropdown && filteredUsernames.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none sm:text-sm">
                      {filteredUsernames.map((user) => (
                        <li
                          key={user.id}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white"
                          onClick={() => handleSelect(user.username)}
                        >
                          {user.username}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <label
                  className="block text-zinc-700 dark:text-zinc-300 mb-1"
                  htmlFor="count_of_pins"
                >
                  E-Pin Count <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full p-1 border border-zinc-300 rounded-lg dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
                  type="text"
                  id="count_of_pins"
                  name="count_of_pins"
                  placeholder="E-Pin Count"
                  required
                  value={formData.count_of_pins}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label
                  className="block text-zinc-700 dark:text-zinc-300 mb-1"
                  htmlFor="amount_received"
                >
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    id="amount_received"
                    name="amount_received"
                    placeholder="Amount"
                    className="block w-full p-2 border border-zinc-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white"
                    required
                    value={formData.amount_received}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-2">
                <label
                  className="block text-zinc-700 dark:text-zinc-300 mb-1"
                  htmlFor="discount"
                >
                  Discount <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full p-1 border border-zinc-300 rounded-lg dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
                  type="text"
                  id="discount"
                  name="discount"
                  placeholder="Discount"
                  required
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label
                  className="block text-zinc-700 dark:text-zinc-300 mb-1"
                  htmlFor="validity_months"
                >
                  Validity (in months) <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full p-1 border border-zinc-300 rounded-lg dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
                  type="number"
                  id="validity_months"
                  name="validity_months"
                  required
                  value={formData.validity_months}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label
                  className="block text-zinc-700 dark:text-zinc-300 mb-1"
                  htmlFor="customer_id"
                >
                  Employee Code <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full p-1 border border-zinc-300 rounded-lg dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
                  type="text"
                  id="customer_id"
                  name="customer_id"
                  placeholder="Employee Code"
                  required
                  value={formData.customer_id}
                  onChange={handleChange}
                />
              </div>
              <button
                className="mt-4 bg-purple-600 text-white p-2 rounded-lg w-full"
                style={{ background: "#3AA6B9" }}
                type="submit"
              >
                Save
              </button>
              {/* Display success or failure message */}
              {epinAdded && Object.keys(epinAdded).length > 0 && (
                <span className="text-green-500 block mt-2">
                  Epin added successfully
                </span>
              )}
              {submitStatus === "failure" && (
                <span className="text-red-500 block mt-2">Cannot add Epin</span>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Popup for multiple selection */}
      {isPopupVisible && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white rounded-lg p-4 flex items-center space-x-4 shadow-lg">
          <div>1 item selected</div>
          <div>
            <button className="bg-black text-white px-4 py-2 rounded-md mr-2">
              Block
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpinForm;

