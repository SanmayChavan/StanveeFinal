// controllers/orderController.js
// import Product from "../models/product.js";
import Order from "../models/order.js";
import User from "../models/User.js";
import stripe from "stripe";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOrderProductsHTML } from "../utils/emailTemplates.js";
import Product from "../models/product.js";


import mongoose from "mongoose";


import address from "../models/adress.js";


// Admin email
const adminEmail = "sanmaychavan22@gmail.com";



// export const placeOrderCOD = async (req, res) => {
//   try {
//     const { userId, items, address } = req.body;

//     if (!address || !items || items.length === 0) {
//       return res.status(400).json({ success: false, message: "Invalid data" });
//     }

//     // Fetch user and products
//     const [user, products] = await Promise.all([
//       User.findById(userId),
//       Product.find({ _id: { $in: items.map(i => i.product) } })
//     ]);

//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     // Map products by ID for easy lookup
//     const productMap = products.reduce((map, p) => {
//       map[p._id.toString()] = p;
//       return map;
//     }, {});

//     let totalAmount = 0;
//     let totalWalletDeduction = 0;

//     // Build order items
//     const orderItems = items.map(item => {
//       const product = productMap[item.product.toString()];
//       if (!product) throw new Error(`Product ${item.product} not found`);

//       // Start with offer price
//       let finalPricePerUnit = product.offerPrice;
//       let walletDeductionPerUnit = 0;

//       // Apply coupon if selected and wallet has balance
//       if (item.couponSelected && product.couponDiscount) {
//         walletDeductionPerUnit = Math.min(product.couponDiscount, user.walletBalance);
//         finalPricePerUnit -= walletDeductionPerUnit;

//         // Deduct from wallet per unit
//         const totalDeduction = walletDeductionPerUnit * item.quantity;
//         user.walletBalance -= totalDeduction;
//         totalWalletDeduction += totalDeduction;

//         // Record transaction for this item
//         user.transactions.push({
//           amount: totalDeduction,
//           type: "debit",
//           description: `Coupon applied on ${product.name} × ${item.quantity}`
//         });
//       }

//       const finalPriceTotal = finalPricePerUnit * item.quantity;
//       totalAmount += finalPriceTotal;

//       return {
//         product: item.product,
//         quantity: item.quantity,
//         finalPrice: finalPricePerUnit, // price per unit
//         finalPriceTotal,               // total for this item
//         couponSelected: item.couponSelected || false,
//         couponDiscount: walletDeductionPerUnit
//       };
//     });

//     // Save user wallet and transaction updates
//     await user.save();

//     // Create order
//     const order = await Order.create({
//       userId,
//       items: orderItems,
//       totalAmount,
//       walletDeduction: totalWalletDeduction,
//       address,
//       paymentType: "COD",
//       status: "Order Placed"
//     });

//     // Generate email HTML
//     const productHTML = generateOrderProductsHTML(
//       orderItems.map(i => ({ ...i, product: productMap[i.product.toString()] }))
//     );

//     // Send emails (non-blocking)
//     Promise.all([
//       sendEmail({
//         to: user.email,
//         subject: `Order Confirmed - #${order._id}`,
//         html: `<h3>Hi ${user.name}</h3><p>Order #${order._id} placed successfully.</p>${productHTML}`,
//       }),
//       sendEmail({
//         to: adminEmail,
//         subject: `New COD Order - #${order._id}`,
//         html: `<p>Customer: ${user.name}</p>${productHTML}`,
//       })
//     ]).catch(err => console.error("Email failed:", err));

//     // ✅ Send response with updated wallet balance
//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order,
//       userWalletBalance: user.walletBalance
//     });

