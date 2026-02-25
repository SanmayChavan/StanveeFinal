



// import { assets } from "../assets/assets";
// import { useAppContext } from "../context/AppContext";

// /**
//  * Cloudinary image optimizer
//  * Converts:
//  * /upload/xxx.png
//  * → /upload/f_auto,q_auto,w_300/xxx.png
//  */
// const optimizeCloudinaryImage = (url, width = 300) => {
//   if (!url) return "";
//   return url.replace(
//     "/upload/",
//     `/upload/f_auto,q_auto,w_${width}/`
//   );
// };

// const ProductCard = ({ product }) => {
//   const {
//     currency,
//     addToCart,
//     removeFromCart,
//     cartItems,
//     navigate,
//     user,
//     setShowUserLogin,
//   } = useAppContext();

//   if (!product) return null;

//   const imageUrl = product.image?.[0];

//   return (
//     <div className="px-1 md:px-4">
//       <div
//         onClick={() => {
//           navigate(
//             `/products/${product.category.toLowerCase()}/${product._id}`
//           );
//           scrollTo(0, 0);
//         }}
//         className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white mt-2 m-1 w-full"
//       >
//         {/* Image */}
//         <div className="group cursor-pointer flex items-center justify-center px-2">
//           <img
//             src={optimizeCloudinaryImage(imageUrl, 300)}
//             srcSet={`
//               ${optimizeCloudinaryImage(imageUrl, 300)} 300w,
//               ${optimizeCloudinaryImage(imageUrl, 600)} 600w
//             `}
//             sizes="(max-width: 768px) 40vw, 300px"
//             alt={product.name}
//             loading="lazy"
//             decoding="async"
//             className="group-hover:scale-105 transition max-w-26 md:max-w-36"
//           />
//         </div>

//         {/* Content */}
//         <div className="text-gray-500/60 text-sm">
//           <p>{product.category}</p>

//           <p className="text-gray-700 font-medium text-lg truncate w-full">
//             {product.name}
//           </p>

//           {/* Rating */}
//           <div className="flex items-center gap-0.5">
//             {Array(5)
//               .fill("")
//               .map((_, i) => (
//                 <img
//                   key={i}
//                   className="md:w-3.5 w-3"
//                   src={i < 4 ? assets.star_icon : assets.star_dull_icon}
//                   alt=""
//                 />
//               ))}
//             <p>({4})</p>
//           </div>

//           {/* Price & Cart */}
//           <div className="flex items-end justify-between mt-3">
//             <p className="md:text-[17px] sm:text-sm font-medium text-primary">
//               {currency}
//               {product.offerPrice}{" "}
//               <span className="text-gray-500/60 md:text-sm sm:text-sm  line-through">
//                 {currency}
//                 {product.price}
//               </span>
//             </p>

//             <div
//               onClick={(e) => e.stopPropagation()}
//               className="text-primary"
//             >
//               {!cartItems[product._id] ? (
//                 <button
//                   className="flex cursor-pointer items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-16 w-[54px] h-[24px] rounded"
//                   onClick={() =>
//                     user ? addToCart(product._id) : setShowUserLogin(true)
//                   }
//                 >
//                   <img src={assets.cart_icon} alt="cart_icon" />
//                   Add
//                 </button>
//               ) : (
//                 <div className="flex items-center justify-center gap-2 md:w-16 w-16 h-[34px] bg-primary/25 rounded select-none">
//                   <button
//                     onClick={() => removeFromCart(product._id)}
//                     className="cursor-pointer text-md px-2 h-full"
//                   >
//                     -
//                   </button>
//                   <span className="w-5 text-center">
//                     {cartItems[product._id]}
//                   </span>
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



import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

/**
 * Cloudinary image optimizer
 */
const optimizeCloudinaryImage = (url, width = 300) => {
  if (!url) return "";
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
};

const ProductCard = ({ product }) => {
  const {
    currency,
    addToCart,
    removeFromCart,
    cartItems,
    navigate,
    user,
    setShowUserLogin,
  } = useAppContext();

  if (!product) return null;

  const imageUrl = product.image?.[0];
  const cartItem = cartItems[product._id]; // can be undefined or {quantity, couponSelected}
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="px-1 md:px-4">
      <div
        onClick={() => {
          navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
          scrollTo(0, 0);
        }}
        className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white mt-2 m-1 w-full cursor-pointer hover:shadow-md transition"
      >
        {/* Image */}
        <div className="group flex items-center justify-center px-2">
          <img
            src={optimizeCloudinaryImage(imageUrl, 300)}
            srcSet={`
              ${optimizeCloudinaryImage(imageUrl, 300)} 300w,
              ${optimizeCloudinaryImage(imageUrl, 600)} 600w
            `}
            sizes="(max-width: 768px) 40vw, 300px"
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="group-hover:scale-105 transition max-w-26 md:max-w-36"
          />
        </div>

        {/* Content */}
        <div className="text-gray-500/80 text-sm mt-2">
          <p className="truncate">{product.category}</p>
          <p className="text-gray-800 font-medium text-lg truncate w-full mt-1">
            {product.name}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="md:w-3.5 w-3"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt=""
                />
              ))}
            <p className="ml-1 text-xs">({4})</p>
          </div>

          {/* Price & Cart */}
          <div className="flex items-end justify-between mt-3">
            <p className="md:text-[17px] sm:text-sm font-medium text-primary">
              {currency}
              {product.offerPrice}{" "}
              <span className="text-gray-500/60 md:text-sm sm:text-sm line-through">
                {currency}
                {product.price}
              </span>
            </p>

            <div
              onClick={(e) => e.stopPropagation()}
              className="text-primary flex items-center"
            >
              {quantity === 0 ? (
                <button
                  className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-16 w-[54px] h-[28px] rounded"
                  onClick={() =>
                    user ? addToCart(product._id) : setShowUserLogin(true)
                  }
                >
                  <img src={assets.cart_icon} alt="cart_icon" />
                  Add
                </button>
              ) : (
                <div className="flex items-center gap-2 md:w-16 w-16 h-[34px] bg-primary/25 rounded select-none">
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">{quantity}</span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full"
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