import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import NavLogo from "./NavLogo"; // Make sure NavLogo uses /public/images
import SearchBar from "../SearchBar/SearchBar";
import CartIcon from "./CartIcon";
import AuthButton from "./AuthButton";
import MobileMenu from "./MobileMenu";
import { FaUserCircle } from "react-icons/fa";

const SafeImage = ({ src, alt, ...props }: { src: string; alt: string }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => setImgSrc("/images/fallback-image.png");

  return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
};

const Navbar = ({ isAdmin }: { isAdmin: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const username = localStorage.getItem("username");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleNavbar = () => setIsOpen((prev) => !prev);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("username");
      alert("Logout Successful.");
      navigate("/login");
    }
  };

  const handleDropdownToggle = () => setShowDropdown((prev) => !prev);

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItemClass = (active: boolean) =>
    `px-4 py-2 cursor-pointer hover:text-blue-600 ${
      active ? "text-blue-700 font-semibold" : "text-gray-700"
    }`;

  const categories = ["Fashion", "Gifts", "Furniture", "Stationery", "Body-Care"];

  return (
    <nav aria-label="Primary navigation" className="bg-white border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Nav Logo */}
        <Link to="/" aria-label="Homepage" className="flex items-center">
          <SafeImage src="/images/logo-light.png" alt="Site Logo" className="h-8 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4">
          {categories.map((category) => (
            <li key={category} className={navItemClass(false)}>
              <Link to={`/category/${category.toLowerCase()}`}>{category}</Link>
            </li>
          ))}
        </ul>

        {/* Search Bar */}
        <div className="hidden md:block w-1/3">
          <SearchBar value={searchTerm} onChange={handleSearch} placeholder="Search products..." />
        </div>

        {/* Right side: Cart + User/Auth */}
        <div className="flex items-center space-x-4 relative">
          <CartIcon />
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                aria-haspopup="true"
                aria-expanded={showDropdown}
                onClick={handleDropdownToggle}
                className="flex items-center space-x-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
              >
                <FaUserCircle size={24} />
                <span>{username || "User"}</span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded z-50">
                  <ul className="flex flex-col outline-none">
                    {isAdmin && (
                      <li>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 hover:bg-blue-100"
                          onClick={() => setShowDropdown(false)}
                        >
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-blue-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <AuthButton />
          )}

          {/* Mobile menu toggle button */}
          <button
            onClick={toggleNavbar}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="md:hidden focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <MobileMenu
          categories={categories}
          isLoggedIn={isLoggedIn}
          username={username}
          isAdmin={isAdmin}
          onLogout={handleLogout}
          onClose={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
