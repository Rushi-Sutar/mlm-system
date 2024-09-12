// src/App.js
import React from "react";
import "./App.css"; // Import the CSS file for custom styles
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./login/Login";
import LoginCustomer from "./login/LoginCustomer";
import ErrorPage from "./components/ErrorPage";
import { useDispatch, useSelector } from "react-redux";
import { setRole, syncUser } from "./actions/auth";
import LandingPage from "./components/LandingPage";

const App = () => {
  const dispatch = useDispatch();

  const user =
    useSelector((state) => state.auth.authData) ||
    JSON.parse(localStorage.getItem("user"));
  if (user) {
    dispatch(syncUser(user));
    if ("customer" in user) {
      dispatch(setRole("customer"));
    } else {
      dispatch(setRole("admin"));
    }
  }

  const userRole = useSelector((state) => state.auth.userRole);

  return (
    <>
      {/* <Navbar /> */}

      <Routes>
        {user && Object.keys(user).length > 0 ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={<Navbar component="dashboard" />}
            />
            <Route path="/network" element={<Navbar component="network" />} />
            <Route path="/register" element={<Navbar component="register" />} />
            <Route path="/epin" element={<Navbar component="epin" />} />
            <Route
              path="/commissionreport"
              element={<Navbar component="commissionreport" />}
            />
            <Route
              path="/orderhistory"
              element={<Navbar component="orderhistory" />}
            />

            {userRole && userRole !== "customer" ? (
              <>
                <Route
                  path="/reports"
                  element={<Navbar component="reports" />}
                />
                <Route
                  path="/products"
                  element={<Navbar component="products" />}
                />
                <Route
                  path="/customertransaction"
                  element={<Navbar component="customertransaction" />}
                />
                <Route path="/payout" element={<Navbar component="payout" />} />
              </>
            ) : (
              ""
            )}

            <Route path="*" element={<ErrorPage />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/logincustomer" element={<LoginCustomer />} />
          </>
        ) : (
          <>
            <Route path="/admin" element={<Login />} />
            <Route path="/logincustomer" element={<LoginCustomer />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<LandingPage />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
