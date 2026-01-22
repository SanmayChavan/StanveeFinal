const CartSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row mt-16 px-10 animate-pulse">
      {/* Cart Items */}
      <div className='flex-1 max-w-4xl'>
        {/* Title Skeleton */}
        <div className="h-8 w-64 bg-gray-300 rounded mb-6"></div>
        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-300 text-base font-medium pb-3">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>
          <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>
        </div>

        {/* Cart Items Skeleton */}
        {[1, 2, 3].map((_, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[2fr_1fr_1fr] items-center text-sm md:text-base font-medium pt-3 gap-4"
          >
            {/* Product Details */}
            <div className="flex items-center md:gap-6 gap-3">
              <div className="w-24 h-24 bg-gray-200 rounded border border-gray-300 flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Subtotal Skeleton */}
            <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>

            {/* Remove Button Skeleton */}
            <div className="w-6 h-6 bg-gray-200 rounded mx-auto"></div>
          </div>
        ))}

        {/* Continue Shopping Skeleton */}
        <div className="flex items-center mt-8 gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70 ml-0 md:ml-8">
        {/* Title */}
        <div className="h-6 w-32 bg-gray-200 rounded mb-5"></div>
        <div className="h-px bg-gray-300 mb-5"></div>

        {/* Address Skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
          <div className="h-3 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Payment Method Skeleton */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-8 w-full bg-gray-200 rounded"></div>
        </div>

        <div className="h-px bg-gray-300 mb-4"></div>

        {/* Totals Skeleton */}
        <div className="space-y-2 text-gray-500">
          {[1,2,3].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
          {/* Total Amount */}
          <div className="flex justify-between mt-3">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="h-10 w-full bg-gray-300 rounded mt-6"></div>
      </div>
    </div>
  )
}

export default CartSkeleton;
