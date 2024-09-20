import React, { useState, useEffect } from "react";
import { exportToExcel } from "./report/exportToExcel";
import ConfirmationModal from "./payout/ConfirmationModal";
import img1 from "../assets/oilcan.png";
import img2 from "../assets/ranger.jpg";
import img3 from "../assets/unicorn.jpg";
import img4 from "../assets/alto-blue.jpg";

const StaticCommissionReport = () => {
  // State variables
  const [staticData, setStaticData] = useState([]); // Holds fetched data
  const [isLoading, setIsLoading] = useState(true); // Indicates loading state
  const [error, setError] = useState(null); // Stores error message
  const [isModalOpen, setIsModalOpen] = useState(false); // Manages modal visibility
  const [modalContent, setModalContent] = useState({}); // Modal data content
  const [selectedItems, setSelectedItems] = useState([]); // Tracks selected items

  // Handle modal confirmation for selected items
  const handleConfirm = async () => {
    setIsModalOpen(false); // Close modal
    try {
      const user = localStorage.getItem("user");
      const jwtToken = user ? JSON.parse(user).jwt : null;

      if (!jwtToken) {
        throw new Error("No JWT token found");
      }

      // Update the selected commission data
      const response = await fetch(
        "http://generational.madat.me/extracommission/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(modalContent),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update commission: ${
            errorData.message || response.statusText
          }`
        );
      }

      const updatedData = await response.json();

      // Update the static data with the modified row
      setStaticData((prevData) =>
        prevData.map((item) =>
          item.username === updatedData.username ? updatedData : item
        )
      );
      setSelectedItems([]); // Clear selected items
    } catch (error) {
      setError(error.toString());
      console.error("Error updating commission:", error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve user information and JWT token from local storage
        const user = localStorage.getItem("user");
        const jwtToken = user ? JSON.parse(user).jwt : null;
        const username = user ? JSON.parse(user).admin.username : null;

        // Fetch commission data from API
        const response = await fetch(
          `http://generational.madat.me/extracommission/${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: jwtToken ? `Bearer ${jwtToken}` : "",
            },
          }
        );

        // Handle errors in fetching
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Update state with fetched data
        const data = await response.json();
        setStaticData(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [handleConfirm]);

  // Handle export to Excel functionality
  const handleExport = () => {
    if (staticData && staticData.length > 0) {
      const exportData = staticData.map((item) => ({
        AccountNo: item.account_no,
        Amount: item.amount,
        Commission: item.commssion,
        Ifsc: item.ifsc_code,
        Details: item.details,
        CustomerName: item.name,
        Mobile: item.mobile,
      }));
      exportToExcel(exportData, "StaticCommissionReport.xlsx");
    }
  };

  // Handle modal cancellation
  const handleCancel = () => {
    setIsModalOpen(false); // Close modal
  };

  // Handle selecting all items
  const handleSelectAll = () => {
    if (selectedItems.length === staticData.length) {
      setSelectedItems([]); // Deselect all if all are selected
    } else {
      setSelectedItems(staticData.map((item) => item.username)); // Select all
    }
  };

  // Handle selecting multiple items for update
  const handleUpdateSelected = () => {
    if (selectedItems.length === 0) {
      alert("Please select items to update.");
      return;
    }

    if (selectedItems.length === 1) {
      const username = selectedItems[0];
      const item = staticData.find((item) => item.username === username);
      setModalContent({
        transaction_details: {
          username,
          amount: item.amount,
          transaction_id: item.transaction_id,
          name: item.name,
          account_no: item.account_no,
          details: item.details,
          ifsc_code: item.ifsc_code,
          mobile: item.mobile,
        },
      });
    } else {
      // Handle multiple items selected
      setModalContent({
        transaction_details: {
          username: selectedItems.join(", "),
          amount: null,
          transaction_id: null,
          name: null,
          account_no: null,
          details: null,
          ifsc_code: null,
          mobile: null,
        },
      });
    }
    setIsModalOpen(true);
  };

  // Toggle item selection
  const isSelected = (username) => selectedItems.includes(username);

  const toggleSelectItem = (username) => {
    if (isSelected(username)) {
      setSelectedItems(selectedItems.filter((item) => item !== username));
    } else {
      setSelectedItems([...selectedItems, username]);
    }
  };

  // Determine which reward image to show based on the number of joined members
  const getRewardImage = (joinedMembers) => {
    if (joinedMembers >= 20) {
      return img4;
    } else if (joinedMembers >= 15) {
      return img3;
    } else if (joinedMembers >= 10) {
      return img2;
    } else if (joinedMembers >= 5) {
      return img1;
    }
    return null; // No image for fewer than 5 members
  };

  // Render loading and error messages
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="report-table-container mt-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-4 sm:mb-0">Commission Report</h2>
        <div className="flex flex-col sm:flex-row">
          <button
            onClick={handleSelectAll}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 sm:mb-0 sm:mr-2"
          >
            {selectedItems.length === staticData.length
              ? "Deselect All"
              : "Select All"}
          </button>
          <button
            onClick={handleUpdateSelected}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={selectedItems.length === 0}
          >
            Update Selected
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[350px]">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 border">NAME</th>
              <th className="py-2 border">ACCOUNT NO</th>
              <th className="py-2 border">IFSC</th>
              <th className="py-2 border">AMOUNT</th>
              <th className="py-2 border">COMMISSION</th>
              <th className="py-2 border">DETAILS</th>
              <th className="py-2 border">MOBILE</th>
              <th className="py-2 border">USERNAME</th>
              <th className="py-2 border">JOINED MEMBERS</th>
              <th className="py-2 border">REWARD</th>
              <th className="py-2 border">SELECT</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {staticData && staticData.length > 0 ? (
              staticData.map((item) => (
                <tr key={item.username}>
                  <td className="py-2 border px-4">{item.name}</td>
                  <td className="py-2 border px-4">{item.account_no}</td>
                  <td className="py-2 border px-4">{item.ifsc_code}</td>
                  <td className="py-2 border px-4">{item.amount}</td>
                  <td className="py-2 border px-4">{item.commssion}</td>
                  <td className="py-2 border px-4">{item.details}</td>
                  <td className="py-2 border px-4">{item.mobile}</td>
                  <td className="py-2 border px-4">{item.username}</td>
                  <td className="py-2 border px-4">{item.amount / 90}</td>
                  <td className="py-2 border px-4">
                    {item.amount && getRewardImage(item.amount) ? (
                      <img
                        src={getRewardImage(item.amount / 90)}
                        alt="Reward"
                        className="w-8 h-8 object-cover"
                      />
                    ) : (
                      "No reward"
                    )}
                  </td>
                  <td className="py-2 border px-4">
                    <input
                      type="checkbox"
                      checked={isSelected(item.username)}
                      onChange={() => toggleSelectItem(item.username)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-4 text-center">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleExport}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Export to Excel
        </button>
      </div>

      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          modalContent={modalContent}
        />
      )}
    </div>
  );
};

export default StaticCommissionReport;
