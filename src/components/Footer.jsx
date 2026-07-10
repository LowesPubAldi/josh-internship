import React from "react";
import { Link } from "react-router-dom";
import Logo from "../images/Ultraverse.png";

const Footer = () => {
  return (
    <footer className="footer-light">
      <div className="container">
        <div className="row footer-columns justify-content-center text-center">
          <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 footer-column">
            <div className="widget">
              <h5>Marketplace</h5>
              <ul>
                <li>
                  <span className="no-cursor">
                    All NFTs
                  </span>
                </li>
                <li>
                  <span className="no-cursor">
                    Art
                  </span>
                </li>
                <li>
                  <span className="no-cursor">
                    Music
                  </span>
                </li>
                <li>
                  <span className="no-cursor">
                    Domain Names
                  </span>
                </li>
                <li>
                  <span className="no-cursor">
                    Virtual World
                  </span>
                </li>
                <li>
                  <span className="no-cursor">
                    Collectibles
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 footer-column">
            <div className="widget">
              <h5>Resources</h5>
              <ul>
                <li>
                  <span className="no-cursor">
                    Help Center
                  </span>
                </li>
                <li>
                  <span className="no-cursor">
                    Partners
                  </span>
                </li>
                <li>
                  <span className="no-cursor">
                    Suggestions
                  </span>
                </li>
                <li>
                  <span className="no-cursor">
                    Discord
                  </span>
                </li>
                <li>
                  <span className="no-cursor">
                    Docs
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 footer-column">
            <div className="widget">
              <h5>Community</h5>
              <ul>
                <li>
                  <span className="no-cursor">
                    Community
                  </span>
                </li>
                <li>
                  <span className="no-cursor">
                    Documentation
                  </span>
                </li>
                <li>
                  <span className="no-cursor">
                    Brand Assets
                  </span>
                </li>
                <li>
                  <span className="no-cursor">
                    Blog
                  </span>
                </li>
                <li>
                  <span className="no-cursor">
                    Forum
                  </span>
                </li>
                <li>
                  <span className="no-cursor">
                    Mailing List
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="subfooter">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="de-flex footer__wrapper">
                <div className="de-flex-col">
                  <Link className="footer__link" to="/">
                    <img alt="" className="f-logo" src={Logo} />
                    <span className="copy">&copy; Copyright 2022</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
