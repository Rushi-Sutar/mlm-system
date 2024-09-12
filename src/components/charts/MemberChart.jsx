import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { newMembers } from '../../actions/newMembers';
import Loader from "../report/Loader";

const MemberChart = () => {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.newMembers);

  useEffect(() => {
    dispatch(newMembers());
  }, [dispatch]);

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md w-full">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">NEW MEMBERS</h2>
      <div className="overflow-x-auto max-h-64 ">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-zinc-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">First Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Name</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-gray-700">
            {members && members.length > 0 ? (
              members.map((member) => (
                <tr key={member.username}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100">{member.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100">{member.first_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">{member.last_name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100"><Loader/></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberChart;
