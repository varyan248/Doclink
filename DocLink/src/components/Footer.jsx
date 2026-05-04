import React from "react";
import asset from "../assets/asset.js";

const Footer = () => {
  return (
    <div className="md:mx-10 mt-32 border-t border-gray-100 pt-16 pb-8">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 text-sm">
        {/* ----LEFT SIDE ---- */}
        <div>
          <img src={asset.logo} className="w-32 mb-6" alt="DocLink" />
          <p className="w-full md:w-5/6 text-gray-500 leading-relaxed text-base">
            DocLink is your trusted platform to find and book appointments with
            verified, award-winning doctors. We aim to make healthcare accessible, 
            convenient, and transparent for everyone. Search by specialty, compare doctors,
            and get instant appointments.
          </p>
        </div>
        
        {/* ---- CENTER SECTION */}
        <div>
          <p className="text-xl font-bold text-gray-800 mb-6 relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-1 after:bg-blue-600 after:-bottom-2 after:left-0 after:rounded-full">Company</p>
          <ul className="flex flex-col text-gray-500 gap-4 text-base">
            <li className="cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all">Home</li>
            <li className="cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all">About Us</li>
            <li className="cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all">Contact Us</li>
            <li className="cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all">Privacy Policy</li>
          </ul>
        </div>
        
        {/* --- RIGHT SIDE */}
        <div>
          <p className="text-xl font-bold text-gray-800 mb-6 relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-1 after:bg-blue-600 after:-bottom-2 after:left-0 after:rounded-full">Get In Touch</p>
          <ul className="flex flex-col text-gray-500 gap-4 text-base">
            <li className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
              <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">📞</span>
              +1-212-456-7890
            </li>
            <li className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
              <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">✉️</span>
              greatstoockdev@gmail.com
            </li>
          </ul>
        </div>
      </div>

      {/* ---COPY RIGHT TEXT */}
      <div className="mt-16">
        <hr className="border-gray-200" />
        <p className="py-6 text-center text-sm text-gray-500">
          Copyright 2024 &copy; <span className="font-semibold text-blue-600">DocLink</span> - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
