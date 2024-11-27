import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Home from './pages/Home'
import UpdateProfile from './pages/updateProfile'
import NutritionPlan from './pages/NutritionPlan'
import SetNutrition from './pages/SetNutrition'
import WorkoutPlan from './pages/WorkoutPlan'
import SetWorkoutPlan from './pages/SetWorkoutPlan'
import ChangePassword from './pages/ChangePassword'
import Dashboard from './pages/Dashboard/Dashboard'
import Add_Meal from './pages/Dashboard/Add_Meal'



const App = () => {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Profile" element={<Profile />}/>
        <Route path="/Home" element={<Home />}/>
        <Route path="/NutritionPlan" element={<NutritionPlan />}/>
        <Route path="/SetNutrition" element={<SetNutrition />}/>
        <Route path="/WorkoutPlan" element={<WorkoutPlan />}/>
        <Route path="/SetWorkoutPlan" element={<SetWorkoutPlan />}/>
        <Route path="/updateProfile" element={<UpdateProfile />}/>
        <Route path="/ChangePassword" element={<ChangePassword />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/mealform" element={<Add_Meal />}/>
        
      </Routes>
    </BrowserRouter>

  )
}

export default App