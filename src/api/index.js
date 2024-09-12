import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("user")).jwt
    }`;
  }
  return req;
});

export const signup = (userData) => API.post(`/registeradmin`, userData);

export const signin = (userData, role) => {
  if (role === "admin") {
    return API.post(`/login`, userData);
  } else if (role === "customer") {
    return API.post(`/logincustomer`, userData);
  }
};

export const registerCustomer = (userData) =>
  API.post(`/addcustomer`, userData);

export const addProduct = (productData) =>
  API.post(`/addproducts`, productData);

export const editProduct = (productData) => API.put(`/products`, productData);

export const getProduct = () => API.get(`/products`);

export const getUsername = () => API.get(`/getusername`);

export const getAdminReports = (id) => API.get(`/admin/report/${id}`);

export const fetchRegistrationPins = (username) =>
  API.get(`/fetchregistrationpins/${username}`);

export const addEPins = (body) => API.post(`/provideregistrationpins`, body);

export const orderHistory = () => API.get(`/productpurchase/all`);

export const networkTree = (username) =>
  API.get(`/customer/network/${username}`);

export const highPerformingCustomer = (username) =>
  API.get(`/highPerformingCustomer/${username}`);

export const getNewJoinedMembers = () => API.get(`/getnewjoinedcustomer`);

export const getAllCustomers = () => API.get(`/allcustomers`);

export const pendingCommissionReport = (username) =>
  API.post(`/admin/pendingcommission`, username);

export const updateProfile = (userData) => API.put(`/updatecustomer`, userData);

export const updateCommission = (payload) =>
  API.post(`/update/commission`, payload);

export const customerGraph = (payload) =>
  API.post(`/statics/customerjoining`, payload);

export const finance = (username) => API.get(`/customer-finance/${username}`);

export const financeAdmin = (username) => API.get(`/admin-finance/${username}`);

export const incomeCommissionGraph = (payload) =>
  API.post(`/statics/commissionandearning`, payload);

export const paidCommission = (payload) =>
  API.post(`/paidcommission-transactions`, payload);

export const sendEmail = (payload) => API.post(`/send-email`, payload);

export const imageUpload = (imageData) => API.post("/upload", imageData);

export const getUploadImageDetails = (imageId) => API.get(`/files/${imageId}`);

export const extraCommission = (username) =>
  API.get(`/extracommission/${username}`);

export const validate = async (payload) => {
  try {
    const response = await API.post(`/check-unique-identifier`, payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.error(
        "Conflict error: The identifier is not unique.",
        error.response.data
      );
      return {
        status: 409,
        message: "Conflict error: The identifier is not unique.",
        details: error.response.data,
      };
    } else {
      console.error("An error occurred:", error.message);
      return {
        status: error.response ? error.response.status : 500,
        message: error.message,
      };
    }
  }
};

export const updateOrderHistory = (payload) =>
  API.put("/productpurchase/update", payload);
