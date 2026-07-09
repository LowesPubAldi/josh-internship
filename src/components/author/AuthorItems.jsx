import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../UI/Skeleton";
import ErrorNotice from "../UI/ErrorNotice";

const AuthorItems = ({ authorId } ) => {
  const [author, setAuthor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchAuthor() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );

        if (!response.ok) {
          throw new Error("Failed to load author items.");
        }

        const data = await response.json();
        if (isMounted) {
          setAuthor(data || {});
        }
      } catch (fetchError) {
        if (isMounted) {
          setAuthor({});
          setError("We could not load the author's NFTs right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAuthor();

    return () => {
      isMounted = false;
    };
  }, [authorId]);

  function getItemUrl(nftId) {
    return `${window.location.origin}/item-details/${nftId}`;
  }

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {loading ? (
            new Array(4).fill(0).map((_, index) => (
              <div
                className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                key={index}
              >
                <Skeleton width="100%" height="350px" borderRadius="12px" />
              </div>
            ))
          ) : (
            author.nftCollection?.map((item) => (
              <div
                className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                key={item.nftId}
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link to={`/author/${authorId}`}>
                      <img
                        className="lazy"
                        src={author.authorImage}
                        alt={author.authorName || "Author"}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>

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

          {!loading && <ErrorNotice message={error} />}

          {!loading && !error && (!author.nftCollection || author.nftCollection.length === 0) && (
            <div className="col-md-12 text-center">
              <p>No NFTs found for this author yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;
