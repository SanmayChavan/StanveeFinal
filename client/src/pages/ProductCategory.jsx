import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom'
import { categories } from '../assets/assets'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/Skeletons/ProductSkeleton'
// import ProductSkeleton from '../components/ProductSkeleton'

const ProductCategory = () => {

  const { products } = useAppContext()
  const { category } = useParams()

  const skeletonArray = Array(10).fill(0)

  const searchCategory = categories.find(
    item => item.path.toLowerCase() === category
  )

  const filteredProducts = products.filter(
    product => product.category.toLowerCase() === category
  )

  return (
    <div className="mt-5 md:mt-16 px-2 md:px-4">

      {/* Category Title */}
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-2xl font-medium">
            {searchCategory.text.toUpperCase()}
          </p>
          <div className="w-16 h-0.5 bg-primary rounded-full" />
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">

        {products.length === 0 ? (
          skeletonArray.map((_, i) => <ProductSkeleton key={i} />)
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-[60vh]">
            <p className="text-2xl font-medium text-primary">
              No Products found in this category.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProductCategory
