// import User from "../models/User.js";


// // update user Cartdata : /api/cart/update
// export const updateCart = async(req, res) => {
//     try {
//         const { userId, cartItems } = req.body;  // Expecting cartItems to be passed in the request body
//         await User.findByIdAndUpdate(userId, { cartItems });

//         res.json({ success: true, message: "Cart Updated" });
//     } catch (err) {
//         console.log(err);
//         res.json({ success: false, message: 'Failed to update cart' });
//     }
// }


import User from "../models/User.js";
import Product from "../models/product.js";

export const updateCart = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const productIds = Object.keys(cartItems);
        const products = await Product.find({ _id: { $in: productIds } });

        const updatedCart = {};

        for (const product of products) {
            const item = cartItems[product._id.toString()];
            if (!item) continue;

            const quantity = item.quantity;
            const couponSelected = item.couponSelected;

            // Calculate final price (preview only)
            let finalPrice = product.offerPrice;
            if (couponSelected && product.couponDiscount > 0) {
                finalPrice = product.offerPrice - product.couponDiscount;
            }

            updatedCart[product._id] = {
                quantity,
                couponSelected,
                finalPrice
            };
        }

        user.cartItems = updatedCart;
        await user.save();

        res.json({
            success: true,
            message: "Cart updated successfully",
            cartItems: updatedCart,
            walletBalance: user.walletBalance  // wallet unchanged here
        });

    } catch (err) {
        console.error("Cart Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};