import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Skeleton from "../UI/Skeleton";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    mode: "snap",
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

async function getHotCollections() {
  try {
    setLoading(true);

    const { data } = await axios.get(
      "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
    );

    console.log(data[0]);

    setTimeout(() => {
      setCollections(data);
      setLoading(false);
    }, 1000);
  } catch (error) {
    console.log("Hot Collections Error:", error);
    setLoading(false);
  }
}
useEffect(() => {
  getHotCollections();
}, []);

useEffect(() => {
  if (instanceRef.current) {
    instanceRef.current.update();
  }
}, [collections, instanceRef]);

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          {loading ? (
          <div className="row">
          {new Array(4).fill(0).map((_, index) => (
          <div
            className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
            key={index}
        >
        <Skeleton width="100%" height="350px" borderRadius="12px" />
          </div>
          ))}
          </div>
          ) : (
          <div className="new-items-keen-wrapper">
            <div
              ref={sliderRef}
              className="keen-slider new-items-keen-slider"
              aria-label="Hot Collections carousel"
            >
            {collections.map((collection) => (
            <div className="keen-slider__slide" key={collection.nftId}>
              <div className="nft_coll">
                <div className="nft_wrap">
                  <Link to={`/item-details/${collection.nftId}`}>
                    <img src={collection.nftImage} className="lazy img-fluid" alt="" />
                  </Link>
                </div>
                <div className="nft_coll_pp">
                  <Link to={`/author/${collection.authorId}`}>
                  <img
                  className="lazy"
                  src={collection.authorImage} 
                  alt=""  
                    />
                    </Link>
                  <i className="fa fa-check"></i>
                </div>
                <div className="nft_coll_info">
                  <Link to="/explore">
                    <h4>{collection.title}</h4>
                  </Link>
                  <span>ERC-{collection.code}</span>
                </div>
              </div>
            </div>
          ))}
            </div>
            {loaded && instanceRef.current && (
              <>
                <button
                  className="new-items-keen-arrow new-items-keen-arrow--left"
                  onClick={() => instanceRef.current?.prev()}
                  aria-label="Previous collection"
                  type="button"
                >
                  &lsaquo;
                </button>
                <button
                  className="new-items-keen-arrow new-items-keen-arrow--right"
                  onClick={() => instanceRef.current?.next()}
                  aria-label="Next collection"
                  type="button"
                >
                  &rsaquo;
                </button>
              </>
            )}
          </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
