import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  useEffect(() => {
    const listingId = params.listingId;
    setLoading(true);
    setError(false);
    fetch(`/api/listing/lists/${listingId}`)
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        if (data.success === false) {
          setLoading(false);
          setError(true);
          return console.log(data.message);
        }
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError(true);
      });
  }, []);

  return (
    <main>
      {loading && (
        <p className=" text-center mt-7 text-2xl font-semibold">Loading...</p>
      )}
      {error && (
        <p className=" text-center mt-7 text-2xl font-semibold text-red-700">
          Something went wrong...
        </p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageURL.map((img) => (
              <SwiperSlide key={img}>
                <div
                  className="h-[550px]"
                  style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
};

export default Listing;
