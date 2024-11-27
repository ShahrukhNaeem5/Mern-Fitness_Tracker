import React from 'react'
import { Link } from 'react-router-dom';
import ftlogo from '../assets/img/logo/logo2_footer.png';

const Footer = () => {
  return (
    <footer>

    <div className="footer-area black-bg">
      <div className="container">
        <div className="footer-top footer-padding">

          <div className="row">
            <div className="col-xl-12">
              <div className="single-footer-caption mb-50 text-center">

                <div className="footer-logo wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s">
                  <a href="index-2.html"><img src={ftlogo} alt="" /></a>
                </div>

                <div className="header-area main-header2 wow fadeInUp" data-wow-duration="2s" data-wow-delay=".4s">
                  <div className="main-header main-header2">
                    <div className="menu-wrapper menu-wrapper2">

                      <div className="main-menu main-menu2 text-center">
                        <nav>
                          <ul>
                            <li><a href="index-2.html">Home</a></li>
                            <li><a href="about.html">About</a></li>
                            <li><a href="courses.html">Courses</a></li>
                            <li><a href="pricing.html">Pricing</a></li>
                            <li><a href="gallery.html">Gallery</a></li>
                            <li><a href="contact.html">Contact</a></li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="footer-social mt-30 wow fadeInUp" data-wow-duration="3s" data-wow-delay=".8s">
                  <a href="#"><i className="fab fa-twitter"></i></a>
                  <a href="https://bit.ly/sai4ull"><i className="fab fa-facebook-f"></i></a>
                  <a href="#"><i className="fab fa-pinterest-p"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="row d-flex align-items-center">
            <div className="col-lg-12">
              <div className="footer-copy-right text-center">
                <p>
                  Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This website is completed by <Link to="/Home">ZACSON</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </footer>
  )
}

export default Footer