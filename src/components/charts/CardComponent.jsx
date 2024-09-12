import React from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import { LuInfo } from "react-icons/lu";

const CardComponent = ({ title, amount, tooltip }) => {
    return (
        <div className="grid grid-cols-1 w-full">
            <div className="bg-white shadow-md rounded-lg p-4 w-full">
                <div className="flex justify-between items-center mb-2 w-full">
                    <span className="text-gray-700">{title}</span>
                    <span className="text-gray-500 cursor-pointer p-2 mb-6" data-tooltip-id={title}><LuInfo  /></span>
                    <Tooltip id={title} place="top" type="dark" effect="solid">
                        {tooltip}
                    </Tooltip>
                </div>
                <div className="text-2xl text-emerald-600">{amount}</div>
            </div>
        </div>
    );
};

export default CardComponent;
