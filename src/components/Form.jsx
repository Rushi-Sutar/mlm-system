import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { imageUpload, registerCustomer } from "../actions/auth";
import products from "../reducers/products";
import { useNavigate } from "react-router-dom";
import { addProduct, productList } from "../actions/products";
import * as api from "../api";
import "../App.css";
import "../index.css";
import { fetchPins } from "../actions/ePin";
import Loader from "./report/Loader";
import { sendEmail } from "../actions/sendEmail";
import { getUploadImageDetails } from "../actions/imageDetails";

function Form() {
  let user = JSON.parse(localStorage.getItem("user"));
  const userRole = useSelector((state) => state.auth.userRole);
  let id = "";
  let sponserUsername = "";
  let sponserName = "";
  if (userRole && userRole === "admin") {
    id = useSelector((state) => state.auth.authData.admin?.adminid);
    sponserUsername = useSelector(
      (state) => state.auth.authData.admin?.username
    );
    sponserName = useSelector(
      (state) =>
        state.auth.authData.admin?.first_name +
        " " +
        state.auth.authData.admin?.last_name
    );
  } else if (userRole && userRole === "customer") {
    id = useSelector((state) => state.auth.authData.customer?.id);
    sponserUsername = useSelector(
      (state) => state.auth.authData.customer?.username
    );
    sponserName = useSelector(
      (state) =>
        state.auth.authData.customer?.first_name +
        " " +
        state.auth.authData.customer?.last_name
    );
  }

  const initialState = {
    sponsererid: (user && id) || "",
    adminid: (userRole == "admin" ? id : user?.customer?.adminid) || "",
    sponserer_username: (user && sponserUsername) || "",
    sponserer_name: (user && sponserName) || "",
    product_id: "",
    acceptTerms: false,
    first_name: "",
    last_name: "",
    date: "",
    gender: "",
    email: "",
    mobileNo: "",
    aadhar_card_no: "",
    pan_card_no: "",
    aadhar_image_link: "HARDCODED",
    pan_image_link: "HARDCODED",
    bank_name: "",
    account_no: "",
    ifsc_code: "",
    branch_name: "",
    username: "",
    password: "",
    confirmPassword: "",
    pindetails: {
      id: "",
      username: "",
      registrationpin: "",
    },
    address: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState({
    aadhar_image_link: null,
    pan_image_link: null,
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [isValid, setIsValid] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customer = useSelector((state) => state.registerCustomer);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [failedMsg, setFailedMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const allProducts = useSelector((state) => state.products.allProducts);
  const ePins = useSelector((state) => state.epins.epins);
  const adminId = useSelector((state) => state.auth.authData.admin?.adminid);
  const customerUsername = useSelector(
    (state) => state.auth.authData.customer?.username
  );
  const { pins, amount_received, expiry_date, status } = ePins;
  let pinId = ePins[0]?.id;

  const [selectedOptionKey, setSelectedOptionKey] = useState("");

  const handleSelectChange = (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const keyAttribute = selectedOption.getAttribute("data-key");
    const keyUsername = selectedOption.getAttribute("data-username");
    const value = event.target.value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      pindetails: {
        ...prevFormData.pindetails,
        id: keyAttribute,
        registrationpin: value,
        username: keyUsername,
      },
    }));
  };

  useEffect(() => {
    dispatch(fetchPins(sponserUsername));
  }, [dispatch]);

  useEffect(() => {
    dispatch(productList(navigate));
  }, [dispatch]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const { name } = event.target;
      setImageFile((prevFormData) => ({
        ...prevFormData,
        [name]: file,
      }));
    }
  };
  const handleChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    const [section, key] = name.split(".");

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);

    if (section && key) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [section]: {
          ...prevFormData[section],
          [key]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    // Clear the error for the current field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateFirst = () => {
    const newErrors = {};
    if (!formData.sponserer_name.trim()) {
      newErrors.sponserer_name = "Sponsor Full Name is required";
    }
    if (!formData.product_id) {
      newErrors.product_id = "Please select a product";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const validateSecond = () => {
    const newErrors = {};
    const mobileNoWithoutSpaces = formData.mobileNo.replace(/\s+/g, "");

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First Name is required";
    } else if (formData.first_name.length < 3) {
      newErrors.first_name = "First Name must be at least 3 characters long";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last Name is required";
    } else if (formData.last_name.length < 3) {
      newErrors.last_name = "Last Name must be at least 3 characters long";
    }
    if (!formData.date) {
      newErrors.date = "Date of Birth is required";
    } else if (
      new Date(formData.date) >
      new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    ) {
      newErrors.date = "You must be 18 years or older";
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!mobileNoWithoutSpaces) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobileNoWithoutSpaces)) {
      newErrors.mobileNo =
        "Invalid mobile number. Please enter a 10-digit number";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const validateThird = async () => {
    const newErrors = {};
    if (!formData.aadhar_card_no.trim()) {
      newErrors.aadhar_card_no = "Aadhar Number is required";
    } else if (!/^\d{12}$/.test(formData.aadhar_card_no)) {
      newErrors.aadhar_card_no = "Aadhar Number must be 12 digits";
    }
    // if (!formData.aadhar_image_link) {
    //   newErrors.aadhar_image_link = "Adhar Image is required";
    // }
    if (!formData.pan_card_no.trim()) {
      newErrors.pan_card_no = "Pan Number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_card_no)) {
      newErrors.pan_card_no = "Invalid Pan Number format";
    }
    // if (!formData.pan_image_link) {
    //   newErrors.pan_image_link = "Pan Image is required";
    // }
    // if (!formData.bank_name.trim()) {
    //   newErrors.bank_name = "Bank Name is required";
    // }
    // if (!formData.account_no.trim()) {
    //   newErrors.account_no = "Account Number is required";
    // } else if (!/^\d+$/.test(formData.account_no)) {
    //   newErrors.account_no = "Invalid Account Number format";
    // }
    // if (!formData.ifsc_code.trim()) {
    //   newErrors.ifsc_code = "IFSC Code is required";
    // }
    // if (!formData.branch_name.trim()) {
    //   newErrors.branch_name = "Branch Name is required";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const validateFourth = () => {
    const newErrors = {};

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Please accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleNextClick = async () => {
    if (step === 1 && validateFirst()) {
      nextStep();
    } else if (step === 2 && validateSecond()) {
      nextStep();
    } else if (step === 3 && (await validateThird())) {
      nextStep();
      let { data } = await api.getUsername();
      let userName = data.body.username;

      setFormData((prevData) => ({
        ...prevData,
        ["username"]: userName,
      }));
    } else if (step === 4 && validateFourth()) {
      nextStep();
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const redoStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let updatedFormData = { ...formData };

    if (imageFile.aadhar_image_link) {
      const fileData = new FormData();
      fileData.append("file", imageFile.aadhar_image_link);
      try {
        const { data } = await api.imageUpload(fileData);
        updatedFormData = {
          ...updatedFormData,
          aadhar_image_link: data.body.file,
        };
      } catch (error) {
        console.error("Aadhar image upload failed", error);
      }
    }
    if (imageFile.pan_image_link) {
      const fileData = new FormData();
      fileData.append("file", imageFile.pan_image_link);
      try {
        const { data } = await api.imageUpload(fileData);
        updatedFormData = {
          ...updatedFormData,
          pan_image_link: data.body.file,
        };
      } catch (error) {
        console.error("PAN image upload failed", error);
      }
    }

    dispatch(registerCustomer(updatedFormData, navigate)).then((data) => {
      setLoading(false);
      if (data && data.status == 200) {
        setSuccessMsg("Customer Registered Successfully...");
      } else {
        setFailedMsg("Registration Failed: please try again in some time...");
      }
      setStep(6);
      setTimeout(() => {
        setSuccessMsg("");
        setFailedMsg("");
        setStep(1);
      }, 3000);
    });

    dispatch(
      sendEmail(
        updatedFormData.first_name,
        updatedFormData.email,
        updatedFormData.name
      )
    );

    setIsSubmitted(true);
    setFormData(initialState);
  };

  return (
    <div className="relative flex justify-center">
      <div className="container relative flex flex-col w-4/5">
        <div className="text-5xl font-semibold  whitespace-pre-line text-center tracking-tighter rounded-3xl">
          Register New Member
        </div>
        <form
          onSubmit={handleSubmit}
          className="md:w-4/5 mx-auto rounded-3xl"
          // style={{ backgroundColor: "#fff" }}
        >
          {step === 1 && (
            <motion.div
              key={step} // Add this line
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:w-3/5 mx-auto py-12"
            >
              <div className="text-base font-light text-center  ">Step 1/5</div>
              <div
                className="mt-4 w-full h-2"
                style={{ backgroundColor: "#e0cfc8" }}
              >
                <div
                  className="h-full rounded-3xl w-1/5"
                  style={{ backgroundColor: "#3AA6B9" }}
                ></div>
              </div>
              <div className="mt-4 text-2xl  text-center">
                Sponsor and Package Information
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Sponsor Username"
                  name="sponserer_username" // This should match your formData property
                  className="mt-4 w-full border border-gray-300 rounded p-2 focus:outline-none"
                  // style={{ backgroundColor: "#e0cfc8" }}
                  value={formData.sponserer_username} // This correctly points to formData.name
                  onChange={handleChange}
                  readOnly
                />
                {errors.sponserer_username && (
                  <div className="text-red-500 text-sm">
                    {errors.sponserer_username}
                  </div>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Sponsor Name"
                  name="sponserer_name" // This should match your formData property
                  className="mt-4 w-full border border-gray-300 rounded p-2 focus:outline-none"
                  // style={{ backgroundColor: "#e0cfc8" }}
                  value={formData.sponserer_name} // This should point to formData.number
                  onChange={handleChange}
                  readOnly
                />
                {errors.sponserer_name && (
                  <div className="text-red-500 text-sm">
                    {errors.sponserer_name}
                  </div>
                )}
              </div>
              <div>
                <select
                  name="product_id"
                  id="NewPackage"
                  className="mt-4 w-full border border-gray-300 rounded p-2 focus:outline-none"
                  required
                  value={formData.product_id}
                  onChange={handleChange}
                >
                  <option value="">Select New Product</option>
                  {allProducts &&
                    allProducts.map((product) => (
                      <option
                        key={product.id}
                        value={product.id}
                        disabled={product.available_quantity === 0}
                      >
                        {product.name}{" "}
                        {product.available_quantity === 0 && "(Unavailable)"}
                      </option>
                    ))}
                </select>
                {errors.product_id && (
                  <div className="text-red-500 text-sm">
                    {errors.product_id}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextClick}
                  className="mt-4 bg-purple-500 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded button"
                  style={{ background: "#3AA6B9" }}
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:w-3/5 mx-auto py-12"
            >
              <div className="text-base font-light text-center  ">Step 2/5</div>
              <div
                className="mt-4 w-full h-2"
                style={{ backgroundColor: "#e0cfc8" }}
              >
                <div
                  className="h-full rounded-3xl w-2/5"
                  style={{ backgroundColor: "#3AA6B9" }}
                ></div>
              </div>
              <div className="mt-10 text-3xl  text-center">
                Contact Information
              </div>
              <div>
                <div>
                  <label
                    htmlFor="first_name"
                    className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    required
                    name="first_name"
                    className="mt-2 w-full border border-gray-300 rounded p-2 focus:outline-none"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  {errors.first_name && (
                    <span className="text-red-500">{errors.first_name}</span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="mt-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    required
                    name="last_name"
                    className="mt-2 w-full border border-gray-300 rounded p-2 focus:outline-none"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                  {errors.last_name && (
                    <span className="text-red-500">{errors.last_name}</span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="date"
                    className="mt-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date"
                    placeholder="Date of Birth"
                    className="mt-2 w-full border border-gray-300 rounded p-2 focus:outline-none"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                  {errors.date && (
                    <span className="text-red-500">{errors.date}</span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="mt-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    required
                    className="mt-2 w-full border border-gray-300 rounded p-2 focus:outline-none"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <span className="text-red-500">{errors.gender}</span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mt-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    className="mt-4 w-full border border-gray-300 rounded p-2 focus:outline-none"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <span className="text-red-500">{errors.email}</span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="mobileNo"
                    className="mt-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Mobile
                  </label>
                  <input
                    type="tel"
                    placeholder="Mobile"
                    required
                    name="mobileNo"
                    className="mt-2 w-full border border-gray-300 rounded p-2 focus:outline-none"
                    value={formData.mobileNo}
                    onChange={handleChange}
                  />
                  {errors.mobileNo && (
                    <span className="text-red-500">{errors.mobileNo}</span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="mt-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Address"
                    required
                    name="address"
                    className="mt-2 w-full border border-gray-300 rounded p-2 focus:outline-none"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  {errors.address && (
                    <span className="text-red-500">{errors.address}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-center mt-10">
                <button
                  type="button"
                  onClick={prevStep}
                  className=" mr-4 border border-zinc-300 dark:border-zinc-600 shadow-sm bg-white dark:bg-zinc-700 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 py-2 px-4 rounded"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextClick}
                  className="bg-purple-500 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded"
                  style={{ background: "#3AA6B9" }}
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:w-3/5 mx-auto py-12"
            >
              <div className="text-base font-light text-center  ">Step 3/5</div>
              <div
                className="mt-4 w-full h-2"
                style={{ backgroundColor: "#e0cfc8" }}
              >
                <div
                  className="h-full  rounded-3xl w-3/5"
                  style={{ backgroundColor: "#3AA6B9" }}
                ></div>
              </div>
              <div className="mt-12 text-3xl  text-center">
                Personal Information
              </div>
              <div>
                <div>
                  <label
                    htmlFor="aadhar_card_no"
                    className="mt-4 mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Aadhar No.
                  </label>
                  <input
                    type="number"
                    placeholder="Adhar Number"
                    required
                    name="aadhar_card_no"
                    className=" w-full border border-gray-300 rounded p-2 focus:outline-none"
                    value={formData.aadhar_card_no}
                    onChange={handleChange}
                  />
                  {errors.aadhar_card_no && (
                    <span className="text-red-500">
                      {errors.aadhar_card_no}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="aadhar_image_link"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Adhar Image
                  </label>
                  <input
                    type="file"
                    id="aadhar_image_link"
                    name="aadhar_image_link"
                    accept="image/*,application/pdf"
                    className="w-full mt-2 px-3 py-2 border rounded-md"
                    onChange={handleFileChange}
                  />
                  {errors.aadhar_image_link && (
                    <span className="text-red-500">
                      {errors.aadhar_image_link}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="pan_card_no"
                    className="mt-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Pan No.
                  </label>
                  <input
                    type="text"
                    id="pan_card_no"
                    name="pan_card_no"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter Pan number"
                    value={formData.pan_card_no}
                    onChange={handleChange}
                  />
                  {errors.pan_card_no && (
                    <span className="text-red-500">{errors.pan_card_no}</span>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="pan_image_link"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Pan Image
                  </label>
                  <input
                    type="file"
                    id="pan_image_link"
                    name="pan_image_link"
                    accept="image/*,application/pdf"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    onChange={handleFileChange}
                  />
                  {errors.pan_image_link && (
                    <span className="text-red-500">
                      {errors.pan_image_link}
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="bank_name"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bank_name"
                    name="bank_name"
                    className="w-full px-3 py-2 border rounded-md mt-1"
                    placeholder="Enter Bank Name"
                    value={formData.bank_name}
                    onChange={handleChange}
                  />
                  {errors.bank_name && (
                    <span className="text-red-500">{errors.bank_name}</span>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="account_no"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Account No.
                  </label>
                  <input
                    type="number"
                    placeholder="Account Number"
                    required
                    name="account_no"
                    className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none"
                    value={formData.account_no}
                    onChange={handleChange}
                  />
                  {errors.account_no && (
                    <span className="text-red-500">{errors.account_no}</span>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="ifsc_code"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    IFSC Code.
                  </label>
                  <input
                    type="text"
                    placeholder="IFSC Code"
                    required
                    name="ifsc_code"
                    className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none"
                    value={formData.ifsc_code}
                    onChange={handleChange}
                  />
                  {errors.ifsc_code && (
                    <span className="text-red-500">{errors.ifsc_code}</span>
                  )}
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="branch_name"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Branch Name
                  </label>
                  <input
                    type="text"
                    id="branch_name"
                    name="branch_name"
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                    placeholder="Enter Branch Name"
                    value={formData.branch_name}
                    onChange={handleChange}
                  />
                  {errors.branch_name && (
                    <span className="text-red-500">{errors.branch_name}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                {step !== 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="mt-10 mr-4 border border-zinc-300 dark:border-zinc-600 shadow-sm px-4 py-2 bg-white dark:bg-zinc-700 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"
                  >
                    Previous
                  </button>
                )}
                {step === 3 && (
                  <button
                    type="button"
                    onClick={handleNextClick}
                    className="mt-10 bg-purple-500 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded"
                    style={{ background: "#3AA6B9" }}
                  >
                    Next
                  </button>
                )}
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key={step} // Add this line
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:w-3/5 mx-auto py-12"
            >
              <div className="text-base font-light text-center  ">Step 4/5</div>
              <div
                className="mt-4 w-full h-2"
                style={{ backgroundColor: "#e0cfc8" }}
              >
                <div
                  className="h-full  rounded-3xl w-4/5"
                  style={{ backgroundColor: "#3AA6B9" }}
                ></div>
              </div>
              <div className="mt-4 text-2xl  text-center">
                Login Information
              </div>
              <div>
                <input
                  type="username"
                  placeholder="UserName"
                  required
                  disabled
                  name="username"
                  className="mt-4 w-full border border-gray-300 rounded p-2 focus:outline-none"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <span className="text-red-500">{errors.username}</span>
                )}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  required
                  name="password"
                  className="mt-4 w-full border border-gray-300 rounded p-2 focus:outline-none"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <span className="text-red-500">{errors.password}</span>
                )}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  name="confirmPassword"
                  className="mt-4 w-full border border-gray-300 rounded p-2 focus:outline-none"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <span className="text-red-500">{errors.confirmPassword}</span>
                )}
              </div>
              {formData.password !== formData.confirmPassword && (
                <span className="text-red-500">
                  Passwords do not match. Please enter the same password.
                </span>
              )}

              <div className="flex items-center mt-5">
                <input
                  type="checkbox"
                  id="terms"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={formData.acceptTerms}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      acceptTerms: e.target.checked,
                    }))
                  }
                  required
                />
                <label htmlFor="terms" className="ml-2 text-zinc-700">
                  I accept Terms & Conditions.
                  <span className="text-red-500">*</span>
                </label>
                {errors.acceptTerms && (
                  <span className="text-red-500 ml-2">
                    {errors.acceptTerms}
                  </span>
                )}
              </div>

              <div className="flex justify-center mt-12">
                <button
                  type="button"
                  onClick={prevStep}
                  className="mr-4 border border-zinc-300 dark:border-zinc-600 shadow-sm px-4 py-2 bg-white dark:bg-zinc-700 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextClick}
                  className="bg-purple-500 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded"
                  style={{ background: "#3AA6B9" }}
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}
          {step === 5 && (
            <motion.div
              key={step} // Add this line
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:w-3/5 mx-auto py-12"
            >
              {" "}
              {loading ? (
                <Loader />
              ) : (
                <>
                  <div className="text-base font-light text-center">
                    Step 5/5
                  </div>
                  <div
                    className="mt-4 w-full h-2"
                    style={{ backgroundColor: "#e0cfc8" }}
                  >
                    <div
                      className="h-full rounded-3xl w-full"
                      style={{ backgroundColor: "#3AA6B9" }}
                    ></div>
                  </div>
                  <div className="mt-4 text-2xl text-center">Payment Type</div>
                  <div
                    className="mt-5 text-center"
                    style={{ fontSize: "2.5rem", fontWeight: "bold" }}
                  >
                    E-PIN
                  </div>
                  <div className="mt-4 max-w-sm mx-auto p-4 border rounded-lg shadow-md">
                    {ePins && ePins.length > 0 && (
                      <select
                        id="pinSelect"
                        name="pinSelect"
                        value={formData.pindetails.registrationpin}
                        onChange={handleSelectChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select a pin</option>
                        {ePins.map((detail, index) =>
                          detail.pins.map((pin, pinIndex) => (
                            <option
                              key={`${index}-${pinIndex}`}
                              data-key={detail.id}
                              data-username={detail.username}
                              value={pin}
                            >
                              {`${detail.id} ${pin} (${detail.username})`}
                            </option>
                          ))
                        )}
                      </select>
                    )}
                    {!ePins.length && (
                      <select
                        id="pinSelect"
                        name="pinSelect"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        disabled
                      >
                        <option value="" disabled>
                          No E-pins found
                        </option>
                      </select>
                    )}
                  </div>

                  {userRole == "customer" && (
                    <>
                      <div>
                        <input
                          type="E-Pin"
                          placeholder="Epin Id"
                          // required
                          name="pindetails.id"
                          className="mt-4 w-full border border-gray-300 rounded p-2 focus:outline-none"
                          value={formData.pindetails.id}
                          onChange={handleChange}
                        />
                        {/* {errors.username && (
                        <span className="text-red-500">{errors.username}</span>
                      )}  */}
                      </div>
                      <div>
                        <input
                          type="E-Pin"
                          placeholder="Epin"
                          // required
                          name="pindetails.registrationpin"
                          className="mt-4 w-full border border-gray-300 rounded p-2 focus:outline-none"
                          value={formData.pindetails.registrationpin}
                          onChange={handleChange}
                        />
                        {/* {errors.username && (
                        <span className="text-red-500">{errors.username}</span>
                      )}  */}
                      </div>
                      <div>
                        <input
                          type="E-Pin"
                          placeholder="Epin Username"
                          // required
                          name="pindetails.username"
                          className="mt-4 w-full border border-gray-300 rounded p-2 focus:outline-none"
                          value={formData.pindetails.username}
                          onChange={handleChange}
                        />
                        {/* {errors.username && (
                        <span className="text-red-500">{errors.username}</span>
                      )}  */}
                      </div>
                    </>
                  )}
                  <div className="flex justify-center mt-12">
                    <button
                      type="button"
                      onClick={prevStep}
                      className=" mr-4 border border-zinc-300 dark:border-zinc-600 shadow-sm px-4 py-2 bg-white dark:bg-zinc-700 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      // onClick={redoStep}
                      className={`${
                        formData.pindetails.username ? "" : "disabled-btn"
                      } bg-purple-500 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded`}
                      style={{ backgroundColor: "#3AA6B9" }}
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
          {step === 6 &&
            (successMsg ? (
              <div className="p-6 mx-auto text-center border border-green-600 bg-green-50 rounded-lg shadow-md flex justify-center items-center max-w-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
                <h3 className="text-green-600">{successMsg}</h3>
              </div>
            ) : (
              <div className="p-6 mx-auto text-center border border-red-600 bg-red-50 rounded-lg shadow-md flex justify-center items-center max-w-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
                <h3 className="text-red-600">{failedMsg}</h3>
              </div>
            ))}
        </form>
        {/* {isSubmitted && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white text-black p-6 rounded shadow-lg">
              <p>Submitted Successfully</p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default Form;
