import React, { useState, useEffect } from 'react'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { assets } from '../assets/assets.js'
import { Link } from 'react-router-dom'

const services = [
  { imgSrc: assets.warranty, title: "Warranty", text: "One Year" },
  { imgSrc: assets.freeshipping, title: "Free Shipping", text: "Free shipping on all order" },
  { imgSrc: assets.onlinesupport, title: "Online Support", text: "10:30 AM to 5:30 PM • Monday to Saturday" },
  { imgSrc: assets.securitypayment, title: "Secure Payment", text: "We Value Your Security" },
  { imgSrc: assets.newmemberdiscount, title: "New Member Discount", text: "Code NEW15 get 15% OFF on First Order" },
]

const categoryBanners = [
  {
    img: assets.audio,
    title: "Audio Device",
    subtitle: "Bringing Music to life",
    link: "/products/audio",
  },
  {
    img: assets.appliances,
    title: "Home Appliances",
    subtitle: "Smart Solutions for Modern Living",
    link: "/products/homeappliances",
  },
  {
    img: assets.quality,
    title: "Quality Guaranteed",
    subtitle: "Enjoy One Year of Worry Free Usage",
  },
]


const MainBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const desktopBanners = [
    assets.banner_2,
    assets.banner_1,
    assets.banner_5,
    assets.banner_3,
    assets.banner_4,
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === desktopBanners.length - 1 ? 0 : prev + 1
      )
    }, 5000)
    return () => clearInterval(timer)
  }, [desktopBanners.length])

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === desktopBanners.length - 1 ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? desktopBanners.length - 1 : prev - 1
    )
  }

  return (
    <>
      <div>


        <div className=" bg-gray-100 py-10 px-4 ">

          {/* Banner */}
          <div className="w-full ">
            <div className="relative  overflow-hidden rounded-3xl group ">
              <div className="hidden md:block relative w-full">
                <img
                  src={desktopBanners[0]}
                  alt="banner"
                  className="w-full opacity-0 pointer-events-none"
                />

                {desktopBanners.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`banner-${index}`}
                    className={`absolute inset-0 w-full h-full object-cover
                  transition-opacity duration-[3000ms] ease-in-out
                  ${currentIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                `}
                  />
                ))}
              </div>

              {/* Mobile Banner */}
<div className="md:hidden">
  <img
    src={assets.threeAirFryer}
    alt="banner"
    className="w-full"
  />

  {/* Mobile-only text */}
  <p className="mt-4 text-center text-gray-800 font-semibold px-4">
    Discover the Benefits of Healthy Cooking with Stanvee Air Fryers Less Oil, More Health:
  </p>
</div>


              {/* Arrows */}
              <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2
                       bg-gray-900 w-10 h-10 rounded-full
                       items-center justify-center
                       opacity-0 group-hover:opacity-100
                       transition-all duration-300 z-20"
              >
                <AiOutlineLeft className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2
                       bg-gray-900 w-10 h-10 rounded-full
                       items-center justify-center
                       opacity-0 group-hover:opacity-100
                       transition-all duration-300 z-20"
              >
                <AiOutlineRight className="w-5 h-5 text-white" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden md:flex gap-2 z-20">

                {desktopBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-3 rounded-full transition-all duration-300
                  ${currentIndex === index ? 'bg-primary w-6' : 'bg-gray-300 w-3'}
                `}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="w-full ">
            <div className="w-full shadow-xl rounded-2xl py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mt-10 relative z-30 bg-white px-2">
              {services.map((s, index) => (
                <div
                  key={s.title}
                  className={`flex items-center gap-4 border-r border-gray-100 pr-2
                ${index === services.length - 1 ? 'border-r-0' : ''}
              `}
                >
                  <img src={s.imgSrc} alt={s.title} className="w-12 h-12 object-contain" />
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{s.title}</h3>
                    <p className="text-xs text-gray-500 leading-tight">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>




        </div>
        {/* Category Banners */}
        <div className="w-full px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {categoryBanners.map((banner, i) => {
            const Wrapper = banner.link ? Link : 'div'

            return (
              <Wrapper
                key={i}
                to={banner.link}
                className="relative h-45 rounded-3xl overflow-hidden shadow-lg group cursor-pointer"
              >
                <img
                  src={banner.img}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 flex flex-col justify-center px-8">
                  <h2 className="text-black text-2xl font-semibold">
                    {banner.title}
                  </h2>
                  <p className="text-black/90 text-sm mb-4">
                    {banner.subtitle}
                  </p>

                  {banner.link && (
                    <span className="w-fit bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-[#2b8f72] transition">
                      Shop now
                    </span>
                  )}
                </div>
              </Wrapper>
            )
          })}
        </div>

      </div>
    </>

  )
}

export default MainBanner
