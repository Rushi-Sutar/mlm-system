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
    <>
    <div className="bg-slate-100">
        <FinanceData />
        </div>
        {smallScreen ? 
        
        <div className="space-x-18 py-4">
        <CustomerJoiningGraph isMobile={true}/>
        <IncomeVsCommissionChart isMobile={true}/>
      </div> : 
        
        <div className="flex flex-wrap space-x-18 py-4 gap-2">
        <CustomerJoiningGraph />
        <IncomeVsCommissionChart/>
      </div>}
      
      <div className="flex flex-wrap justify-center gap-8 p-6 bg-slate-100">
        <TopPerformer />
        <MemberChart />
        <Rewards/>
      </div>
      <div className="flex justify-center gap-4 p-4">
        <PayoutChart />
      </div>
    </>
  );
};

export default Dashboard;
