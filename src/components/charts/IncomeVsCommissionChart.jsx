import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { incomeCommissionGraph } from '../../actions/incomeCommissionGraph';

const IncomeVsCommissionChart = ({isMobile}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewType, setViewType] = useState('monthwise');
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.userRole);
  const dataDay = useSelector((state) => state.incomeCommissionGraph?.daywise);
  const dataMonth = useSelector((state) => state.incomeCommissionGraph?.monthwise);
  const dataYear = useSelector((state) => state.incomeCommissionGraph?.yearwise);

  let username = '';
  if (userRole === 'admin') {
    username = useSelector((state) => state.auth.authData.admin?.username);
  } else if (userRole === 'customer') {
    username = useSelector((state) => state.auth.authData.customer?.username);
  }

  

  useEffect(() => {
    dispatch(incomeCommissionGraph(username));
  }, [dispatch]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (type) => {
    setAnchorEl(null);
    if (type) setViewType(type);
  };

  const prepareChartData = (data, labelsKey, incomeKey, commissionKey) => {
    if (!data) return { labels: [], datasets: [] };
    
    const labels = data && data.map(item => item[labelsKey]);
    const income = data && data.map(item => item[incomeKey]);
    const commission = data && data.map(item => item[commissionKey]);

    return {
      labels,
      datasets: [
        { label: 'Income', backgroundColor: '#2f2f8d', data: income },
        { label: 'Commission', backgroundColor: '#9087f3', data: commission },
      ],
    };
  };

  const chartData = {
    daywise: prepareChartData(dataDay, 'date', 'income', 'commission'),
    monthwise: prepareChartData(dataMonth, 'month', 'income', 'commission'),
    yearwise: prepareChartData(dataYear, 'year', 'income', 'commission'),
  };

  return (
    <div className={`${isMobile ? "" : "w-[48%]"} border-2 p-2 h-fit w-full`} >
      <div className="flex justify-between items-center min-w-full mb-4">
        <h2 className="text-xl font-bold px-2">Income vs Commission</h2>
        <IconButton onClick={handleMenuClick}>
          <BsThreeDotsVertical className="cursor-pointer" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleMenuClose(null)} className=''>
          <MenuItem onClick={() => handleMenuClose('daywise')}>Daywise</MenuItem>
          <MenuItem onClick={() => handleMenuClose('monthwise')}>Monthwise</MenuItem>
          <MenuItem onClick={() => handleMenuClose('yearwise')}>Yearwise</MenuItem>
        </Menu>
      </div>
      <div className="income-chart bg-white p-4 rounded-lg h-auto w-full">
        <Bar
          data={chartData[viewType]}
          options={{
            responsive: true,
            scales: {
              x: { title: { display: true, text: 'Time' } },
              y: { title: { display: true, text: 'Amount' } },
            },
          }}
        />
      </div>
    </div>
  );
};

export default IncomeVsCommissionChart;
