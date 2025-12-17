import React from "react";

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row bg-blue-400 rounded-lg px-6 md:px-10 lg:px-20 mt-4">
      {/* {------ left side -------} */}
      <div className="mid:1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight">
          Book appointments <br />
          With trusted Doctor
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light ">
          <p>Simply browse through our extensive list of trusted doctors </p>
        </div>
        <a
          href="#speciality"
          className="flex items-center gap-2 bg-white px-8 py-3 text-gray-500 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300 rounded-full"
        >
          Book Appointments{" "}
        </a>
      </div>

      {/* {----- Right side -------} */}
      <div className="relative md:w-1/2 ">
        <img
          className="md-full md:absolute h-auto bottom-0 rounded-lg"
          src="https://assets.medpagetoday.net/media/images/101xxx/101506.jpg"
          alt=""
        />
      </div>
    </div>
  );
};

export default Header;
