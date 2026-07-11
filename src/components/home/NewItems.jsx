import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Skeleton from "../UI/Skeleton";
import ErrorNotice from "../UI/ErrorNotice";

const FEATURED_ZOOM_TITLES = new Set(["Deep Sea Phantasy", "Two Tigers"]);

function getTimeRemaining(expiryDate) {
  const total = Number(expiryDate) - Date.now();

  if (total <= 0) {
    return { total: 0, label: "0h 0m 0s" };
  }

  const hours = Math.floor(total / (1000 * 60 * 60));
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return {
    total,
    label: `${hours}h ${minutes}m ${seconds}s`,
  };
}

const CountdownTimer = ({ expiryDate }) => {
  const [time, setTime] = useState(() => getTimeRemaining(expiryDate));

  useEffect(() => {
    setTime(getTimeRemaining(expiryDate));

    const intervalId = setInterval(() => {
      setTime(getTimeRemaining(expiryDate));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiryDate]);

  if (time.total <= 0) {
    return null;
  }

  return <div className="de_countdown">{time.label}</div>;
};

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [likedById, setLikedById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    mode: "snap",
    drag: false,
    defaultAnimation: {
      duration: 850,
    },
    created() {
      setLoaded(true);
    },
    breakpoints: {
      "(max-width: 999px)": {
        slides: {
          perView: 2,
          spacing: 20,
        },
      },
      "(max-width: 599px)": {
        slides: {
          perView: 1,
          spacing: 20,
        },
      },
    },
    slides: {
      perView: 4,
      spacing: 20,
    },
  });

  async function getNewItems() {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
      );
      setItems(Array.isArray(data) ? data : []);
      setLikedById({});
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
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  }, [items, instanceRef]);

  function getItemUrl(nftId) {
    return `${window.location.origin}/item-details/${nftId}`;
  }

  function getItemKey(item) {
    return String(item.nftId || item.id);
  }

  function getBaseLikes(item) {
    const parsedLikes = Number(item.likes);
    return Number.isFinite(parsedLikes) ? parsedLikes : 0;
  }

  function handleLikeToggle(itemKey) {
    setLikedById((prevLikedById) => ({
      ...prevLikedById,
      [itemKey]: !prevLikedById[itemKey],
    }));
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
                <div className="new-items-keen-wrapper">
                  <div
                    ref={sliderRef}
                    className="keen-slider new-items-keen-slider"
                    aria-label="New Items carousel"
                  >
                    {items.map((item) => {
                      const itemKey = getItemKey(item);
                      const isLiked = Boolean(likedById[itemKey]);
                      const displayedLikes = getBaseLikes(item) + (isLiked ? 1 : 0);

                      return (
                      <div className="keen-slider__slide" key={itemKey}>
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
                          <CountdownTimer expiryDate={item.expiryDate} />
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
                                className={`lazy nft__item_preview${
                                  FEATURED_ZOOM_TITLES.has(item.title) ? " nft__item_preview--zoomed" : ""
                                }`}
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
                              <button
                                type="button"
                                className="nft__item_like_button"
                                onClick={() => handleLikeToggle(itemKey)}
                                aria-pressed={isLiked}
                                aria-label={`${isLiked ? "Unlike" : "Like"} ${item.title}`}
                              >
                                <i className={`fa fa-heart${isLiked ? " active" : ""}`}></i>
                                <span>{displayedLikes}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                    })}
                  </div>

                  {loaded && instanceRef.current && (
                    <>
                      <button
                        className="new-items-keen-arrow new-items-keen-arrow--left"
                        onClick={() => instanceRef.current?.prev()}
                        aria-label="Previous new item"
                        type="button"
                      >
                        &lsaquo;
                      </button>
                      <button
                        className="new-items-keen-arrow new-items-keen-arrow--right"
                        onClick={() => instanceRef.current?.next()}
                        aria-label="Next new item"
                        type="button"
                      >
                        &rsaquo;
                      </button>
                    </>
                  )}

                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;
