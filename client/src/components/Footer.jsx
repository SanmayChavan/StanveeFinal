import React from 'react'
import { assets, footerLinks } from '../assets/assets'
import stanvee_logo from "../assets/stanvee_logo-Photoroom.png"
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-primary/10">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
        
        {/* Logo & Description */}
        <div className="md:w-[30%]">
          <NavLink to="/">
            <div className="w-40 h-12">
              <img
                src={stanvee_logo}
                alt="Stanvee"
                className="w-full h-full object-cover"
              />
            </div>
          </NavLink>

          <p className="max-w-[410px] mt-6">
            Don't miss out on the chance to indulge in shopping, travel, utility services,
            and wellness experiences while enjoying attractive discounts and deals.
            Visit stanvee.com to explore the multitude of offerings and let the
            celebrations begin with Stanvee.
          </p>
        </div>

        {/* Footer Links in Row on Desktop */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full md:w-[65%] gap-5">
          {footerLinks.map((section, index) => (
            <div key={index} className="min-w-[120px]">
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      className="hover:underline transition"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
        © Stanvee Services India Limited. All Rights Reserved.
      </p>
    </div>
  )
}

export default Footer
