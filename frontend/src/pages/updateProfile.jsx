import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/style.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const UpdateProfile = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('userData');

        if (!token) {
          toast.error('No valid session found, please login again');
          navigate('/SignIn');
          return;
        }

        const response = await axios.get(`http://localhost:4000/api/useraccount/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Set the initial user data in form fields
        setUserName(response.data.userName);
        setUserEmail(response.data.userEmail);
        setPreviewImage(`http://localhost:4000/upload/${response.data.userProfileImage}`);
      } catch (error) {
        toast.error('Failed to fetch user data');
        console.error(error);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle form submission to update the profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = Cookies.get('userData');
      if (!token) {
        toast.error('Session expired, please login again.');
        navigate('/SignIn');
        return;
      }

      // Create form data to handle image upload and text fields
      const formData = new FormData();
      formData.append('userName', userName);
      formData.append('userEmail', userEmail);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await axios.put(`http://localhost:4000/api/useraccount/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  return (
    <div className="upd-p">
      <Navbar/>
      <div className="update-profile-container">
        <h2>Update Profile</h2>
        <br />
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="userName">Name</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userEmail">Email</label>
            <input
              type="email"
              id="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profileImage">Profile Image</label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Preview" width="100px" />
              </div>
            )}
          </div>

          <button type="submit" className="btn">Update Profile</button>
        </form>
        <ToastContainer />
      </div>
      <Footer/>
    </div>

  );
};

export default UpdateProfile;