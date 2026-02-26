import mongoose from "mongoose";
import User from "../models/User.js";
import Product from "../models/product.js";

/* =========================================
   1️⃣ GET WALLET
========================================= */
export const getWallet = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("walletBalance transactions");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      walletBalance: user.walletBalance,
      transactions: user.transactions,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================
   2️⃣ APPLY COUPON (Instant deduction)
========================================= */
export const applyCoupon = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId).session(session);
    const product = await Product.findById(productId).session(session);

    if (!user || !product) throw new Error("User or product not found");

    const cartItem = user.cartItems?.[productId];
    if (!cartItem) throw new Error("Product not in cart");

    if (cartItem.couponApplied) throw new Error("Coupon already applied");

    // Deduct wallet up to discount or wallet balance
    const discount = Math.min(product.couponDiscount, user.walletBalance);
    if (discount <= 0) throw new Error("Insufficient wallet balance");

    user.walletBalance -= discount;
    user.transactions.push({
      amount: discount,
      type: "debit",
      description: `Coupon applied on ${product.name}`,
    });

    // Update cart item
    cartItem.couponApplied = true;
    cartItem.appliedDiscount = discount;
    cartItem.finalPrice = product.offerPrice - discount;

    user.cartItems[productId] = cartItem;

    await user.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      cartItem,
      walletBalance: user.walletBalance,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, message: err.message });
  }
};

/* =========================================
   3️⃣ REMOVE COUPON (Instant refund)
========================================= */
export const removeCoupon = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    const cartItem = user.cartItems?.[productId];
    if (!cartItem || !cartItem.couponApplied)
      throw new Error("No coupon applied on this product");

    const refundAmount = cartItem.appliedDiscount || 0;
    user.walletBalance += refundAmount;

    user.transactions.push({
      amount: refundAmount,
      type: "credit",
      description: `Coupon removed for product ${productId}`,
    });

    // Reset cart item coupon
    cartItem.couponApplied = false;
    cartItem.appliedDiscount = 0;
    cartItem.finalPrice = cartItem.quantity * (cartItem.finalPrice ? 1 : 0); // fallback

    user.cartItems[productId] = cartItem;

    await user.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      cartItem,
      walletBalance: user.walletBalance,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, message: err.message });
  }
};

/* =========================================
   4️⃣ UPDATE CART ITEM QUANTITY
      Refund wallet if quantity = 0
========================================= */
export const updateCartItemQuantity = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, productId, quantity } = req.body;

    const user = await User.findById(userId).session(session);
    const product = await Product.findById(productId).session(session);
    if (!user || !product) throw new Error("User or product not found");

    const cartItem = user.cartItems?.[productId];
    if (!cartItem) throw new Error("Product not in cart");

    if (quantity <= 0) {
      // Refund wallet if coupon applied
      if (cartItem.couponApplied) {
        user.walletBalance += cartItem.appliedDiscount || 0;
        user.transactions.push({
          amount: cartItem.appliedDiscount,
          type: "credit",
          description: `Coupon refunded due to removal of ${product.name}`,
        });
      }
      delete user.cartItems[productId];
    } else {
      cartItem.quantity = quantity;
      if (cartItem.couponApplied) {
        cartItem.finalPrice = product.offerPrice - cartItem.appliedDiscount;
      }
      user.cartItems[productId] = cartItem;
    }

    await user.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      cartItem: user.cartItems[productId] || null,
      walletBalance: user.walletBalance,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, message: err.message });
  }
};

/* =========================================
   5️⃣ FINAL WALLET VALIDATION
========================================= */
// walletController.js
export const validateOrderWallet = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.walletBalance < 0)
      throw new Error("Wallet corrupted (negative)");

    res.json({ success: true, walletBalance: user.walletBalance });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};