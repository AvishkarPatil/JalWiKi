import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Assuming react-router-dom, not Next.js
import NavLogo from "./NavLogo"; // Ensure NavLogo uses local images from /public folder
import SearchBar from "../SearchBar/SearchBar";
import CartIcon from "./CartIcon";
import AuthButton from "./AuthButton";
import MobileMenu from "./MobileMenu";
import { FaUserCircle } from "react-icons/fa";

// Helper component to safely render images with error handling
const SafeImage = ({ src, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => setImgSrc("/fallback-image.png"); // place a fallback image in /public

  return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
};

const Navbar = ({ isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const username = localStorage.getItem("username");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const dropdownRef = useRef(null);

  const toggleNavbar = () => setIsOpen((prev) => !prev);
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("username");
      alert("Logout Successful.");
      navigate("/login");
    }
  };

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleaned and simplified conditional styling
  const navItemClass = (active) =>
    `px-4 py-2 cursor-pointer hover:text-blue-600 ${active ? "text-blue-700 font-semibold" : "text-gray-700"}`;

  return (
    <nav
      aria-label="Primary navigation"
      className="w-full bg-white shadow-md fixed top-0 left-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        <div className="flex items-center space-x-4">
          {/* Nav Logo, use SafeImage if NavLogo contains images */}
          <Link to="/" className="flex items-center" aria-label="Go to homepage">
            <NavLogo />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            {["Fashion", "Gifts", "Furniture", "Stationery", "Body-Care"].map((category) => (
              <Link
                key={category}
                to={`/${category.toLowerCase()}`}
                className={navItemClass(false)}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-grow max-w-xs mx-4">
          <SearchBar value={searchTerm} onChange={handleSearch} />
        </div>

        {/* Right side: Cart + User/Auth */}
        <div className="flex items-center space-x-4">

          <CartIcon aria-label="View cart" />

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                aria-haspopup="true"
                aria-expanded={showDropdown}
                aria-label="User menu"
                className="flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                <FaUserCircle size={24} />
                <span className="hidden sm:inline-block font-medium">{username || "User"}</span>
              </button>

              {showDropdown && (
                <ul
                  className="absolute right-0 mt-2 py-2 w-40 bg-white rounded shadow-lg border border-gray-200"
                  role="menu"
                  aria-label="User dropdown"
                >
                  {isAdmin && (
                    <li>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex={0}
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={0}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <AuthButton />
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={toggleNavbar}
            aria-label="Toggle mobile menu"
            aria-expanded={isOpen}
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <svg
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow">
          <MobileMenu
            categories={["Fashion", "Gifts", "Furniture", "Stationery", "Body-Care"]}
            isLoggedIn={isLoggedIn}
            username={username}
            isAdmin={isAdmin}
            onLogout={handleLogout}
            closeMenu={() => setIsOpen(false)}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