//   } catch (err) {
//     console.error("❌ COD Order Error:", err.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const [user, products] = await Promise.all([
      User.findById(userId),
      Product.find({ _id: { $in: items.map(i => i.product) } })
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Map products
    const productMap = products.reduce((map, p) => {
      map[p._id.toString()] = p;
      return map;
    }, {});

    let totalAmount = 0;
    let totalWalletDeduction = 0;

    // 🔥 Use local wallet tracker
    let remainingWallet = user.walletBalance;

    const orderItems = [];

    for (const item of items) {

      const product = productMap[item.product.toString()];
      if (!product) continue;

      const basePrice = product.offerPrice || 0;
      const couponValue = product.couponDiscount || 0;

      let walletDeductionPerUnit = 0;
      let finalUnitPrice = basePrice;

      if (
        item.couponSelected &&
        couponValue > 0 &&
        remainingWallet > 0
      ) {

        // Total coupon possible for this item
        const maxCouponForItem = couponValue * item.quantity;

        // Clamp against wallet
        const actualDeductionForItem = Math.min(
          maxCouponForItem,
          remainingWallet
        );

        // Deduct from wallet safely
        remainingWallet -= actualDeductionForItem;
        totalWalletDeduction += actualDeductionForItem;

        // Distribute evenly per unit
        walletDeductionPerUnit =
          actualDeductionForItem / item.quantity;

        finalUnitPrice = basePrice - walletDeductionPerUnit;

        // Record transaction
        if (actualDeductionForItem > 0) {
          user.transactions.push({
            amount: actualDeductionForItem,
            type: "debit",
            description: `Coupon applied on ${product.name} × ${item.quantity}`
          });
        }
      }

      const finalPriceTotal = finalUnitPrice * item.quantity;
      totalAmount += finalPriceTotal;

      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        finalPrice: finalUnitPrice,
        finalPriceTotal,
        couponSelected: item.couponSelected || false,
        couponDiscount: walletDeductionPerUnit
      });
    }

    // ✅ Prevent negative wallet
    user.walletBalance = Math.max(0, remainingWallet);
    await user.save();

    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      walletDeduction: totalWalletDeduction,
      address,
      paymentType: "COD",
      status: "Order Placed"
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
      userWalletBalance: user.walletBalance
    });

  } catch (err) {
    console.error("❌ COD Order Error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    if (!address || !items || items.length === 0) {
      console.log("❌ Invalid data for Stripe order");
      return res.json({ success: false, message: "Invalid data" });
    }

    const productData = [];

    // Calculate amount
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      console.log(`📦 Adding product ${product.name} x ${item.quantity} = ${product.offerPrice * item.quantity}`);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02); // 2% tax
    console.log(`💰 Total amount with tax: ₹${amount}`);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });
    console.log("✅ Stripe order created:", order._id);

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: { orderId: order._id.toString(), userId },
    });

    console.log("💳 Stripe session created:", session.id);
    res.status(201).json({ success: true, url: session.url });
  } catch (err) {
    console.error("❌ Error in placeOrderStripe:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------
// Stripe Webhook
// POST: /stripe
// ------------------------
export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      console.log("💰 Payment succeeded");

      try {
        const paymentIntent = event.data.object;

        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });
        const { orderId, userId } = sessionList.data[0]?.metadata || {};
        if (!orderId || !userId) return;

        const order = await Order.findByIdAndUpdate(orderId, { isPaid: true }, { new: true });
        await order.populate("items.product");

        const user = await User.findById(userId);

        const productHTML = generateOrderProductsHTML(order.items);

        console.log("📧 Sending payment confirmation emails...");

        await Promise.all([
          sendEmail({
            to: user.email,
            subject: `Order Paid Successfully - #${order._id}`,
            html: `<h3>Hi ${user.name}</h3>
                   <p>Your order <b>#${order._id}</b> has been paid successfully.</p>
                   ${productHTML}
                   <p>Payment Type: Online</p>`,
          }),
          sendEmail({
            to: adminEmail,
            subject: `New Online Order Paid - #${order._id}`,
            html: `<h3>New Online Order Paid</h3>
                   <p>Customer: ${user.name} (${user.email})</p>
                   <p>Order ID: ${order._id}</p>
                   ${productHTML}`,
          }),
        ]);

        console.log("✅ Emails sent successfully");

        // Clear user cart
        await User.findByIdAndUpdate(userId, { cartItems: {} });
        console.log("🧹 Cart cleared for user:", user.name);
      } catch (err) {
        console.error("❌ Error processing payment webhook:", err.message);
      }

      break;
    }

    case "payment_intent.payment_failed": {
      console.log("❌ Payment failed");

      const paymentIntent = event.data.object;
      const sessionList = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });
      const { orderId } = sessionList.data[0]?.metadata || {};
      if (orderId) {
        await Order.findByIdAndDelete(orderId);
        console.log("🗑 Deleted failed order:", orderId);
      }
      break;
    }

    default:
      console.log(`⚠️ Unhandled event type: ${event.type}`);
      break;
  }

  res.json({ received: true });
};


