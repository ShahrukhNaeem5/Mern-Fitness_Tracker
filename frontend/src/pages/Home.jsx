import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import blog1 from "../assets/img/gallery/blog1.png";
import blog2 from "../assets/img/gallery/blog2.png";
import team1 from "../assets/img/gallery/team1.png";
import team2 from "../assets/img/gallery/team2.png";
import team3 from "../assets/img/gallery/team3.png";
import galleryimage1 from "../assets/img/gallery/gallery1.png";
import galleryimage2 from "../assets/img/gallery/gallery2.png";
import galleryimage3 from "../assets/img/gallery/gallery3.png";
import galleryimage4 from "../assets/img/gallery/gallery4.png";
import galleryimage5 from "../assets/img/gallery/gallery5.png";
import galleryimage6 from "../assets/img/gallery/gallery6.png";
import aboutpic from "../assets/img/gallery/about.png";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const Home = () => {
  const [userData, setUserData] = useState();
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

    <div className='black-bg'>
      <Navbar />
      <main>
        <div className="slider-area position-relative">
          <div className="slider-active">

            <div className="single-slider slider-height d-flex align-items-center">
              <div className="container">
                <div className="row">
                  <div className="col-xl-9 col-lg-9 col-md-10">
                    <div className="hero__caption">
                      {userData ? (
                        <span data-animation="fadeInLeft" data-delay="0.1s">Hi, {userData.userName}</span>
                      ) : (
                        <span>User</span>
                      )}
                      <h1 data-animation="fadeInLeft" data-delay="0.4s">Fitness Tracking</h1>
                      <Link className="border-btn hero-btn" data-animation="fadeInLeft" data-delay="0.8s">My Courses</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="traning-categories black-bg">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-6 col-lg-6">
                <div className="single-topic text-center mb-30">
                  <div className="topic-img">
                    <img src="https://static.vecteezy.com/system/resources/previews/033/741/039/non_2x/various-types-of-food-on-a-dark-background-ai-generated-photo.jpg" alt="" />
                    <div className="topic-content-box">
                      <div className="topic-content">
                        <h3>Nutrition</h3>
                        <p>Nutrition is the process of providing or obtaining the essential food  and nutrients <br /> necessary for health, growth, and energy.</p>
                        <Link to={"/NutritionPlan"} className="border-btn">Track Nutrition</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6">
                <div className="single-topic text-center mb-30">
                  <div className="topic-img">
                    <img src="https://st3.depositphotos.com/1835273/15480/i/450/depositphotos_154803348-stock-photo-muscular-bodybuilder-guy-doing-exercises.jpg" alt="" />
                    <div className="topic-content-box">
                      <div className="topic-content">
                        <h3>Excercise</h3>
                        <p>Exercise is any physical activity that enhances overall fitness by strengthening  <br /> muscles, improving cardiovascular function</p>

                        <Link to={"/WorkoutPlan"} className="border-btn">Plan Workout</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="team-area fix">
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="section-tittle text-center mb-55 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".1s">
                  <h2 >What I Offer</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="single-cat text-center mb-30 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s" >
                  <div className="cat-icon">
                    <img src={team1} alt="" />
                  </div>
                  <div className="cat-cap">
                    <h5><Link >Body Building</Link></h5>
                    <p>You’ll look at graphs and charts in Task One, how to approach the task </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="single-cat text-center mb-30 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".4s">
                  <div className="cat-icon">
                    <img src={team2} alt="" />
                  </div>
                  <div className="cat-cap">
                    <h5><Link >Muscle Gain</Link></h5>
                    <p>You’ll look at graphs and charts in Task One, how to approach the task </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="single-cat text-center mb-30 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".6s">
                  <div className="cat-icon">
                    <img src={team3} alt="" />
                  </div>
                  <div className="cat-cap">
                    <h5><Link >Weight Loss</Link></h5>
                    <p>You’ll look at graphs and charts in Task One, how to approach the task </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="gallery-area section-padding30 ">
          <div className="container-fluid ">
            <div className="row">
              <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                <div className="box snake mb-30">
                  <div className="gallery-img big-img" style={{ backgroundImage: `url(${galleryimage1})` }}
                  ></div>
                  <div className="overlay">
                    <div className="overlay-content">
                      <h3>Muscle gaining </h3>
                      <Link ><i className="ti-plus"></i></Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                <div className="box snake mb-30">
                  <div className="gallery-img big-img" style={{ backgroundImage: `url(${galleryimage2})` }}
                  ></div>
                  <div className="overlay">
                    <div className="overlay-content">
                      <h3>Muscle gaining </h3>
                      <Link ><i className="ti-plus"></i></Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                <div className="box snake mb-30">
                  <div className="gallery-img big-img" style={{ backgroundImage: `url(${galleryimage3})` }}
                  ></div>
                  <div className="overlay">
                    <div className="overlay-content">
                      <h3>Muscle gaining </h3>
                      <Link ><i className="ti-plus"></i></Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                <div className="box snake mb-30">
                  <div className="gallery-img big-img" style={{ backgroundImage: `url(${galleryimage4})` }}
                  ></div>
                  <div className="overlay">
                    <div className="overlay-content">
                      <h3>Muscle gaining </h3>
                      <Link ><i className="ti-plus"></i></Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                <div className="box snake mb-30">
                  <div className="gallery-img big-img" style={{ backgroundImage: `url(${galleryimage5})` }}
                  ></div>
                  <div className="overlay">
                    <div className="overlay-content">
                      <h3>Muscle gaining </h3>
                      <Link ><i className="ti-plus"></i></Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div className="box snake mb-30">
                  <div className="gallery-img big-img" style={{ backgroundImage: `url(${galleryimage6})` }}>
                  </div>
                  <div className="overlay">
                    <div className="overlay-content">
                      <h3>Muscle gaining </h3>
                      <Link ><i className="ti-plus"></i></Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <section className="about-area2 fix pb-padding pt-50 pb-80">
          <div className="support-wrapper align-items-center">
            <div className="right-content2">

              <div className="right-img wow fadeInUp" data-wow-duration="1s" data-wow-delay=".1s">
                <img src={aboutpic} alt="" />
              </div>
            </div>
            <div className="left-content2">

              <div className="section-tittle2 mb-20 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                <div className="front-text">
                  <h2 className="">About Me</h2>
                  <p>You’ll look at graphs and charts in Task One, how to approach the task and the language needed
                    for a successful answer. You’ll examine Task Two questions and learn how to plan, write and
                    check academic essays.</p>
                  <p className="mb-40">Task One, how to approach the task and the language needed for a successful answer. You’ll
                    examine Task Two questions and learn how to plan, write and check academic essays.</p>
                  <Link className="border-btn">My Courses</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-blog-area pt-10 pb-50">
          <div className="container">

            <div className="row justify-content-center">
              <div className="col-lg-7 col-md-9 col-sm-10">
                <div className="section-tittle text-center mb-100 wow fadeInUp" data-wow-duration="2s" data-wow-delay=".2s">
                  <h2>From Blog</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-6 col-lg-6 col-md-6">
                <div className="home-blog-single mb-30 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".4s">
                  <div className="blog-img-cap">
                    <div className="blog-img">
                      <img src={blog1} alt="" />
                    </div>
                    <div className="blog-cap">
                      <span>Gym & Fitness</span>
                      <h3><Link >Your Antibiotic One Day To 10 Day Options</Link></h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6">
                <div className="home-blog-single mb-30 wow fadeInUp" data-wow-duration="2s" data-wow-delay=".6s">
                  <div className="blog-img-cap">
                    <div className="blog-img">
                      <img src={blog2} alt="" />
                    </div>
                    <div className="blog-cap">
                      <span>Gym & Fitness</span>
                      <h3><Link >Your Antibiotic One Day To 10 Day Options</Link></h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="video-area section-bg2 d-flex align-items-center" data-background="assets/img/gallery/video-bg.png">
          <div className="container">
            <div className="video-wrap position-relative">
              <div className="video-icon" >
                <Link className="popup-video btn-icon" ><i className="fas fa-play"></i></Link>
              </div>
            </div>
          </div>
        </div>

        <section className="services-area">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-8">
                <div className="single-services mb-40 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".1s">
                  <div className="features-icon">
                    <img src="assets/img/icon/icon1.svg" alt="" />
                  </div>
                  <div className="features-caption">
                    <h3>Location</h3>
                    <p>You’ll look at graphs and charts in Task One, how to approach </p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-8">
                <div className="single-services mb-40 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s">
                  <div className="features-icon">
                    <img src="assets/img/icon/icon2.svg" alt="" />
                  </div>
                  <div className="features-caption">
                    <h3>Phone</h3>
                    <p>(90) 277 278 2566</p>
                    <p>  (78) 267 256 2578</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-8">
                <div className="single-services mb-40 wow fadeInUp" data-wow-duration="2s" data-wow-delay=".4s">
                  <div className="features-icon">
                    <img src="assets/img/icon/icon3.svg" alt="" />
                  </div>
                  <div className="features-caption">
                    <h3>Email</h3>
                    <p>jacson767@gmail.com</p>
                    <p>contact56@zacsion.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <div id="back-top" >
        <Link title="Go to Top" > <i className="fas fa-level-up-alt"></i></Link>
      </div>
    </div>
  )
}

export default Home