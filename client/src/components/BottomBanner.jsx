import React from 'react'
import gifting from '../assets/gifting.jpg'

const BottomBanner = () => {
  return (
    <div className="relative mt-24 px-4">
      <img
        src={gifting}
        alt="banner"
        className="w-full object-contain"
      />
    </div>
  )
}

export default BottomBanner
