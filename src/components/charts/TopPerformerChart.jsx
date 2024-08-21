import React, { useEffect } from "react";
import { highPerforming } from "../../actions/highPerformingCustomer";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../report/Loader";
import { person_icon } from "../../assets";

const TopPerformerChart = () => {
  const dispatch = useDispatch();

  const userRole = useSelector((state) => state.auth.userRole);

  const userName = userRole == 'admin' ?  useSelector(
    (state) => state?.auth?.authData?.admin?.username ) : useSelector(
      (state) => state?.auth?.authData?.customer?.username
  );

  const highPerformance = useSelector((state) => state.highPerformingCustomer);
  useEffect(() => {
    dispatch(highPerforming(userName));
  }, [dispatch]);

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md w-half">
      <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">TEAM PERFORMANCE</h1>
      <div className="overflow-x-auto max-h-64">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-zinc-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">New Join Members</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-gray-700">
           {
            highPerformance && highPerformance.length > 0 ? (
              highPerformance.map((customer) => (
                <tr key={customer.customer}>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={person_icon}
                      alt="Profile"
                    />
                    <div className="ml-4">
                      <div className="text-zinc-800 dark:text-zinc-200 font-semibold">
                        {customer.customer}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100 text-center">
                    {customer.count}
                  </td>
                </tr>
              ))
            ) : 
            <tr>
                <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100"><Loader/></td>
              </tr>
           } 
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopPerformerChart;
