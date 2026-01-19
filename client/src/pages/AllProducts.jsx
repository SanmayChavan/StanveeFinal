import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'

const AllProducts = () => {
  const { products, searchQuery } = useAppContext()
  const [filteredProducts, setFilteredProducts] = useState([])

  // useEffect(() => {
  //   if (typeof searchQuery === 'string' && searchQuery.trim().length > 0) {
  //     const query = searchQuery.toLowerCase()
  //     setFilteredProducts(
  //       products.filter(product =>
  //         product.name.toLowerCase().includes(query)
  //       )
  //     )
  //   } else {
  //     setFilteredProducts(products)
  //   }
  // }, [products, searchQuery])


  useEffect(() => {
    if (typeof searchQuery === 'string' && searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().replace(/\s+/g, ''); // remove spaces
      setFilteredProducts(
        products.filter(product =>
          product.name.toLowerCase().replace(/\s+/g, '').includes(query)
        )
      )
    } else {
      setFilteredProducts(products)
    }
  }, [products, searchQuery])


  return (
    <div className="px-4 mt-16">
      {/* Header */}
      <div className="flex flex-col px-4">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full mt-1" />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
        {filteredProducts
          .filter(product => product.inStock)
          .map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  )
}

export default AllProducts
