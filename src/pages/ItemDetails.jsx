import React, { useEffect, useState } from "react";
import EthImage from "../images/ethereum.svg";
import { Link, useParams } from "react-router-dom";
import Skeleton from "../components/UI/Skeleton";
import { ensureEnglishDescription } from "../utils/descriptionLanguage";

const ItemDetails = () => {
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [watching, setWatching] = useState(false);
  const [liked, setLiked] = useState(false);
  const [watchCount, setWatchCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [showBuyConfirm, setShowBuyConfirm] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const { nftId } = useParams();

  const descriptionText = ensureEnglishDescription(item.description, item);

  const handlePlaceBid = () => {
    setShowBidForm(true);
    setShowBuyConfirm(false);
    setActionMessage("");
  };

  const handleBuyNow = () => {
    if (hasPurchased) {
      return;
    }

    setShowBuyConfirm(true);
    setShowBidForm(false);
    setActionMessage("");
  };

  const handleWatchToggle = () => {
    const nextWatching = !watching;
    setWatching(nextWatching);
    setWatchCount((prevCount) => Math.max(0, prevCount + (nextWatching ? 1 : -1)));
  };

  const handleLikeToggle = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((prevCount) => Math.max(0, prevCount + (nextLiked ? 1 : -1)));
  };

  const handleBidSubmit = (event) => {
    event.preventDefault();
    const numericBid = Number.parseFloat(bidAmount);
    const currentPrice = Number.parseFloat(item.price);

    if (!numericBid || numericBid <= 0) {
      setActionMessage("Enter a valid bid amount in ETH.");
      return;
    }

    if (!Number.isFinite(currentPrice) || numericBid <= currentPrice) {
      setActionMessage(`Bid must be greater than ${currentPrice.toFixed(2)} ETH.`);
      return;
    }

    setActionMessage(`Bid of ${numericBid.toFixed(2)} ETH placed for ${item.title}.`);
    setBidAmount("");
    setShowBidForm(false);
  };

  const handleBuyConfirm = () => {
    if (hasPurchased) {
      return;
    }

    setActionMessage(`Purchase complete for ${item.title} at ${item.price} ETH.`);
    setHasPurchased(true);
    setShowBuyConfirm(false);
  };

useEffect(() => {
  async function fetchItemDetails() {
    const response = await fetch(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
    );

    const data = await response.json();

    setTimeout(() => {
      setItem(data);
      setWatchCount(data.views || 0);
      setLikeCount(data.likes || 0);
      setWatching(false);
      setLiked(false);
      setShowBidForm(false);
      setShowBuyConfirm(false);
      setBidAmount("");
      setHasPurchased(false);
      setActionMessage("");
      setLoading(false);
    }, 1000);
  }

  window.scrollTo(0, 0);
  fetchItemDetails();
}, [nftId]);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            {loading ? (
  <div className="row">
    <div className="col-md-6">
      <Skeleton width="100%" height="500px" borderRadius="12px" />
    </div>
    <div className="col-md-6">
      <Skeleton width="80%" height="40px" borderRadius="8px" />
      <Skeleton width="40%" height="30px" borderRadius="8px" />
      <Skeleton width="100%" height="100px" borderRadius="8px" />
    </div>
  </div>
) : (
              <div className="row">
                <div className="col-md-6 text-center">
                  <img
                    src={item.nftImage}
                    className="img-fluid img-rounded mb-sm-30 nft-image"
                    alt=""
                  />
                </div>

                <div className="col-md-6">
                  <div className="item_info">
                    <h2>
                      {item.title} <span>#{item.tag}</span>
                    </h2>

                    <div className="item_info_counts">
                      <button
                        type="button"
                        className={`item_info_metric_button ${watching ? "active" : ""}`}
                        onClick={handleWatchToggle}
                        aria-label="Toggle watching"
                      >
                        <i className="fa fa-eye"></i>
                        {watchCount}
                      </button>
                      <button
                        type="button"
                        className={`item_info_metric_button ${liked ? "active" : ""}`}
                        onClick={handleLikeToggle}
                        aria-label="Toggle like"
                      >
                        <i className="fa fa-heart"></i>
                        {likeCount}
                      </button>
                    </div>

                    <div className="item-detail-actions">
                      <button
                        type="button"
                        className="btn-main btn-small"
                        onClick={handlePlaceBid}
                      >
                        Place Bid
                      </button>
                      <button
                        type="button"
                        className="btn-main btn-small"
                        onClick={handleBuyNow}
                        disabled={hasPurchased}
                      >
                        {hasPurchased ? "Purchased" : "Buy Now"}
                      </button>
                    </div>

                    {showBidForm && (
                      <form className="item-detail-inline-panel" onSubmit={handleBidSubmit}>
                        <label htmlFor="bid-amount">Your Bid (ETH)</label>
                        <div className="item-detail-inline-row">
                          <input
                            id="bid-amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={bidAmount}
                            onChange={(event) => setBidAmount(event.target.value)}
                            placeholder="e.g. 5.50"
                          />
                          <button type="submit" className="btn-main btn-small">
                            Submit Bid
                          </button>
                        </div>
                      </form>
                    )}

                    {showBuyConfirm && !hasPurchased && (
                      <div className="item-detail-inline-panel">
                        <p>
                          Confirm purchase of {item.title} for {item.price} ETH?
                        </p>
                        <div className="item-detail-inline-row">
                          <button
                            type="button"
                            className="btn-main btn-small"
                            onClick={handleBuyConfirm}
                          >
                            Confirm Purchase
                          </button>
                          <button
                            type="button"
                            className="btn-main btn-small btn-secondary"
                            onClick={() => setShowBuyConfirm(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {actionMessage && <p className="item-detail-action-note">{actionMessage}</p>}

                    <p>{descriptionText}</p>

                    <div className="d-flex flex-row">
                      <div className="mr40">
                        <h6>Owner</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <Link to={`/author/${item.ownerId}`}>
                              <img className="lazy" src={item.ownerImage} alt="" />
                              <i className="fa fa-check"></i>
                            </Link>
                          </div>
                          <div className="author_list_info">
                            <Link to={`/author/${item.ownerId}`}>
                            {item.ownerName}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      <span>{item.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
