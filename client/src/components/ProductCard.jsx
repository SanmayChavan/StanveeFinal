import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate, user, setShowUserLogin } = useAppContext();

  if (!product) return null;

  return (
    <div className="p-2 sm:p-3 md:p-4 w-full">
      <div
        onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0); }}
        className="border border-gray-300 rounded-lg bg-white hover:shadow-lg transition overflow-hidden flex flex-col h-full"
      >
        {/* Product Image */}
        <div className="flex items-center justify-center p-2 sm:p-3 md:p-4 bg-gray-50">
          <img
            className="w-full h-40 sm:h-48 md:h-56 object-contain group-hover:scale-105 transition-transform"
            src={product.image[0]}
            alt={product.name}
          />
        </div>

        {/* Product Info */}
        <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-1">
          {/* Category */}
          <p className="text-xs sm:text-sm text-gray-500">{product.category}</p>

          {/* Name */}
          <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700 truncate mt-1">{product.name}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="w-3 sm:w-3.5"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt=""
                />
              ))}
            <span className="text-xs sm:text-sm text-gray-500 ml-1">(4)</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mt-2 sm:mt-3">
            <p className="text-sm sm:text-base md:text-lg font-semibold text-primary">
              {currency}{product.offerPrice}{" "}
              <span className="line-through text-gray-400 text-xs sm:text-sm md:text-base ml-1">{currency}{product.price}</span>
            </p>

            {/* Add to Cart / Quantity */}
            <div onClick={(e) => e.stopPropagation()}>
              {!cartItems[product._id] ? (
                <button
                  onClick={() => { user ? addToCart(product._id) : setShowUserLogin(true); }}
                  className="flex items-center justify-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 md:py-2 bg-primary/10 border border-primary/40 text-primary text-xs sm:text-sm md:text-base rounded-md hover:bg-primary/20 transition"
                >
                  <img src={assets.cart_icon} alt="cart" className="w-4 sm:w-5 md:w-6" />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 md:py-2 bg-primary/25 rounded-md select-none">
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 cursor-pointer text-sm sm:text-base md:text-base"
                  >
                    -
                  </button>
                  <span className="w-5 text-center text-sm sm:text-base">{cartItems[product._id]}</span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 cursor-pointer text-sm sm:text-base md:text-base"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


// import React from "react";
// import { assets } from "../assets/assets";
// import { useAppContext } from "../context/AppContext";

// const ProductCard = ({ product }) => {
//   const { currency, addToCart, removeFromCart, cartItems, navigate, user, setShowUserLogin } = useAppContext();

//   return product && (
//     <div className="px-2 md:px-4">
//       <div onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0) }}
//         className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white mt-2 m-1 w-full ">
//         <div className="group cursor-pointer flex items-center justify-center px-2">
//           <img
//             className="group-hover:scale-105 transition max-w-26 md:max-w-36"
//             src={product.image[0]}
//             alt={product.name}
//           />
//         </div>
//         <div className="text-gray-500/60 text-sm">
//           <p>{product.category}</p>
//           <p className="text-gray-700 font-medium text-lg truncate w-full">
//             {product.name}
//           </p>
//           <div className="flex items-center gap-0.5">
//             {Array(5)
//               .fill("")
//               .map((_, i) =>
//                 <img key={i} className="md:w-3.5 w-3" src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" />
//               )}
//             <p>({4})</p>
//           </div>
//           <div className="flex items-end justify-between mt-3">
//             <p className="md:text-xl text-base font-medium text-primary">
//               {currency}{product.offerPrice}{" "}
//               <span className="text-gray-500/60 md:text-sm text-xs line-through">
//                 {currency}{product.price}
//               </span>
//             </p>
//             <div onClick={(e) => { e.stopPropagation(); }} className="text-primary">
//               {!cartItems[product._id] ? (
//                 <button
//                   className="flex cursor-pointer items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded "
//                   onClick={() => { user ? addToCart(product._id) : setShowUserLogin(true) }}
//                 >
//                   <img src={assets.cart_icon} alt="cart_icon" />
//                   Add
//                 </button>
//               ) : (
//                 <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
//                   <button
//                     onClick={() => removeFromCart(product._id)}
//                     className="cursor-pointer text-md px-2 h-full"
//                   >
//                     -
//                   </button>
//                   <span className="w-5 text-center">{cartItems[product._id]}</span>
//                   <button
//                     onClick={() => addToCart(product._id)}
//                     className="cursor-pointer text-md px-2 h-full"
//                   >
//                     +
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
