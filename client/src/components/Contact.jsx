import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch(`/api/user/${listing.userId}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLandlord(data);
      })
      .catch((err) => console.log(err));
  }, [listing.userId]);

    const changehandler = (evt) => {
        setMessage(evt.target.value);
  };
  return (
    <>
      {landlord && (
        <div className="flex flex-col justify-center items-center gap-5 mt-4">
          <p>
            Contact <span className=" font-semibold">{landlord.username}</span>{" "}
            for <span className=" font-semibold">{listing.name}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows={2}
            value={message}
            onChange={changehandler}
            className=" bg-slate-200 w-full border rounded-2xl p-2"
            placeholder="Enter Your Message here ...."
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name} property&body=${message}`}
            className=" bg-slate-700 text-white p-3 m-3 rounded-3xl uppercase hover:opacity-85"
          >Send Message</Link>
        </div>
      )}
    </>
  );
};

export default Contact;
