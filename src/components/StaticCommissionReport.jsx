import React, { useState } from 'react';
import { exportToExcel } from './report/exportToExcel';
import ConfirmationModal from './payout/ConfirmationModal';

const StaticCommissionReport = () => {
  const staticData = [
    {
      name: "Nitin Shinde",
      account_no: "639601000626",
      commssion: 0,
      details: "Salary",
      ifsc_code: "ICIC0006396",
      mobile: "9766437505",
      amount: 300,
      username: "SM465390",
    },
    {
      name: "Rajpurva Jadhav",
      account_no: "60226331279",
      commssion: 0,
      details: "Salary",
      ifsc_code: "MAHB0000282",
      mobile: "7020990884",
      amount: 500,
      username: "SM929868",
    },
    // ... add the rest of the static data here
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  const handleExport = () => {
    if (staticData && staticData.length > 0) {
      const exportData = staticData.map(item => ({
        AccountNo: item.account_no,
        Amount: item.amount,
        Commission: item.commssion,
        Ifsc: item.ifsc_code,
        Details: item.details,
        CustomerName: item.name,
        Mobile: item.mobile,
      }));
      exportToExcel(exportData, 'StaticCommissionReport.xlsx');
    }
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    setSelectedItems([]);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === staticData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(staticData.map(item => item.username));
    }
  };

  const handleUpdateSelected = () => {
    if (selectedItems.length === 0) {
      alert("Please select items to update.");
      return;
    }
    if (selectedItems.length === 1) {
      const username = selectedItems[0];
      const item = staticData.find(item => item.username === username);
      setModalContent({ username, amount: item.amount });
    } else {
      setModalContent({ username: null, amount: null });
    }
    setIsModalOpen(true);
  };

  const isSelected = username => selectedItems.includes(username);

  const toggleSelectItem = username => {
    if (isSelected(username)) {
      setSelectedItems(selectedItems.filter(item => item !== username));
    } else {
      setSelectedItems([...selectedItems, username]);
    }
  };

  return (
    <div className="report-table-container mt-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-bold mb-4 sm:mb-0">Static Commission Report</h2>
        <div className="flex flex-col sm:flex-row">
          <button
            onClick={handleSelectAll}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 sm:mb-0 sm:mr-2"
          >
            {selectedItems.length === staticData.length ? 'Deselect All' : 'Select All'}
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
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleExport}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        style={{ background: "#3AA6B9" }}
      >
        Export to Excel
      </button>
      {isModalOpen && (
        <ConfirmationModal
          username={modalContent.username}
          amount={modalContent.amount}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default StaticCommissionReport;
