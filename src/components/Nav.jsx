import React, { useEffect, useState } from "react";
import Logo from "../images/Ultraverse.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const Nav = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasTypedSearch, setHasTypedSearch] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function getExploreQueryFromLocation() {
    if (location.pathname !== "/explore") {
      return "";
    }

    return (new URLSearchParams(location.search).get("q") || "").trim();
  }

  const openNav = () => {
    document.body.classList.add("menu__open");
  };

  const closeNav = () => {
    document.body.classList.remove("menu__open");
  };

  useEffect(() => {
    if (!hasTypedSearch) {
      return;
    }

    if (location.pathname !== "/explore") {
      return;
    }

    const timeoutId = setTimeout(() => {
      const query = searchTerm.trim();

      if (query) {
        navigate(`/explore?q=${encodeURIComponent(query)}`);
      } else if (location.pathname === "/explore" && location.search.includes("q=")) {
        navigate("/explore", { replace: true });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [hasTypedSearch, searchTerm, navigate, location.pathname, location.search]);

  useEffect(() => {
    const queryFromUrl = getExploreQueryFromLocation();
    setSearchTerm(queryFromUrl);
  }, [location.pathname, location.search]);

  function submitSearch() {
    const query = searchTerm.trim();

    if (query) {
      navigate(`/explore?q=${encodeURIComponent(query)}`);
      return;
    }

    navigate("/explore");
  }

  function openWalletModal() {
    setIsWalletModalOpen(true);
    closeNav();
  }

  function closeWalletModal() {
    setIsWalletModalOpen(false);
  }

  return (
    <header className="transparent header-light scroll-light smaller">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="de-flex sm-pt10 nav-header-layout">
              <div className="de-flex-col nav-header-left">
                <div id="logo">
                  <Link to="/">
                    <img alt="" className="logo-2" src={Logo} />
                  </Link>
                </div>
              </div>

              <div className="de-flex-col nav-header-center">
                <input
                  id="quick_search"
                  className="nav-search-input"
                  name="quick_search"
                  placeholder="Search NFTs..."
                  type="text"
                  value={searchTerm}
                  onChange={(event) => {
                    setHasTypedSearch(true);
                    setSearchTerm(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      submitSearch();
                    }
                  }}
                />
              </div>

              <div className="de-flex-col header-col-mid nav-header-right">
                <div className="menu_side_area">
                  <span onClick={() => openNav()} id="menu-btn"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ul id="dropdown__wrapper">
        <li className="dropdown__list">
          <Link to="/" onClick={() => closeNav()}>
            Home
          </Link>
        </li>
        <li className="dropdown__list">
          <Link to="/explore" onClick={() => closeNav()}>
            Explore
          </Link>
        </li>
        <li className="dropdown__list">
          <button type="button" className="btn-main connect-wallet" onClick={openWalletModal}>
            Connect Wallet (Demo)
          </button>
        </li>
        <li className="close__button">
          <button onClick={() => closeNav()}>
            <FaTimes />
          </button>
        </li>
      </ul>

      {isWalletModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Wallet demo modal"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              color: "#111111",
              width: "100%",
              maxWidth: "520px",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Wallet Integration Demo</h3>
            <p>
              Wallet connection is shown as a demo in this project. Real wallet authentication and
              transaction signing are planned for a future version.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button type="button" className="btn-main" onClick={closeWalletModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
