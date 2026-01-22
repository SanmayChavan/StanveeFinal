const MyOrdersSkeleton = () => {
  return (
    <div className="mt-16 px-4 md:px-10 animate-pulse">

      {/* Title Skeleton */}
      <div className="flex flex-col items-center md:items-start mb-8">
        <div className="h-6 w-40 bg-gray-300 rounded"></div>
        <div className="w-16 h-1 bg-gray-300 rounded mt-2"></div>
      </div>

      {/* Order Card Skeleton */}
      {[1, 2].map((_, i) => (
        <div
          key={i}
          className="border border-gray-300 rounded-lg mb-8 p-4 max-w-4xl mx-auto"
        >

          {/* Order Info */}
          <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-4">
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>

          {/* Order Items */}
          {[1, 2].map((_, index) => (
            <div
              key={index}
              className={`py-4 ${
                index !== 1 && 'border-b border-gray-200'
              }`}
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>

              <div className="flex justify-between mt-3">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>

                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default MyOrdersSkeleton
