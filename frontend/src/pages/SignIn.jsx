import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import '../assets/css/style.css';
import picture from '../assets/img/SignIn.png'

const SignIn = () => {
  const [userData, setUserData] = useState();
  const navigate = useNavigate();
  const [UserEmail, setUserEmail] = useState('');
  const [UserPassword, setUserPassword] = useState('');
  const [logoutTimeout, setLogoutTimeout] = useState(null);
  const [errorMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('userData');

        if (token) {
          navigate('/Home');
          return;
        }

        const response = await axios.get('http://localhost:4000/api/useraccount/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const toastMessage = (message, type) => {
    (type === "error") ? (
      toast.error(message, {
        position: "top-right"
      })
    ) : (
      toast.success(message, {
        position: "top-right"
      })
    );
  };

  const HandleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      userEmail: UserEmail,
      userPassword: UserPassword
    };

    try {
      const LoginResponse = await axios.post("http://localhost:4000/api/useraccount/SignIn/", userData);

      if (LoginResponse.status === 200) {
        const token = LoginResponse.data.token;

        Cookies.set('userData', token, { expires: 7, secure: true, sameSite: 'Strict' });

        toastMessage("Login Successfully !!", "Success");
        console.clear(); 
        setTimeout(() => {
          navigate('/Home');
        }, 1500);


        const timeoutId = setTimeout(() => {
          HandleLogout();
        }, 300000);
        setLogoutTimeout(timeoutId);
      }
    } catch (error) {
      toastMessage(error.response.data.error, "error");
    }
  };

  const HandleLogout = () => {
    Cookies.remove('userData');
    Cookies.remove('userRole');
    toastMessage("You have been logged out.", "error");

    if (logoutTimeout) {
      clearTimeout(logoutTimeout);
    }

    window.location.reload();
  };

  useEffect(() => {
    return () => {
      if (logoutTimeout) {
        clearTimeout(logoutTimeout);
      }
    };
  }, [logoutTimeout]);


  return (
    <div className="main-signup-div">
    <ToastContainer/>
      <div className="background-circle circle1"></div>
      <div className="background-circle circle2"></div>
      <div className="background-circle circle3"></div>
      <div className="background-circle circle4"></div>
      <div className="background-circle circle5"></div>
      <div className="container signup-container">
        <div className="row mt-4">
          <div className="col-12 col-md-6 col-sm-12 d-flex justify-content-center align-items-center img-div">
            <img src={picture} alt="Jeep" className="img-fluid sign-in-img" />

          </div>
          <div className="col-12 col-md-6 col-sm-12">
            <div className="signup-form">
              <h2>Login Form</h2>
              <p>Let's Login From Here</p>
              <form onSubmit={HandleLogin}>
                <div className="mb-3">
                  {errorMessage && <p className="error">{errorMessage}</p>}
                  <label htmlFor="email" className="form-label">
                    <i className="fas fa-envelope"></i>
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter Your Email Address"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock"></i>
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    onChange={(e) => setUserPassword(e.target.value)}
                    placeholder="Enter Your Password"
                    required
                  />
                </div>
                <button type="submit" className="btn w-100 mt-5">Sign In</button>
              </form>
              <div className="divider">or</div>
              <div className="social-login">
                <Link className="facebook"><i className="fab fa-facebook-f"></i></Link>
                <Link className="google"><i className="fab fa-google"></i></Link>
                <Link className="twitter"><i className="fab fa-twitter"></i></Link>
              </div>
              <div className="login-text">
                Create Your Account If You Don't have, <Link to={'/SignUp'}>SignUp Here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
