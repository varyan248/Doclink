import React from "react";
import asset from "../assets/asset.js";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40  text-sm">
      {/* ----LEFT SIDE ---- */}
      <div>
        <img src={asset.logo} className="w-24 mb-5" alt="" />
        <p className="w-full md:w-2/3 text-gray-600 leading-6">
          DocLink is your trusted platform to find and book appointments with
          verified doctors. We aim to make healthcare accessible, convenient,
          and transparent for everyone. Search by specialty, compare doctors,
          and get instant appointments .
        </p>
      </div>
      {/* ---- CENTER SECTION */}
      <div>
        <p className="text-xl font-medium mb-5">Company</p>
        <ul className="flex flex-col text-gray-600  gap-2">
          <li>Home </li>
          <li>About Us</li>
          <li>Contact Us</li>
          <li> Privacy Pokicy</li>
        </ul>
      </div>
      {/* --- RIGHT SIDE */}
      <div>
        <p className="text-xl font-medium mb-5">Get In Touch</p>
          <ul  className="flex flex-col text-gray-600  gap-2">
            <li>+1-212-456-7890</li>
            <li>greatstoockdev@gmail.com</li>
          </ul>
      </div>
    </div>

{/* ---COPY RIGHT TEXT */}
<div>
  <hr />
  <p className="py-5 text-center text-sm"> Copyright 2024@ DocLink - All Time Reserved </p>
</div>
    </div>
  );
};


export default Footer;
