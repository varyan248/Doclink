import React from "react";
import asset from "../assets/asset";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          {" "}
          ABOUT <span className="text-gray-700 font-medium">US</span>{" "}
        </p>
      </div>
      <div className="flex flex-col my-10 md:flex-row gap-12">
        <img className="w-full md:max-w-[360px]" src={asset.couple} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-500">
          <p>
            Welcome to DocLink, your trusted partner in managing healthcare
            needs with ease, convenience, and confidence, a platform designed to
            simplify your healthcare journey. From discovering the right doctors
            to booking appointments seamlessly, we ensure you receive the care
            you need, when you need it.{" "}
          </p>
          <p>
            At DocLink, we’re committed to making healthcare simpler — helping
            you connect with trusted doctors, book appointments effortlessly,
            and manage your well-being with confidence.{" "}
          </p>
          <b className="text-gray-800">Our vision</b>
          <p>
            To build a healthier future by bridging the gap between patients and
            healthcare providers with trust and simplicity & To become the most
            reliable and user-friendly healthcare platform, transforming how
            people find doctors and manage their wellness.
          </p>
        </div>
      </div>
      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-15 text-[15px] hover:bg-blue-400 hover:text-white transition-all duration-all text-gray-600 cursor-pointer ">
          <b>EFFICIENCY :</b>
          <p>We make healthcare easier by reducing waiting time, simplifying booking.</p>

        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-15 text-[15px] hover:bg-blue-400 hover:text-white transition-all duration-all text-gray-600 cursor-pointer ">
          <b>CONVENIENCE :</b>
          <p>From browsing specialists to confirming appointments, everything is designed to be fast</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-15 text-[15px] hover:bg-blue-400 hover:text-white transition-all duration-all text-gray-600 cursor-pointer ">
          <b>PERSONALIZATION :</b>
          <p>Tailored recommendations and appointment options designed to fit your unique healthcare needs.</p>
        </div>
      </div>

    </div>
  );
};

export default About;
