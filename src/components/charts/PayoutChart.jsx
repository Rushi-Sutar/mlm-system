import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { financeDataAdmin } from '../../actions/financeDataAdmin';
import { financeData } from '../../actions/financeData';
import 'chart.js/auto';

const PayoutChart = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.userRole);
  const [activeSegment, setActiveSegment] = useState(null);
  const [totalSum, setTotalSum] = useState(0);
  const [pendingSum, setPendingSum] = useState(0);
  const [totalChunksArray, setTotalChunksArray] = useState([]);
  const [pendingChunksArray, setPendingChunksArray] = useState([]);
  let fData = '';
  let adminFData = '';

  let username = "";
  if (userRole === "admin") {
    username = useSelector((state) => state.auth.authData.admin?.username);
    adminFData = useSelector((state)=> state.FinanceDataAdmin);
  } else if (userRole === "customer") {
    username = useSelector((state) => state.auth.authData.customer?.username);
    fData = useSelector((state) => state.FinanceData);
  }
  
  useEffect(() => {
    if (userRole === "admin") {
      dispatch(financeDataAdmin(username));
    } else if (userRole === "customer") {
      dispatch(financeData(username));
    }
  }, [dispatch, userRole, username]);

  useEffect(() => {
    if (fData && fData.total_commission) {
      const { total_commission, pending_commission } = fData;

      const processNumber = (num) => {
        const numString = num.toString();
        let chunks = [];
        for (let i = 0; i < numString.length; i += 3) {
          let chunk = numString.slice(i, i + 3);
          chunks.push(parseInt(chunk, 10));
        }
        return chunks;
      };
      if (total_commission !== undefined && total_commission !== null) {
        const totalChunks = processNumber(total_commission);
        setTotalChunksArray(totalChunks);
        const totalSum = totalChunks.reduce((acc, chunk) => acc + chunk, 0);
        setTotalSum(totalSum);
      }

      if (pending_commission !== undefined && pending_commission !== null) {
        const pendingChunks = processNumber(pending_commission);
        setPendingChunksArray(pendingChunks);
        const pendingSum = pendingChunks.reduce((acc, chunk) => acc + chunk, 0);
        setPendingSum(pendingSum);
      }
    }
  }, [fData]);

  

  const percentage = totalSum !== 0 ? ((totalSum/pendingSum) * 100) : 0;
  let data = '';
  let adminPercentage = ''
  const totalCommission = adminFData?.commission_earned;
  const pendingCommission = adminFData?.pending_amount_to_pay;
  
  if(userRole == 'admin'){
    if (typeof totalCommission === 'number' && typeof pendingCommission === 'number' && totalCommission !== 0) {
      adminPercentage = ((totalCommission/pendingCommission) * 100).toFixed(2);
    } else {
      console.error('Invalid data: totalCommission or pendingCommission is not a number or totalCommission is zero');
    }
  }
  


  if(userRole == 'admin'){
     data = {
      labels: ['Pending', 'Total Commission'],
      datasets: [
        {
          data: [pendingCommission,totalCommission],
          backgroundColor: ['#D3D3D3', '#4B0082'],
          hoverBackgroundColor: ['#D3D3D3', '#4B0082'],
        },
      ],
    };
  }else{
     data = {
      labels: ['Pending', 'Total Commission'],
      datasets: [
        {
          data: [pendingSum, totalSum],
          backgroundColor: ['#D3D3D3', '#4B0082'],
          hoverBackgroundColor: ['#D3D3D3', '#4B0082'],
        },
      ],
    };
  }
  

  const options = {
    cutout: '70%',
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: $${tooltipItem.raw}`;
          },
        },
      },
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setActiveSegment(index);
      }
    },
  };

  return (
    <div
      className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mx-auto w-full grid place-content-center"
      style={{ height: "70vh" }}
    >
      <h2 className="text-zinc-800 dark:text-zinc-200 text-lg font-semibold mb-4 text-center">
        PAYOUT OVERVIEW
      </h2>
      <div className="flex justify-center mb-4">
        <div className="relative">
          <Doughnut data={data} options={options} />
          {userRole == "admin" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
                {adminPercentage}%
              </span>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
                {percentage}%
              </span>
            </div>
          )}
        </div>
      </div>
      {userRole == "admin" ? (
        <div className="flex flex-row justify-around mt-4">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-1">
              <span
                className={`w-3 h-3 ${
                  activeSegment === 1 ? "bg-purple-600" : "bg-purple-400"
                } inline-block mr-2`}
                style={{ background: "#4B0082" }}
              ></span>
              <span className="text-zinc-800 dark:text-zinc-200">
                Total Commission
              </span>
            </div>
            <div className="text-zinc-800 dark:text-zinc-200">
              {adminFData?.commission_earned}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <span
                className={`w-3 h-3 ${
                  activeSegment === 0 ? "bg-zinc-400" : "bg-zinc-300"
                } inline-block mr-2`}
                style={{ background: "#D3D3D3" }}
              ></span>
              <span className="text-zinc-800 dark:text-zinc-200">Pending</span>
            </div>
            <div className="text-zinc-800 dark:text-zinc-200">
              {adminFData?.pending_amount_to_pay}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-row justify-around mt-4">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-1">
              <span
                className={`w-3 h-3 ${
                  activeSegment === 1 ? "bg-purple-600" : "bg-purple-400"
                } inline-block mr-2`}
                style={{ background: "#4B0082" }}
              ></span>
              <span className="text-zinc-800 dark:text-zinc-200">
                Total Commission
              </span>
            </div>
            <div className="text-zinc-800 dark:text-zinc-200">{totalSum}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <span
                className={`w-3 h-3 ${
                  activeSegment === 0 ? "bg-zinc-400" : "bg-zinc-300"
                } inline-block mr-2`}
                style={{ background: "#D3D3D3" }}
              ></span>
              <span className="text-zinc-800 dark:text-zinc-200">Pending</span>
            </div>
            <div className="text-zinc-800 dark:text-zinc-200">{pendingSum}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutChart;
