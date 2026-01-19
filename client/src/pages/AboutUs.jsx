import React from "react";

const AboutUs = () => {
  const themeColor = "#4fbf4f";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-12">
      <h1
        className="text-4xl font-bold mb-8"
        style={{ color: themeColor }}
      >
        About Us
      </h1>

      <div className="bg-white shadow-md rounded-lg p-8 max-w-4xl w-full">
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: themeColor }}
        >
          Stanvee Services
        </h2>

        <div className="space-y-4 text-gray-700 text-base leading-relaxed">
          <p>
            After assisting businesses in gaining profits for the last 15 years
            in the travel & service sector, Stanvee Services has decided to share
            its immense experience and unparalleled discounts directly with its
            end users — you and your loved ones.
          </p>

          <p>
            Our premium services have earned us a wide and loyal clientele across
            the globe. We aim to provide the highest level of quality along with
            exemplary customer service.
          </p>

          <p>
            Our company is committed to improving lives by creating happy,
            successful, and vibrant futures for our customers. We believe our
            long-term success comes from the enthusiasm and positive mindset of
            our committed team, which continuously strives to take Stanvee
            Services to greater heights in the travel & service sector.
          </p>

          <p>
            We warmly welcome you into our family and wish you happiness as you
            explore and enjoy our products and services.
          </p>
        </div>

        <div className="mt-8">
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: themeColor }}
          >
            Our Mission
          </h3>
          <p className="text-gray-700">
            <strong>"Passion to Deliver Perfection"</strong> — At Stanvee
            Services, our team is pledged to deliver a perfect amalgamation of
            exceptional products and unparalleled services to create a lasting
            impression. Your satisfaction is our ultimate goal.
          </p>
        </div>

        <div className="mt-6">
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: themeColor }}
          >
            Our Vision
          </h3>
          <p className="text-gray-700">
            To create happy employees delivering high-quality services that
            inspire strong customer loyalty.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
