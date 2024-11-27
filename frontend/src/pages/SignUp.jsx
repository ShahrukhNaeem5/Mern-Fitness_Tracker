import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/style.css';
import picture from '../assets/img/SignUp.webp'

const SignUp = () => {
    const navigate = useNavigate();
    const [UserName, setUserName] = useState('');
    const [UserEmail, setUserEmail] = useState('');
    const [UserPassword, setUserPassword] = useState('');
    const [UserCPassword, setUserCPassword] = useState('');
    const [UserImage, setUserImage] = useState(null);
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordErrors, setPasswordErrors] = useState([]);

    const toastMessage = (message, type) => {
        if (type === "error") {
            toast.error(message, { position: "top-right" });
        } else {
            toast.success(message, { position: "top-right" });
        }
    }

    const validatePassword = (password) => {
        const errors = [];
        const passwordCriteria = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        if (!passwordCriteria.length) errors.push("Minimum 8 characters");
        if (!passwordCriteria.uppercase) errors.push("At least 1 uppercase letter");
        if (!passwordCriteria.lowercase) errors.push("At least 1 lowercase letter");
        if (!passwordCriteria.number) errors.push("At least 1 number");
        if (!passwordCriteria.specialChar) errors.push("At least 1 special character");

        return { errors };
    };

    const handlePasswordChange = (password) => {
        setUserPassword(password);
        const { errors } = validatePassword(password);
        setPasswordErrors(errors);
        if (errors.length === 0) {
            setErrorMessage('');
        } else {
            setErrorMessage('Password must meet the following criteria:');
        }
    };

    const HandleSubmit = async (e) => {
        e.preventDefault();

        const passwordValidation = validatePassword(UserPassword);
        if (passwordValidation.errors.length > 0) {
            setErrorMessage(passwordValidation.errors.join(', '));
            return;
        } else {
            setErrorMessage('');
        }

        if (UserPassword !== UserCPassword) {
            toastMessage("Passwords do not match!", "error");
            return;
        }

        const formData = new FormData();
        formData.append('userName', UserName);
        formData.append('userEmail', UserEmail);
        formData.append('userPassword', UserPassword);
        if (UserImage) {
            formData.append('profileImage', UserImage);
        }

        try {
            const response = await axios.post("http://localhost:4000/api/useraccount/", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200) {
                await axios.post("http://localhost:4000/api/send-otp", { email: UserEmail });
                setIsOtpSent(true);
                toastMessage("Account Registered Successfully. OTP sent to your email!", "success");
            }
        } catch (error) {
            toastMessage(error.response.data.error, "error");
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/api/verify-otp", { email: UserEmail, otp });
            if (response.status === 200) {
                toastMessage("Email verified successfully!", "success");
                navigate('/');
            }
        } catch (error) {
            toastMessage(error.response.data.error, "error");
        }
    };

    return (
        <>
            <div className="main-signup-div">
            <div className="background-circle circle1"></div>
      <div className="background-circle circle2"></div>
      <div className="background-circle circle3"></div>
      <div className="background-circle circle4"></div>
      <div className="background-circle circle5"></div>
                <div className="container signup-container">
                    <div className="row mt-4">
                        <div className="col-12 col-md-6 col-sm-12 d-flex justify-content-center align-items-center">
                            <img src={picture} alt="Jeep" className="img-fluid sign-up-img" />
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="signup-form">
                                <h2>Registration Form</h2>
                                <form onSubmit={isOtpSent ? verifyOtp : HandleSubmit}>
                                    <div className="mb-3">
                                        {errorMessage && <p className="error">{errorMessage}</p>}
                                        <label htmlFor="firstName" className="form-label">Name</label>
                                        <input type="text" className="form-control" onChange={(e) => setUserName(e.target.value)} placeholder="Enter Your Name" required />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" onChange={(e) => setUserEmail(e.target.value)} placeholder="Enter Your Email Address" required />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Create Password</label>
                                        <input type="password" className="form-control" onChange={(e) => handlePasswordChange(e.target.value)} placeholder="Enter Your Password" required />
                                        {passwordErrors.length > 0 && (
                                            <ul className="password-errors">
                                                {passwordErrors.map((error, index) => (
                                                    <li key={index} className="text-dangerS">{error}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                        <input type="password" className="form-control" onChange={(e) => setUserCPassword(e.target.value)} placeholder="Confirm Your Password" required />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="userimage">Upload Image</label>
                                        <input type="file" accept="image/*" onChange={(e) => setUserImage(e.target.files[0])} required />
                                        <div className="mt-4 alert-danger p-1">
                                        <strong>Allowed formats:</strong> jpeg, jpg, png, gif
                                    </div>
                                    </div>

                                    <button type="submit" className="btn w-100">{isOtpSent ? "Verify OTP" : "Sign Up"}</button>

                                    {isOtpSent && (
                                        <div className="mb-3">
                                            <label htmlFor="otp" className="form-label">Enter OTP</label>
                                            <input type="text" className="form-control" onChange={(e) => setOtp(e.target.value)} placeholder="Enter the OTP sent to your email" required />
                                        </div>
                                    )}
                                </form>
                                <ToastContainer />
                                <div className="login-text">
                                    If you have an account, <Link to={'/'}>Login Here</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;