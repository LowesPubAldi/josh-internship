import React, { useEffect, useState } from "react";
import SubHeader from "../images/subheader.jpg";
import ExploreItems from "../components/explore/ExploreItems";
import Skeleton from "../components/UI/Skeleton";

const Explore = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section
          id="subheader"
          className="text-light"
          style={{ background: `url("${SubHeader}") top` }}>
          <div className="center-y relative text-center">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h1>Explore</h1>
                </div>
                <div className="clearfix"></div>
              </div>
            </div>
          </div>
        </section>
        <section aria-label="section">
          <div className="container">
            <div className="row">
              {loading ? (
                new Array(8).fill(0).map((_, index) => (
                  <div
                    key={index}
                    className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                    style={{ marginBottom: "30px" }}
                  >
                    <Skeleton width="100%" height="350px" borderRadius="12px" />
                  </div>
                ))
              ) : (
                <ExploreItems />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Explore;
