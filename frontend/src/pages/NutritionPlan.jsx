import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import blog1 from "../assets/img/gallery/blog1.png";
import blog2 from "../assets/img/gallery/blog2.png";
import aboutpic from "../assets/img/gallery/about.png";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NutritionPlan = () => {
    const [mealData, setMealData] = useState({});
    const [error] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


    useEffect(() => {
        const fetchMealPlans = async () => {
            const token = Cookies.get('userData');

            if (!token) {
                toast.error('No valid session found, please login again');
                navigate('/');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:4000/api/useraccount/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const { _id: userId } = response.data;
                const mealResponse = await axios.get(`http://localhost:4000/api/meals/user/${userId}/mealPlans`);
                const mealPlans = mealResponse.data;

                const organizedMealData = {};
                for (const mealPlan of mealPlans) {
                    const { day, meals, _id: mealPlanId } = mealPlan;
                    organizedMealData[day] = {
                        mealPlanId,
                        meals: await Promise.all(
                            meals.map(async (meal) => {
                                const mealDetailResponse = await axios.get(`http://localhost:4000/api/meals/details/${meal.mealId}`);
                                return {
                                    ...meal,
                                    name: mealDetailResponse.data.mealName || 'Unknown',
                                    category: mealDetailResponse.data.mealCategory || 'Unknown',
                                };
                            })
                        ),
                    };
                }

                setMealData(organizedMealData);
                toast.success('Meal plans fetched successfully!');
            } catch (error) {
                toast.info('There are no meal plans.');
            } finally {
                setLoading(false);
            }
        };

        fetchMealPlans();
    }, [navigate]);
    const getButtonCount = (mealsForDay) => {
        const breakfastCount = mealsForDay.filter(meal => meal.category === 'Breakfast').length;
        const lunchCount = mealsForDay.filter(meal => meal.category === 'Lunch').length;
        const dinnerCount = mealsForDay.filter(meal => meal.category === 'Dinner').length;

        const totalCount = Math.max(breakfastCount, lunchCount, dinnerCount);
        return totalCount > 1 ? 1 : totalCount;
    };

    return (
        <div className="black-bg">
            <Navbar />
            <ToastContainer />
            <main>
                {loading && <p>Loading meals...</p>}
                {error && <div className="alert alert-danger">{error}</div>}
                <section className="team-area fix">
                    <div className="container n-table">
                        <table className="table table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">Day</th>
                                    <th scope="col">Breakfast</th>
                                    <th scope="col">Lunch</th>
                                    <th scope="col">Dinner</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody className='nutrition-data-table'>
                                {days.map((day) => {
                                    const mealsForDay = mealData[day]?.meals || [];
                                    const totalRows = Math.max(
                                        mealsForDay.filter(meal => meal.category === 'Breakfast').length,
                                        mealsForDay.filter(meal => meal.category === 'Lunch').length,
                                        mealsForDay.filter(meal => meal.category === 'Dinner').length
                                    );

                                    return (
                                        <React.Fragment key={day}>
                                            {Array.from({ length: totalRows }).map((_, rowIndex) => (
                                                <tr key={`${day}-${rowIndex}`}>
                                                    {rowIndex === 0 && (
                                                        <td className='fw-bold border' rowSpan={totalRows}>
                                                            {day}
                                                        </td>
                                                    )}
                                                    <td>
                                                        {mealsForDay.filter(meal => meal.category === 'Breakfast')[rowIndex]?.name || '---'}
                                                       
                                                    </td>
                                                    <td>
                                                        {mealsForDay.filter(meal => meal.category === 'Lunch')[rowIndex]?.name || '---'}
                                                    </td>
                                                    <td>
                                                        {mealsForDay.filter(meal => meal.category === 'Dinner')[rowIndex]?.name || '---'}
                                                          </td>
                                                    <td className='fw-bold border'>
                                                        {rowIndex < getButtonCount(mealsForDay) ? (
                                                            <Link to={`/SetNutrition?mealPlanId=${mealData[day]?.mealPlanId || ''}&day=${day}`} className="btn btn-danger fixed-button">Update</Link>
                                                        ) : null}
                                                    </td>
                                                </tr>
                                            ))}
                                            {totalRows === 0 && (
                                                <tr>
                                                    <td className='fw-bold border' rowSpan={1}>{day}</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td>---</td>
                                                    <td className='fw-bold border'>
                                                        <Link to={`/SetNutrition?day=${day}`} className="btn btn-danger fixed-button">Set</Link>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>


                        </table>
                    </div>
                </section>
                <section className="about-area2 pb-padding pt-50 pb-80">
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
                                            <h3><Link>Your Antibiotic One Day To 10 Day Options</Link></h3>
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
    );
};

export default NutritionPlan;
