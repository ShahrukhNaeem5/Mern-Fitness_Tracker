import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import axios from 'axios';

const DashNav = () => {
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

    const logout = () => {
        Cookies.remove('userData');
        Cookies.remove('userRole');
        window.location.href = '/';
    };

    return (
        <div>
            <nav className="navbar navbar-expand bg-secondary navbar-dark sticky-top px-4 py-0">
                <Link to="/" className="navbar-brand d-flex d-lg-none me-4">
                    <h2 className="text-primary mb-0"><i className="fa fa-user-edit"></i></h2>
                </Link>
                <Link to="#" className="sidebar-toggler flex-shrink-0">
                    <i className="fa fa-bars"></i>
                </Link>
                <form className="d-none d-md-flex ms-4">
                    <input className="form-control bg-dark border-0" type="search" placeholder="Search" />
                </form>
                <div className="navbar-nav align-items-center ms-auto">
                    <div className="nav-item dropdown">
                        <Link to="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                            {userData?.userProfileImage && (
                                <img src={`http://localhost:4000/upload/${userData.userProfileImage}`} alt={userData.userName} className="profile-img" style={{ width: '40px', height: '40px' }} />
                            )}
                            <span className="d-none d-lg-inline-flex">{userData?.userName || 'Guest'}</span>
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end bg-secondary border-0 rounded-0 rounded-bottom m-0">
                            <Link to="../Profile" className="dropdown-item">My Profile</Link>
                            <Link to="../ChangePassword" className="dropdown-item">Change Password</Link>
                            <Link onClick={logout} className="dropdown-item">Log Out</Link>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default DashNav;
