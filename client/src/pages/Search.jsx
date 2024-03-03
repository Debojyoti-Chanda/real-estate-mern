import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

const Search = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(listings);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  // we are creating this use effect so that any change in the url is also reflected in the search UI and fetch searched datfrom the backend
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }
    const searchQuery = urlParams.toString();
    setLoading(true);
    fetch(`/api/listing/getLists?${searchQuery}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [location.search]);
  const navigate = useNavigate();
  //   console.log(sidebarData);
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData((prevData) => {
        return { ...prevData, type: e.target.id };
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData((prevData) => {
        return { ...prevData, [e.target.id]: e.target.checked };
      });
    }
    if (e.target.id === "searchTerm") {
      setSidebarData((prevData) => {
        return { ...prevData, searchTerm: e.target.value };
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebarData((prevData) => {
        return { ...prevData, sort, order };
      });
    }
  };
  const submitHandler = (evt) => {
    evt.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  return (
    <div className="flex flex-col sm:flex-row sm:min-h-screen">
      <div className="m-7 border-b-2 sm:border-r-2 sm:border-b-0 p-4">
        <form
          className="flex flex-col gap-5 justify-center items-center"
          onSubmit={submitHandler}
        >
          <div className=" flex flex-row  items-center gap-2">
            <label
              htmlFor="searchTerm"
              className=" whitespace-nowrap font-semibold"
            >
              Search Term
            </label>
            <input
              type="text"
              id="searchTerm"
              name="searchTerm"
              placeholder="Search..."
              className=" border rounded-xl p-3 w-full "
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          {/* Types  */}
          <div className="flex gap-2 flex-wrap items-center">
            <label className=" font-semibold">Type:</label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className=" font-semibold"
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              />
              <span>Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className=" font-semibold"
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          {/* Amenities */}
          <div className="flex gap-2 flex-wrap items-center">
            <label className=" font-semibold">Amenities:</label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>Parking</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          {/* Sort  */}
          <div className="flex gap-2 items-center">
            <label className=" font-semibold">Sort</label>
            <select
              id="sort_order"
              className="border rounded-xl p-3 bg-slate-400 text-white"
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
            >
              <option value={"regularPrice_desc"}>Price High to Low</option>
              <option value={"regularPrice_asc"}>Price Low to High</option>
              <option value={"createdAt_asc"}>Latest</option>
              <option value={"createdAt_desc"}>Oldest</option>
            </select>
          </div>
          {/* search button  */}
          <button className=" bg-slate-500 text-white p-3 rounded-2xl uppercase hover:opacity-85 w-28">
            Search
          </button>
        </form>
      </div>

      <div className=" flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-500 mt-5">
          Listing Results
        </h1>
        <div className=" p-7 flex flex-wrap sm:gap-3 justify-center items-center sm:justify-normal sm:items-start">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-600">No Listing Found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-600 text-center w-full"></p>
          )}
          {!loading &&
            listings &&
            listings.map((list) => {
              return <Card list={list} key={list._id}/>;
            })}
        </div>
      </div>
    </div>
  );
};

export default Search;
