import React, { useEffect, useState } from "react";
import EthImage from "../images/ethereum.svg";
import { Link, useParams } from "react-router-dom";
import Skeleton from "../components/UI/Skeleton";
import ErrorNotice from "../components/UI/ErrorNotice";

const ItemDetails = () => {
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { nftId } = useParams();

  useEffect(() => {
    async function fetchItemDetails() {
      if (!nftId) {
        setError("Invalid item link.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
        );

        if (!response.ok) {
          throw new Error("Failed to load item details.");
        }

        const data = await response.json();
        setItem(data || {});
      } catch (fetchError) {
        setItem({});
        setError("We could not load this item right now.");
      } finally {
        setLoading(false);
      }
    }

    window.scrollTo(0, 0);
    fetchItemDetails();
  }, [nftId]);

  if (error) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <ErrorNotice message={error} />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

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
                    alt={item.title || "NFT"}
                  />
                </div>

                <div className="col-md-6">
                  <div className="item_info">
                    <h2>
                      {item.title} <span>#{item.tag}</span>
                    </h2>

                    <div className="item_info_counts">
                      <div className="item_info_views">
                        <i className="fa fa-eye"></i>
                        {item.views}
                      </div>
                      <div className="item_info_like">
                        <i className="fa fa-heart"></i>
                        {item.likes}
                      </div>
                    </div>

                    <p>{item.description}</p>

                    <div className="d-flex flex-row">
                      <div className="mr40">
                        <h6>Owner</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <Link to={`/author/${item.ownerId}`}>
                              <img className="lazy" src={item.ownerImage} alt={item.ownerName || "Owner"} />
                              <i className="fa fa-check"></i>
                            </Link>
                          </div>
                          <div className="author_list_info">
                            <Link to={`/author/${item.ownerId}`}>{item.ownerName}</Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="Ethereum" />
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
