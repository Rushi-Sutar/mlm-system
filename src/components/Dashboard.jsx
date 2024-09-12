import React from "react";
import MyBarChart from "./charts/MyBarChart";
import PayoutChart from "./charts/PayoutChart";
import TopPerformer from "./charts/TopPerformerChart";
import MemberChart from "./charts/MemberChart";
import IncomeCard from "./charts/IncomeCard";
import CustomerJoiningGraph from "./charts/CustomerJoiningGraph";
import FinanceData from "./charts/FinanceData";
import IncomeVsCommissionChart from "./charts/IncomeVsCommissionChart";
import Rewards from "./charts/Rewards";

const Dashboard = () => {
  let windowWidth = window.innerWidth;
  let smallScreen = windowWidth <= 768;
  
  return (
    <div className="h-[90vh] overflow-y-auto">
    <div className="bg-slate-100">
        <FinanceData />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <CustomerJoiningGraph className="sm:col-span-1" isMobile={smallScreen} />
          <IncomeVsCommissionChart className="sm:col-span-1" isMobile={smallScreen} />
        </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 p-6 bg-slate-100">
        <TopPerformer className="col-span-1" />
        <MemberChart className="col-span-1 sm:col-span-2 lg:col-span-1" />
        <Rewards className="col-span-1" />
        <PayoutChart className="col-span-1"/>
      </div>
     
    </div>
  );
};

export default Dashboard;
