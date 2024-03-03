import React, { useEffect, useState } from "react";
import searchicon from "../assets/searchicon.svg";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handelSubmit = (evt) => {
    evt.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  // console.log(currentUser)
  return (
    <header className="bg-gray-800 text-white p-4 flex flex-col md:flex-row justify-between items-center">
      {/* Logo */}
      <Link to="/">
        <div className="flex items-center mb-1 md:mb-0">
          {/* <img src="logo.png" alt="Logo" className="h-8 mr-4" /> */}
          <h1 className="text-xl font-bold">Magic Estate</h1>
        </div>
      </Link>
      {/* Search Bar */}
      <form
        className="flex items-center justify-center flex-grow m-1 md:mt-0 bg-gray-700 rounded-xl max-w-64"
        onSubmit={handelSubmit}
      >
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent p-2 min-w-52 focus:outline-none"
          onChange={(evt) => setSearchTerm(evt.target.value)}
          value={searchTerm}
        />
        <button type="submit">
          <img src={searchicon} alt="search icon" className="h-8 w-8" />
        </button>
      </form>

      {/* Navigation Links */}
      <nav className="flex flex-col md:flex-row items-center">
        <Link
          to="/"
          className="block md:inline-block text-center md:text-left mb-1 md:mb-0 md:mr-4 hover:underline"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="block md:inline-block text-center md:text-left mb-1 md:mb-0 md:mr-4 hover:underline"
        >
          About
        </Link>

        <Link to="/profile">
          {currentUser ? (
            <img
              src={currentUser.avatar}
              alt="profile pic"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <li className="block md:inline-block text-center md:text-left hover:underline">
              Login
            </li>
          )}
        </Link>
      </nav>
    </header>
  );
};

export default Header;
