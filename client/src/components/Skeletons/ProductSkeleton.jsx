// ProductSkeleton.jsx
const ProductSkeleton = () => {
  return (
    <div className="px-2 md:px-4 animate-pulse">
      <div className="border border-gray-200 rounded-md md:px-4 px-3 py-2 bg-white mt-2 m-1 w-full">
        
        {/* Image */}
        <div className="flex justify-center items-center h-32 md:h-40 bg-gray-200 rounded" />

        {/* Text */}
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-300 rounded w-full" />
          <div className="h-4 bg-gray-300 rounded w-3/4" />

          {/* Price & button */}
          <div className="flex justify-between items-center mt-3">
            <div className="h-5 bg-gray-300 rounded w-20" />
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSkeleton
