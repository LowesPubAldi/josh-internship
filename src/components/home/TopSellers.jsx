import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Skeleton from "../UI/Skeleton";
import ErrorNotice from "../UI/ErrorNotice";

const TopSellers = () => {
  const [sellers, setSellers] = useState ([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function getTopSellers() {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
      );

      setSellers(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setSellers([]);
      setError("We could not load top sellers right now.");
    } finally {
      setLoading(false);
    }
  }

useEffect (() => {
  getTopSellers();
},[]);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            {!loading && <ErrorNotice message={error} />}

            <ol className="author_list">
              {loading ? (
                new Array(12).fill(0).map((_, index) => (
                  <li key={index}>
                    <Skeleton width="100%" height="60px" borderRadius="10px" />
                  </li>
                ))
              ) : !error ? (
                sellers.map((seller) => (
                  <li key={seller.id}>
                    <div className="author_list_pp">
                      <Link to={`/author/${seller.authorId}`}>
                        <img
                          className="lazy pp-author"
                          src={seller.authorImage}
                          alt=""
                        />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>
                    <div className="author_list_info">
                     <Link to={`/author/${seller.authorId}`}>{seller.authorName}</Link>
                      <span>{seller.price} ETH</span>
                    </div>
                  </li>
                ))
              ) : null}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
