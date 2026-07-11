import React, { useEffect, useState } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { useParams } from "react-router-dom";
import Skeleton from "../components/UI/Skeleton";

const Author = () => {
  const [author, setAuthor] = useState({});
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const { id } = useParams();

  const authorNameLength = (author.authorName || "").trim().length;
  const maxTagLength = Math.max(6, authorNameLength);
  const normalizedTag = (author.tag || "").trim();
  const displayTag =
    normalizedTag.length > maxTagLength
      ? `${normalizedTag.slice(0, maxTagLength)}...`
      : normalizedTag;
  const normalizedAddress = (author.address || "").trim();
  const displayAddress =
    normalizedAddress.length > 17
      ? `${normalizedAddress.slice(0, 8)}...${normalizedAddress.slice(-6)}`
      : normalizedAddress;

  useEffect(() => {
    let isMounted = true;

    async function loadAuthor() {
      setLoading(true);

      const response = await fetch(
        `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${id}`
      );

      const data = await response.json();

      setTimeout(() => {
        if (!isMounted) {
          return;
        }

        setAuthor(data);
        setLoading(false);
      }, 1000);
    }

    loadAuthor();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section" className="author-profile-section">
          <div className="container">
            {loading ? (
              <div className="row">
                <Skeleton width="100%" height="200px" borderRadius="12px" />
              </div>
            ) : (
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <img src={author.authorImage} alt="" />
                        <i className="fa fa-check"></i>
                        <div className="profile_name">
                          <h4 className="author-profile-heading">
                            {author.authorName}
                            <span className="profile_username" title={`@${normalizedTag}`}>
                              @{displayTag}
                            </span>
                            <div className="profile_wallet_row">
                              <span id="wallet" className="profile_wallet" title={normalizedAddress}>
                                {displayAddress}
                              </span>
                              <button type="button" id="btn_copy" title="Copy Text">
                                Copy
                              </button>
                            </div>
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">
                          {following ? author.followers + 1 : author.followers} followers
                        </div>
                        <button
                        className="btn-main"
                        onClick={() => setFollowing(!following)}
                        >
                        {following ? "Unfollow" : "Follow"}
                      </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    <AuthorItems authorId={id} />
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

export default Author;
