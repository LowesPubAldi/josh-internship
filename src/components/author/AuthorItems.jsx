import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../UI/Skeleton";

const AuthorItems = ({ authorId } ) => {
  const [author, setAuthor] = useState({});
  const [loading, setLoading] = useState(true);
  const [likedById, setLikedById] = useState({});

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

  useEffect(() => {
    let isMounted = true;

    async function loadAuthor() {
      setLoading(true);

      const response = await fetch(
        `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
      );

      const data = await response.json();

      setTimeout(() => {
        if (!isMounted) {
          return;
        }

        setAuthor(data);
        setLikedById({});
        setLoading(false);
      }, 1000);
    }

    loadAuthor();

    return () => {
      isMounted = false;
    };
  }, [authorId]);

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
            author.nftCollection?.map((item, index) => {
              const itemKey = getItemKey(item);
              const isLiked = Boolean(likedById[itemKey]);
              const displayedLikes = getBaseLikes(item) + (isLiked ? 1 : 0);

              return (
              <div
                className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                key={index}
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
                            `${window.location.origin}/item-details/${item.nftId}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa fa-facebook fa-lg"></i>
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                            `${window.location.origin}/item-details/${item.nftId}`
                          )}&text=${encodeURIComponent(item.title)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="fa fa-twitter fa-lg"></i>
                        </a>
                        <a
                          href={`mailto:?subject=${encodeURIComponent(
                            `Check out ${item.title}`
                          )}&body=${encodeURIComponent(
                            `${window.location.origin}/item-details/${item.nftId}`
                          )}`}
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
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;
