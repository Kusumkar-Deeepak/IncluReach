import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const userFromStorage = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!userFromStorage;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo on left */}
        <Link to="/" className="flex flex-col">
          <span className="text-2xl font-bold leading-tight">IncluReach</span>
          <span className="text-blue-200 text-sm -mt-1">
            Empowering Diverse Abilities
          </span>
        </Link>

        {/* Navigation links centered */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6">
          <Link to="/" className="hover:text-blue-200 transition py-1">
            Home
          </Link>
          <Link to="/jobs" className="hover:text-blue-200 transition py-1">
            Jobs
          </Link>
          <Link to="/about" className="hover:text-blue-200 transition py-1">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-200 transition py-1">
            Contact
          </Link>
        </div>

        {/* Auth buttons on right */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="hidden sm:inline text-sm md:text-base">
                Welcome, {userFromStorage.fullName}
              </span>
              <Link
                to="/dashboard"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition text-sm md:text-base"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1 md:px-4 md:py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm md:text-base"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-3 py-1 md:px-4 md:py-2 rounded-lg font-medium hover:bg-blue-50 transition text-sm md:text-base"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;