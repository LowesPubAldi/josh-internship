import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Skeleton from "../UI/Skeleton";
import ErrorNotice from "../UI/ErrorNotice";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleItems, setVisibleItems] = useState(8);
  const [filter, setFilter] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [searchParams] = useSearchParams();
  const rawSearchQuery = (searchParams.get("q") || "").trim();

  function normalizeSearchText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  const normalizedSearchQuery = normalizeSearchText(rawSearchQuery);

  async function fetchExploreItems(filterValue = "") {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore${
          filterValue ? `?filter=${filterValue}` : ""
        }`
      );

      if (!response.ok) {
        throw new Error("Failed to load explore items.");
      }

      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
      setVisibleItems(8);
    } catch (fetchError) {
      setItems([]);
      setError("We could not load explore items right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExploreItems(filter);
  }, [filter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setVisibleItems(8);
  }, [normalizedSearchQuery]);

  function formatTimeLeft(expiryDate) {
    const timeLeft = expiryDate - currentTime;

    if (timeLeft <= 0) {
      return "0h 0m 0s";
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  function getItemUrl(nftId) {
    return `${window.location.origin}/item-details/${nftId}`;
  }

  const filteredItems = normalizedSearchQuery
    ? items.filter((item) => {
        const searchableText = normalizeSearchText(
          [
            item.title,
            item.name,
            item.nftTitle,
            item.authorName,
            item.author,
            item.ownerName,
            item.collectionName,
            item.tag,
            item.authorId,
          ]
            .filter(Boolean)
            .join(" ")
        );

        return searchableText.includes(normalizedSearchQuery);
      })
    : items;

  const visibleFilteredItems = filteredItems.slice(0, visibleItems);

  return (
    <>
      <div>
        <select
          id="filter-items"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}>
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>

        {rawSearchQuery && <p>Showing results for "{rawSearchQuery}"</p>}
      </div>

      <div className="row">
        {loading ? (
          new Array(8).fill(0).map((_, index) => (
            <div key={index} className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12">
              <Skeleton width="100%" height="350px" borderRadius="12px" />
            </div>
          ))
        ) : (
          visibleFilteredItems.map((item) => (
          <div
            key={item.nftId}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
            style={{ display: "block", backgroundSize: "cover" }}
          >
            <div className="nft__item">
              <div className="author_list_pp">
                <Link
                  to={`/author/${item.authorId}`}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                >
                  <img className="lazy" src={item.authorImage} alt="" />
                  <i className="fa fa-check"></i>
                </Link>
              </div>
              {item.expiryDate > currentTime && (
                <div className="de_countdown">{formatTimeLeft(item.expiryDate)}</div>
              )}

              <div className="nft__item_wrap">
                <div className="nft__item_extra">
                  <div className="nft__item_buttons">
                    <button>Buy Now</button>
                  </div>
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

                <Link to={`/item-details/${item.nftId}`}>
                  <img
                    src={item.nftImage}
                    className="lazy nft__item_preview"
                    alt=""
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
          ))
        )}
      </div>

      {!loading && <ErrorNotice message={error} />}

      {!loading && !error && items.length === 0 && (
        <div className="col-md-12 text-center">
          <p>No items found for this filter.</p>
        </div>
      )}

      {!loading && !error && items.length > 0 && filteredItems.length === 0 && (
        <div className="col-md-12 text-center">
          <p>No NFTs matched your search.</p>
        </div>
      )}

      {!loading && visibleItems < filteredItems.length && (
        <div className="col-md-12 text-center">
          <button
            type="button"
            id="loadmore"
            className="btn-main lead"
            onClick={() => setVisibleItems(visibleItems + 4)}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
