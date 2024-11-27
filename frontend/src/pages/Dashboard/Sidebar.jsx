import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import user from "./assests/img/user.jpg"

const Sidebar = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get('userData');

                if (!token) {
                    toast.error('No valid session found, please login again');
                    navigate('/');
                    return;
                }

                const response = await axios.get('http://localhost:4000/api/useraccount/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUserData(response.data);
            } catch (error) {
                toast.error('Failed to fetch user data');
                console.error(error);
            }
        };

        fetchUserData();
    }, [navigate]);

    return (
        <div><div className="sidebar pe-4 pb-3">
            <nav className="navbar bg-secondary navbar-dark">
                <Link to="../Home" className="navbar-brand mx-4 mb-3">
                    <h3 className="text-primary small"><i className="fa fa-user-edit me-2"></i>Fitness-Tracker</h3>
                </Link>
                <div className="d-flex align-items-center ms-4 mb-4">
                    <div className="position-relative">
                    {userData?.userProfileImage && (
                                <img src={`http://localhost:4000/upload/${userData.userProfileImage}`} alt={userData.userName} className="profile-img" style={{ width: '40px', height: '40px' }} />
                            )}
                        <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
                    </div>
                    <div className="ms-3">
                        <h6 className="mb-0">{userData?.userName}</h6>
                        <span>Admin</span>
                    </div>
                </div>
                <div className="navbar-nav w-100">
                    <Link href="/dashboard" className="nav-item nav-link active"><i className="fa fa-tachometer-alt me-2"></i>Dashboard</Link>
                    <Link to={'/mealform'} className="nav-item nav-link"><i className="fa fa-th me-2"></i>Add Meal Form</Link>
                </div>
            </nav>
        </div></div>
    )
}

export default Sidebar
