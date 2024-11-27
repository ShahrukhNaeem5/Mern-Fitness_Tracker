import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';



const Profile = () => {
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
    <div>
      <Navbar/>
    <div className="main-profile">
      {userData && (
        <section className="profile-card">
          <div className="image">
            {userData.userProfileImage && (
              <img src={`http://localhost:4000/upload/${userData.userProfileImage}`} alt={userData.userName} />
            )}
          </div>
          <div className="text-data">
            <h2>{userData.userName}</h2>
            <p>{userData.userEmail}</p>
          </div>
          <div className="buttons">
            <Link to={`/updateProfile`}>Update Profile</Link>
            <Link to={`/ChangePassword`}>Change Password</Link>
          </div>
          <div className="analytics">
            <div className="data">
              <i className="fa-solid fa-heart"></i>
              <p>60K</p>
            </div>
            <div className="data">
              <i className="fa-regular fa-comment"></i>
              <p>60K</p>
            </div>
            <div className="data">
              <i className="fa-solid fa-share"></i>
              <p>60K</p>
            </div>
          </div>
        </section>
      )}
    </div>
    <Footer/>
    </div>
  );
};

export default Profile;