// ------------------------
// Get Orders by User
// POST: /api/order/user
// ------------------------


export const getUserOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 })
      .lean(); // 🔥 better performance than using _doc

    console.log(`📦 Fetched ${orders.length} orders for user ${userId}`);

    res.json({
      success: true,
      orders,
    });

  } catch (err) {
    console.error("❌ Error in getUserOrder:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("items.product")
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 }) // 👈 This ensures latest orders are first
      .lean();

    // console.log(`\n🚀 [SYSTEM] Processing ${orders.length} orders (Latest First)`);

    const enrichedOrders = await Promise.all(orders.map(async (order, idx) => {
      let finalAddress = null;

      // Handle Address Reference
      if (order.address && mongoose.Types.ObjectId.isValid(order.address)) {
        try {
          finalAddress = await address.findById(order.address);
        } catch (err) {
          finalAddress = null;
        }
      }

      if (!finalAddress) {
        finalAddress = {
          full: typeof order.address === 'string' ? order.address : "No address details",
          isLegacy: true
        };
      }

      // 🔍 FULL VS CODE CONSOLE LOGGING
      // console.log(`\n--- [ORDER #${idx + 1}] ---`);
      // console.log(`📅 Created At: ${order.createdAt}`);
      // console.log(`🆔 ID: ${order._id}`);
      // console.log(`👤 Customer: ${order.userId?.name || "N/A"}`);
      // console.log(`📧 Email: ${order.userId?.email || "N/A"}`);
      // console.log(`📞 User Phone: ${order.userId?.phone || "NOT FOUND"}`);
      // console.log(`🏠 Address Phone: ${finalAddress?.phone || "NOT FOUND"}`);
      // console.log(`📍 City: ${finalAddress?.city || "N/A"}`);

      const updatedItems = (order.items || []).map((item, i) => {
        const product = item.product;
        if (!product) return { ...item, name: "Product unavailable", finalPrice: 0 };

        // Calculation Logic
        const basePrice = product.offerPrice || 0;
        const couponDeduction = item.couponSelected
          ? Math.min(product.couponDiscount || 0, basePrice)
          : 0;
        const unitFinalPrice = basePrice - couponDeduction;
        const totalForLine = unitFinalPrice * item.quantity;

        // Log Item Details
        // console.log(`   📦 Item ${i + 1}: ${product.name}`);
        // console.log(`      - Qty: ${item.quantity}`);
        // console.log(`      - Base Price: ${basePrice}`);
        // console.log(`      - Discount: -${couponDeduction} ${item.couponSelected ? "(Coupon Applied)" : "(No Coupon)"}`);
        // console.log(`      - Final Unit Price: ${unitFinalPrice}`);
        // console.log(`      - Subtotal: ${totalForLine}`);

        return {
          ...item,
          name: product.name,
          image: product.image,
          finalPrice: unitFinalPrice,
          finalPriceTotal: totalForLine,
        };
      });

      const orderTotal = updatedItems.reduce((acc, i) => acc + (i.finalPriceTotal || 0), 0);
      const walletUsed = order.walletDeduction || 0;

      // console.log(`💰 ORDER TOTAL: ${orderTotal}`);
      // console.log(`👛 WALLET USED: ${walletUsed}`);
      // console.log(`💳 FINAL PAYABLE: ${orderTotal - walletUsed}`);
      // console.log(`📝 Status: ${order.status}`);
      // console.log(`--------------------------`);

      return {
        ...order,
        user: order.userId,
        address: finalAddress,
        items: updatedItems,
        amount: orderTotal,
      };
    }));

    res.json({ success: true, orders: enrichedOrders });

  } catch (err) {
    console.error("❌ Critical Error in getAllOrder:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "orderId and status are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid orderId" });
    }

    // Update the order
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("items.product").populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });

  } catch (err) {
    console.error("❌ updateOrderStatus error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};