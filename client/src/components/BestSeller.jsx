// import React from 'react'
// import ProductCard from './ProductCard'
// import { useAppContext } from '../context/AppContext'
// import { categories } from '../assets/assets'
// import footerBanner from '../assets/footer_banner.jpg'

// const BestSeller = () => {
//   const { products } = useAppContext()

//   // 🔹 Section 1: Global Best Sellers
//   const bestSellers = products
//     .filter(product => product.inStock)
//     .slice(0, 10)

//   // 🔹 Section 2: Home Essentials
//   const homeEssentialsCategory = categories.find(
//     item => item.path.toLowerCase() === 'homeessentials'
//   )

//   const homeEssentialsProducts = products
//     .filter(
//       product =>
//         product.inStock &&
//         product.category.toLowerCase() === 'homeessentials'
//     )
//     .slice(0, 10)

//   return (
//     <div className="mt-16 px-4">

//       {/* ===== ALL PRODUCTS ===== */}
//       {bestSellers.length > 0 && (
//         <div>
//           <p className="text-2xl md:text-3xl font-medium">
//             <span className="text-primary">All </span>Products
//           </p>

//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
//             {bestSellers.map(product => (
//               <ProductCard key={product._id} product={product} />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ===== FOOTER BANNER ===== */}
//       <div className="w-full my-10">
//         <img
//           src={footerBanner}
//           alt="Home Essentials Banner"
//           className="w-full h-auto rounded-lg object-cover"
//         />
//       </div>

//       {/* ===== HOME ESSENTIALS (GREEN TITLE) ===== */}
//       {homeEssentialsProducts.length > 0 && (
//         <div>
//           <p className="text-2xl md:text-3xl font-medium mt-5">
//             <span className="text-[#2b8f72]">Home</span>
//             Essentials
//           </p>


//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
//             {homeEssentialsProducts.map(product => (
//               <ProductCard key={product._id} product={product} />
//             ))}
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }

// export default BestSeller



import React from 'react'
import ProductCard from './ProductCard'
// import ProductSkeleton from './ProductSkeleton'
import { useAppContext } from '../context/AppContext'
import { categories } from '../assets/assets'
import footerBanner from '../assets/footer_banner.jpg'
import ProductSkeleton from './Skeletons/ProductSkeleton'

const BestSeller = () => {
  const { products } = useAppContext()

  const skeletonArray = Array(10).fill(0)

  const bestSellers = products
    .filter(product => product.inStock)
    .slice(0, 10)

  const homeEssentialsProducts = products
    .filter(
      product =>
        product.inStock &&
        product.category.toLowerCase() === 'homeessentials'
    )
    .slice(0, 10)

  return (
    <div className="mt-16 px-4">

      {/* ===== ALL PRODUCTS ===== */}
      <div>
        <p className="text-2xl md:text-3xl font-medium">
          <span className="text-primary">All </span>Products
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
          {products.length === 0
            ? skeletonArray.map((_, i) => <ProductSkeleton key={i} />)
            : bestSellers.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
          }
        </div>
      </div>

      {/* ===== FOOTER BANNER ===== */}
      <div className="w-full my-10">
        <img
          src={footerBanner}
          alt="Home Essentials Banner"
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>

      {/* ===== HOME ESSENTIALS ===== */}
      <div>
        <p className="text-2xl md:text-3xl font-medium mt-5">
          <span className="text-[#2b8f72]">Home</span> Essentials
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
          {products.length === 0
            ? skeletonArray.map((_, i) => <ProductSkeleton key={i} />)
            : homeEssentialsProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
          }
        </div>
      </div>

    </div>
  )
}

export default BestSeller
