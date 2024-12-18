import React from 'react'
import Sidebar from './Sidebar'
import DashNav from './DashNav'

import TotalCal from './TotalCal'
import MealForm from '../MealForm'

const Add_Meal = () => {
  return (
    <>
  <div className="container-fluid position-relative d-flex p-0">
      
      {/* SIDEBAR */}
      <Sidebar/>


      <div className="content">
         
         {/* DASHNAV */}
         <DashNav/>
         <TotalCal/>

         <MealForm/>
         
         
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

export default Add_Meal