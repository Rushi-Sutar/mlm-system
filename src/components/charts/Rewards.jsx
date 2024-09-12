import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../report/Loader";
import { oilcan, person_icon } from "../../assets";
import axios from "axios";

const Rewards = () => {
  const dispatch = useDispatch();

  const userRole = useSelector((state) => state.auth.userRole);

  const userName = userRole == 'admin' ?  useSelector(
    (state) => state?.auth?.authData?.admin?.username ) : useSelector(
      (state) => state?.auth?.authData?.customer?.username
  );

  const API = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
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

  const [response, setResponse] = useState(null);

  useEffect(() => {
    API.get(`/extracommission/${userName}`)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userName]);

  const getNewJoinMembersText = (data) => {
    const amount = Number(data.amount);
    const divideBy90 = amount / 90;
    if (divideBy90 === 5) return <img src={oilcan} alt="Reward 1" className="h-12" />;
    if (divideBy90 === 10) return <img src={oilcan} alt="Reward 2" className="h-12" />;
    if (divideBy90 === 15) return <img src={oilcan} alt="Reward 3" className="h-12" />;
    if (divideBy90 === 20) return <img src={oilcan} alt="Reward 4" className="h-12" />;
    return "none";
  }

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md w-full">
      <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">REWARDS</h1>
      <div className="overflow-x-auto max-h-64">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-zinc-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rewards</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-gray-700">
           {
            response && response.length > 0 ? (
              response.map((customer) => (
                <tr key={customer.username}>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={person_icon}
                      alt="Profile"
                    />
                    <div className="ml-4">
                      <div className="text-zinc-800 dark:text-zinc-200 font-semibold">
                        {customer.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100 text-left">
                    {getNewJoinMembersText(customer)}
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

export default Rewards;


