import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        const token = Cookies.get('userData');

        const passwordData = {
            currentPassword,
            newPassword,
            confirmPassword
        };

        try {
            const response = await axios.put("http://localhost:4000/api/useraccount/changePassword", passwordData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success("Password changed successfully!");
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setRedirect(true);
            }
        } catch (error) {
            if (error.response?.status === 400) {
                toast.error(error.response.data.error);
            } else {
                const errorMessage = error.response?.data?.error || "An error occurred.";
                toast.error(errorMessage);
            }
        }
    };
    if (redirect) {
        setTimeout(() => {
            navigate('/');
          }, 1500);
    }

    return (
        <>
            <Navbar />
            <div className="main-change-password">
                <div className="change-password-container">
                    <h2>Change Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn">Change Password</button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default ChangePassword;
