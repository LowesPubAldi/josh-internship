import React, { useEffect, useState } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { useParams } from "react-router-dom";
import Skeleton from "../components/UI/Skeleton";
import ErrorNotice from "../components/UI/ErrorNotice";

const Author = () => {
  const [author, setAuthor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [following, setFollowing] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const { id } = useParams();

  useEffect(() => {
    let isMounted = true;

    async function fetchAuthor() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load author.");
        }

        const data = await response.json();
        if (isMounted) {
          setAuthor(data || {});
        }
      } catch (fetchError) {
        if (isMounted) {
          setAuthor({});
          setError("We could not load this author profile right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    window.scrollTo(0, 0);
    fetchAuthor();

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleCopyAddress() {
    if (!author.address) {
      return;
    }

    try {
      await navigator.clipboard.writeText(author.address);
      setCopyMessage("Wallet copied");
      setTimeout(() => setCopyMessage(""), 1500);
    } catch (clipboardError) {
      setCopyMessage("Copy failed");
      setTimeout(() => setCopyMessage(""), 1500);
    }
  }

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

        <section aria-label="section">
          <div className="container">
            {!loading && <ErrorNotice message={error} />}

            {loading ? (
              <div className="row">
                <Skeleton width="100%" height="200px" borderRadius="12px" />
              </div>
            ) : !error ? (
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <img src={author.authorImage} alt="" />
                        <i className="fa fa-check"></i>
                        <div className="profile_name">
                          <h4>
                            {author.authorName}
                            <span className="profile_username">
                              @{author.tag}
                            </span>
                            <span id="wallet" className="profile_wallet">
                              {author.address}
                            </span>
                            <button id="btn_copy" title="Copy Text" onClick={handleCopyAddress}>
                              Copy
                            </button>
                            {copyMessage && <span className="profile_username">{copyMessage}</span>}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">
                          {following
                            ? (Number(author.followers) || 0) + 1
                            : Number(author.followers) || 0} followers
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
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
