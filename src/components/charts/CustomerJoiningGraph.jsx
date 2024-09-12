import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { BsThreeDotsVertical } from 'react-icons/bs';
import 'chart.js/auto';
import { customerGraph } from '../../actions/customerGraph';
import { useDispatch, useSelector } from 'react-redux';

const CustomerJoiningGraph = ({isMobile}) => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.userRole);
  const dataDay = useSelector((state) => state.customerGraph?.["daywise:"]);
  const dataMonth = useSelector((state) => state.customerGraph?.["month wise : "]);
  const dataYear = useSelector((state) => state.customerGraph?.yearwise);

  let username = '';
  if (userRole === 'admin') {
    username = useSelector((state) => state.auth.authData.admin?.username);
  } else if (userRole === 'customer') {
    username = useSelector((state) => state.auth.authData.customer?.username);
  }

  useEffect(() => {
    dispatch(customerGraph(username));
  }, [dispatch]);

  const [chartType, setChartType] = useState('monthwise');
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
    setShowDropdown(false); // Close dropdown after selecting an option
  };
  let windowWidth = window.innerWidth;
  let smallScreen = windowWidth <= 768;

  const getChartData = () => {
    switch (chartType) {
      case 'daywise':
        return {
          labels: dataDay && dataDay.map((item) => item.date),
          datasets: [
            {
              label: 'Daywise',
              data: dataDay && dataDay.map((item) => item.data),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        };
      case 'yearwise':
        return {
          labels:dataYear && dataYear.map((item) => item.year),
          datasets: [
            {
              label: 'Yearwise',
              data:dataYear && dataYear.map((item) => item.data),
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
            },
          ],
        };
      case 'monthwise':
      default:
        return {
          labels:dataMonth && dataMonth.map((item) => item.month),
          datasets: [
            {
              label: 'Monthwise',
              data:dataMonth && dataMonth.map((item) => item.data),
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        };
    }
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
    <div className={`${isMobile ? "" : "w-[48%]"} border-2 border-gray-300 p-2 h-[395px] w-full`}>
      <div className="flex md:flex-row min-w-full items-center justify-between">
        <h2 className="text-xl font-bold mt-2 px-2">JOININGS</h2>
        <div className="relative md:ml-2 pe-6 mt-4">
          <BsThreeDotsVertical
            className="cursor-pointer text-2xl"
            onClick={toggleDropdown}
          />

          {showDropdown && (
            <div className={`${smallScreen ? "chart-mobile" : "right-0 w-full" } absolute mt-2 md:mt-4 md:w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10`}>
              <div className="py-1">
                <label htmlFor="chartType" className="sr-only">
                  Select Chart Type
                </label>
                <select
                  id="chartType"
                  name="chartType"
                  value={chartType}
                  onChange={handleChartTypeChange}
                  className="block w-full md:w-48 px-4 py-2 text-sm text-gray-700 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  style={{ width: '100%' }} // Adjust width for mobile
                >
                  <option value="daywise">Daywise</option>
                  <option value="monthwise">Monthwise</option>
                  <option value="yearwise">Yearwise</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="chart-container w-full h-full">
        <Line data={getChartData()} options={options} height="100%" width="100%"/>
      </div>
    </div>
    </>
  );
};

export default CustomerJoiningGraph;
