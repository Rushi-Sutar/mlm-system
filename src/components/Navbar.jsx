import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Form from "./Form";
import Dashboard from "./Dashboard";
import EpinForm from "./EpinForm";
import NetworkTree from "./NetworkTree";
import Product from "./Product";
import Report from "./report/Report";
import Header from "./Header";
import OrderHistory from "./OrderHistory";
import { useSelector } from "react-redux";
import CustomerTransaction from "./CustomerTransaction";
import Payout from "./Payout";
import UpdateUserprofile from "./profile/UpdateUserprofile";
import StaticCommissionReport from "./StaticCommissionReport";


function Navbar({ component }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderComponent = () => {
    switch (component) {
      case "register":
        return <Form />;
      case "network":
        return <NetworkTree />;
      case "epin":
        return <EpinForm />;
      case "products":
        return <Product />;
      case "reports":
        return <Report />;
      case "orderhistory":
        return <OrderHistory />;
        case "customertransaction":
        return <CustomerTransaction />;
        case "userprofile":
          return <UpdateUserprofile/>
          case "payout":
            return <Payout/>
          case "commissionreport":
            return <StaticCommissionReport/>
      default:
        return <Dashboard />;
    }
  };

  const handleNavLinkClick = () => {
    if (window.innerWidth <= 768) {
      // Adjust breakpoint as needed
      setIsMenuOpen(false); // Close sidebar on mobile
    }
  };
  const getNavLinkClass = (path) => {
    return location.pathname === path ||
      (location.pathname == "/" && path == "/dashboard")
      ? "bg-white text-black"
      : "text-white dark:text-white";
  };

  const userRole = useSelector((state) => state.auth.userRole);

  return (
    <div className="flex flex-col h-screen">
      <Header toggleMenu={toggleMenu} />

      <div className="flex flex-1">
        <div
          className={`w-64 p-4 ${
            isMenuOpen ? "block" : "hidden"
          } lg:block fixed md:static w-[233px] h-full z-50`}
          style={{ backgroundColor: "#3AA6B9" }}
        >
          <nav className="space-y-2 font-medium">
            <NavLink
              to="/dashboard"
              className={`flex items-center p-2 rounded-md ${getNavLinkClass(
                "/dashboard"
              )}}`}
              onClick={handleNavLinkClick}
            >
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/network"
              className={`flex items-center p-2 rounded-md ${getNavLinkClass(
                "/network"
              )}`}
              onClick={handleNavLinkClick}
            >
              <span>Networks</span>
            </NavLink>

            <NavLink
              to="/register"
              className={`flex items-center p-2 rounded-md ${getNavLinkClass(
                "/register"
              )}`}
              onClick={handleNavLinkClick}
            >
              <span>Registration</span>
            </NavLink>

            <NavLink
              to="/epin"
              className={`flex items-center p-2 rounded-md ${getNavLinkClass(
                "/epin"
              )}`}
              onClick={handleNavLinkClick}
            >
              <span>E-Pin</span>
            </NavLink>
            <NavLink
                  to="/commissionreport"
                  className={`flex items-center p-2 rounded-md ${getNavLinkClass(
                    "/commissionreport"
                  )}`}
                  onClick={handleNavLinkClick}
                >
                  <span>Commission Report</span>
                </NavLink>
            {/* <NavLink
              to="/userprofile"
              className={`flex items-center p-2 rounded-md ${getNavLinkClass(
                "/userprofile"
              )}`}
              onClick={handleNavLinkClick}
            >
              <span>E-Pin</span>
            </NavLink> */}

            {userRole && userRole == "customer" ? (
              <NavLink
                to="/orderhistory"
                className={`flex items-center p-2 rounded-md ${getNavLinkClass(
                  "/orderhistory"
                )}`}
                onClick={handleNavLinkClick}
              >
                <span>Purchase History</span>
              </NavLink>
            ) : (
              <NavLink
                to="/products"
                className={`flex items-center p-2 rounded-md ${getNavLinkClass(
                  "/products"
                )}`}
                onClick={handleNavLinkClick}
              >
                <span>Products</span>
              </NavLink>
              
            )}

            {userRole && userRole != "customer" ? (
              <>
                <NavLink
                  to="/orderhistory"
                  className={`flex items-center p-2 rounded-md ${getNavLinkClass(
                    "/orderhistory"
                  )}`}
                  onClick={handleNavLinkClick}
                >
                  <span>Order History</span>
                </NavLink>

                <NavLink
                  to="/reports"
                  className={`flex items-center p-2 rounded-md ${getNavLinkClass(
                    "/reports"
                  )}`}
                  onClick={handleNavLinkClick}
                >
                  <span>Reports</span>
                </NavLink>
                <NavLink
                  to="/payout"
                  className={`flex items-center p-2 rounded-md ${getNavLinkClass(
                    "/payout"
                  )}`}
                  onClick={handleNavLinkClick}
                >
                  <span>Payout</span>
                </NavLink>
                <NavLink
                  to="/customertransaction"
                  className={`flex items-center p-2 rounded-md ${getNavLinkClass(
                    "/customertransaction"
                  )}`}
                  onClick={handleNavLinkClick}
                >
                  <span>Customer Details</span>
                </NavLink>
                
               
              </>
            ) : (
              ""
            )}
          </nav>
        </div>

        <div className="flex-1 p-4 md:w-[600px] w-full ">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
