import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "../../css/styles/owl.carousel.css"
import "../../css/styles/owl.theme.css"
import Skeleton from "../UI/Skeleton";
import ErrorNotice from "../UI/ErrorNotice";

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());

  async function getNewItems() {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
      );
      setItems(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setItems([]);
      setError("We could not load new items right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getNewItems();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function timeRemaining(expiryDate) {
    const total = expiryDate - currentTime;

    if (total <= 0) {
      return "0h 0m 0s";
    }

    const hours = Math.floor(total / (1000 * 60 * 60));
    const minutes = Math.floor((total / (1000 * 60)) % 60);
    const seconds = Math.floor((total / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  function getItemUrl(nftId) {
    return `${window.location.origin}/item-details/${nftId}`;
  }

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          {loading ? (
            <div className="row">
              {new Array(4).fill(0).map((_, index) => (
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                  <Skeleton width="100%" height="350px" borderRadius="12px" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <ErrorNotice message={error} />

              {!error && items.length === 0 && (
                <div className="col-md-12 text-center">
                  <p>No new items are available right now.</p>
                </div>
              )}

              {!error && items.length > 0 && (
                <OwlCarousel
                  className="owl-carousel owl-theme"
                  loop
                  margin={20}
                  nav
                  dots={false}
                  responsive={{
                    0: { items: 1 },
                    600: { items: 2 },
                    1000: { items: 4 },
                  }}
                >
                  {items.map((item) => (
                    <div className="item" key={item.nftId || item.id}>
                      <div className="nft__item">
                        <div className="author_list_pp">
                          <Link
                            to={`/author/${item.authorId}`}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title={`Creator: ${item.authorName || "Unknown"}`}
                          >
                            <img className="lazy" src={item.authorImage} alt={item.authorName || "Author"} />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        {timeRemaining(item.expiryDate) !== "0h 0m 0s" && (
                          <div className="de_countdown">{timeRemaining(item.expiryDate)}</div>
                        )}
                        <div className="nft__item_wrap">
                          <div className="nft__item_extra">
                            <div className="nft__item_buttons">
                              <button type="button">Buy Now</button>
                              <div className="nft__item_share">
                                <h4>Share</h4>
                                <a
                                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                    getItemUrl(item.nftId)
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <i className="fa fa-facebook fa-lg"></i>
                                </a>
                                <a
                                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                    getItemUrl(item.nftId)
                                  )}&text=${encodeURIComponent(item.title)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <i className="fa fa-twitter fa-lg"></i>
                                </a>
                                <a
                                  href={`mailto:?subject=${encodeURIComponent(
                                    `Check out ${item.title}`
                                  )}&body=${encodeURIComponent(getItemUrl(item.nftId))}`}
                                >
                                  <i className="fa fa-envelope fa-lg"></i>
                                </a>
                              </div>
                            </div>
                          </div>

                          <Link to={`/item-details/${item.nftId}`}>
                            <img
                              src={item.nftImage}
                              className="lazy nft__item_preview"
                              alt={item.title || "NFT"}
                            />
                          </Link>
                        </div>
                        <div className="nft__item_info">
                          <Link to={`/item-details/${item.nftId}`}>
                            <h4>{item.title}</h4>
                          </Link>
                          <div className="nft__item_price">{item.price} ETH</div>
                          <div className="nft__item_like">
                            <i className="fa fa-heart"></i>
                            <span>{item.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </OwlCarousel>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;
