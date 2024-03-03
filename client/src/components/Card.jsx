import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
const Card = ({ list }) => {
  return (
    <Link to={`/listing/${list._id}`}>
      <div className=" border p-4 rounded-lg bg-slate-300 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden w-full sm:w-[330px] m-2">
        <img
          src={list.imageURL[0]}
          alt="List image"
          className=" h-[220px] w-full object-cover hover:scale-105 transition-scale duration-200 rounded-md"
        />
        <div className="p-3 flex flex-col gap-1 ">
          <p className="text-lg font-semibold truncate">{list.name}</p>
          <div className="flex flex-row justify-start items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className=" truncate text-sm text-gray-500">{list.address}</p>
          </div>
          <p className=" line-clamp-2 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
            soluta, harum dolore perspiciatis ex quaerat voluptatibus deleniti
            quisquam omnis architecto, itaque ratione quia ea eos quibusdam
            provident, praesentium repudiandae sapiente?{list.description}
          </p>
          <p className="text-md text-slate-500 font-semibold">
            ${list.offer ? list.discountedPrice : list.regularPrice}
            {list.type === "rent" && " / Month"}
                  </p>
                  <div className=" flex flex-row items-center justify-start gap-4">
                      <div className="font-bold text-xs">
                          {list.bedrooms > 1 ? `${list.bedrooms} beds` : `${list.bedrooms} bed`}
                      </div>
                      <div className="font-bold text-xs">
                          {list.bedrooms > 1 ? `${list.bathrooms} bathrooms` : `${list.bathrooms} bathroom`}
                      </div>
                  </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
