import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import logo from '../assets/img/logo/logo.png';
import axios from 'axios';

const Navbar = () => {
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('userData');



        const response = await axios.get('https://fitness-trackers.glitch.me/api/useraccount/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData(response.data);
      } catch (error) {
        ;
        console.error(error);
      }
    };

    fetchUserData();
  }, []);


  const [role, setRole] = useState('visitor');

  useEffect(() => {
    // Function to check and set role from cookie
    const checkRole = () => {
      const userData = Cookies.get('userData');
      if (userData) {
        try {
          const decodedToken = jwtDecode(userData);
          setRole(decodedToken.userAuth.userRole);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      } else {

        setRole('visitor');

      }
    };

    // Check role when the component mounts
    checkRole();

    // Optional: Polling interval to check for changes every X milliseconds
    const interval = setInterval(checkRole, 1000); // Check every 5 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once when the component mounts


  const logout = () => {
    Cookies.remove('userData');
    Cookies.remove('userRole');
    window.location.href = '/';
  };

  return (
    <header>
      <div className="header-area header-transparent nt-header">
        <div className="main-header header-sticky">
          <div className="container-fluid">
            {/* Ensure the wrapper aligns items in the middle */}
            <div className="menu-wrapper d-flex align-items-center justify-content-between" style={{ height: '100px' }}>
              {/* Logo section */}
              <div className="logo">
                <Link to="/Home">
                  <img src={logo} alt="Logo" />
                </Link>
              </div>

              {/* Main menu (centered navigation) */}
              <div className="main-menu f-right d-none d-lg-block">
                <nav>
                  <ul id="navigation" className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                    {role === 'visitor' ? (
                      <>
                        <li>
                          <Link to="/SignUp">SignUp</Link>
                        </li>
                        <li>
                          <Link to="/">Login</Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link to="/Home">Home</Link>
                        </li>
                        <li>
                          <Link to="/NutritionPlan">Track Nutrition</Link>
                        </li>
                        <li>
                          <Link to="/WorkoutPlan">WorkOut Plan</Link>
                        </li>

                        <li>
                          <Link>
                            {userData && userData.userProfileImage ? (
                              <img src={`../upload/${userData.userProfileImage}`} alt="Profile" className="profile-img" />

                            ) : (
                              <span>User</span>
                            )}

                          </Link>
                          <ul className="submenu">
                            <li></li>
                            <li><Link to={'/Profile'}>
                            
                            Profile</Link></li>
                            <li><Link to={'/dashboard'}>Dashboard</Link></li>
                            <li><Link onClick={logout}>Logout</Link></li>

                          </ul>
                        </li>
                        {/* <li>
                          <button className="Navbtn btn-danger">Dashboard</button>
                        </li> */}
                      </>
                    )}
                  </ul>
                </nav>
              </div>

              <div className="col-12">
                <div className="mobile_menu d-block d-lg-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;