import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import SalesView from './SalesView';
import SaleRevenue from './SaleRevenue';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesCharts = () => {
    

    return (
        <div className="container-fluid pt-4 px-4">
            <div className="row g-4">
                {/* Dropdown for Worldwide Sales */}
               <SalesView/>

                {/* Dropdown for Sales & Revenue */}
               <SaleRevenue/>
            </div>
        </div>
    );
};

export default SalesCharts;
