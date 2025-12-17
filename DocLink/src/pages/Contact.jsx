import React from "react";
import asset from "../assets/asset";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          CONTACT <span className="text-gray-700 font-medium">US</span>{" "}
        </p>
      </div>
      <div className="flex flex-col my-10 md:flex-row gap-10 mb-28 justify-center text-sm">
        <img className="w-full md:max-w-[360px]" src={asset.contact} alt="" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="text-lg font-semibold text-gray-600">Our Office</p>
          <p className="text-gray-500">
            {" "}
            54790 Willims station <br /> washington, USA
          </p>
          <p className="text-gray-500">
            Tel : (415) 555-01232 <br /> Email : greatstock@gmail.com
          </p>
          <p className="text-lg font-semibold text-gray-600">
            {" "}
            Careers at DocLink
          </p>
          <p className="text-gray-500">
            {" "}
            Learns more about our team and job opening
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
