import React from 'react'
import "./assests/Dashboard.css"
import "./assests/bootstrap.min.css"
import "./assests/lib/owlcarousel/assets/owl.carousel.min.css"
import "./assests/lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css"
import user from "./assests/img/user.jpg"
import SalesCharts from './SalesCharts'
import Sidebar from './Sidebar'
import DashNav from './DashNav'
import Table_Nutrition from './Table_Nutrition'
import Table_Workout from './Table_Workout'
import TotalCal from './TotalCal'
const Dashboard = () => {

  return (
    <>
     <div className="container-fluid position-relative d-flex p-0">
    
      
        {/* SIDEBAR */}
        <Sidebar/>


        <div className="content">
           
           {/* DASHNAV */}
           <DashNav/>
           <TotalCal/>

            {/* CHARTS */}
            <SalesCharts/>

           {/* TABLE */}
           <Table_Nutrition/>
           <Table_Workout/>
           
          
            <div className="container-fluid pt-4 px-4">
                <div className="bg-secondary rounded-top p-4">
                    <div className="row">
                        <div className="col-12 col-sm-6 text-center text-sm-start">
                            &copy; <a href="#">ZASCON</a>, All Right Reserved. 
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up"></i></a>
    </div>
    </>
  )
}

export default Dashboard