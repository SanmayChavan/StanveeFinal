import React from 'react';

const ContactUs = () => {
  const themeColor = "#4fbf4f";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-12">
      <h1 
        className="text-4xl font-bold mb-8"
        style={{ color: themeColor }}
      >
        Contact Us
      </h1>

      <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: themeColor }}>
          Stanvee Services India Limited
        </h2>

        <div className="space-y-4 text-gray-700 text-base">
          <p>
            <strong>ADDRESS:</strong> Andheri West, Mumbai, Maharashtra 400054
          </p>
          <p>
            <strong>MOBILE NO:</strong> 
            <br />+91 92705 21515 (Time: 10:30 AM to 7:00 PM)
            <br />+91 99209 20300 (24x7)
          </p>
          <p>
            <strong>EMAIL:</strong> <a href="mailto:info@stanveeservices.com" className="text-green-600 hover:underline">info@stanveeservices.com</a>
          </p>
          <p>
            <strong>WORKING HOURS:</strong> Mon – Sat 10:00 AM to 6:00 PM | Sundays Closed & Holidays
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2" style={{ color: themeColor }}>Get in Touch</h3>
          <form className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Your Name" 
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <textarea 
              placeholder="Your Message" 
              className="border border-gray-300 rounded px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
            ></textarea>
            <button 
              type="submit" 
              className="bg-[#4fbf4f] text-white font-semibold py-3 rounded hover:bg-green-600 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
