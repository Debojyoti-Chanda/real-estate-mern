import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import Card from "../components/Card";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  // console.log(saleListings);
  // console.log(rentListings);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    fetch("/api/listing/getLists?offer=true&limit=3")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setOfferListings(data);
      })
      .catch((err) => console.log(err));
    fetch("/api/listing/getLists?type=rent&limit=3")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setRentListings(data);
      })
      .catch((err) => console.log(err));
    fetch("/api/listing/getLists?type=sale&limit=3")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setSaleListings(data);
      })
      .catch((err) => console.log(err));
  }, []);
  
  return (
    <div className="flex flex-col w-screen">
      {/* top  */}
      <div className=" flex flex-col gap-4 sm:gap-8 mt-10 sm:mt-24 items-center justify-center sm:items-start sm:pl-24">
        <h1 className=" text-slate-700 font-bold text-3xl md:text-6xl">
          Find your next <span className=" text-gray-400">perfect</span> <br />
          place with ease
        </h1>
        <div className=" text-slate-500 text-lg p-4">
          Magic Estate will help you find your home fast, easy and comfortable.{" "}
          <br />
          Our expert support are always available.
        </div>
        <Link
          to={`/search`}
          className=" text-sm text-blue-800 font-bold hover:underline mb-6"
        >
          Lets Start Now ....
        </Link>
      </div>

      {/* swiper  */}
      <Swiper navigation className="w-screen">
        {offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className="h-[550px]"
                style={{
                  backgroundImage: `url(${listing.imageURL[0]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing offers for rent and sale  */}
      <div className="mx-auto flex flex-col gap-8 my-10">
        {saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className=" text-2xl font-semibold text-center mb-2">Recent Sales</h2>
              <Link to={`/search?type=sale`} className="text-md text-blue-600 hover:underline m-4">Show More Sale</Link>
            </div>
            <div className="flex flex-col sm:flex-row w-screen p-4 gap-4 flex-wrap justify-evenly">
              {saleListings.map(lists => (<Card list={lists} key={lists._id}/>))}
            </div>
          </div>
        )}
        {offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className=" text-2xl font-semibold text-center mb-2">Recent Offers</h2>
              <Link to={`/search?offer=true`} className="text-md text-blue-600 hover:underline m-4">Show More Offers</Link>
            </div>
            <div className="flex flex-col sm:flex-row  p-4 gap-4 flex-wrap justify-evenly">
              {offerListings.map(lists => (<Card list={lists} key={lists._id}/>))}
            </div>
          </div>
        )}
        {rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className=" text-2xl font-semibold text-center mb-2">Recent Rents</h2>
              <Link to={`/search?type=rent`} className="text-md text-blue-600 hover:underline m-4">Show More Rent</Link>
            </div>
            <div className="flex flex-col sm:flex-row p-4 gap-4 flex-wrap justify-evenly">
              {rentListings.map(lists => (<Card list={lists} key={lists._id}/>))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
