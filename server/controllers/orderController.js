// controllers/orderController.js
// import Product from "../models/product.js";
import Order from "../models/order.js";
import User from "../models/User.js";
import stripe from "stripe";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOrderProductsHTML } from "../utils/emailTemplates.js";
import Product from "../models/Product.js";


// Admin email
const adminEmail = "sanmaychavan22@gmail.com";



// export const placeOrderCOD = async (req, res) => {

//   try {
//     const { userId, items, address } = req.body;

//     if (!address || !items || items.length === 0) {
//       return res.status(400).json({ success: false, message: "Invalid data" });
//     }

//     // 1. Fetch all products and the user in PARALLEL
//     const productIds = items.map(item => item.product);
//     const [products, user] = await Promise.all([
//       Product.find({ _id: { $in: productIds } }),
//       User.findById(userId)
//     ]);

//     // 2. Map products for quick lookup to avoid O(n^2) complexity
//     const productMap = products.reduce((map, p) => {
//       map[p._id.toString()] = p;
//       return map;
//     }, {});

//     // 3. Calculate total amount locally (No DB hits here!)
//     let totalAmount = items.reduce((acc, item) => {
//       const product = productMap[item.product.toString()];
//       return acc + (product.offerPrice * item.quantity);
//     }, 0);

//     // Add 2% tax
//     totalAmount += Math.floor(totalAmount * 0.02);

//     // 4. Create the order
//     const order = await Order.create({
//       userId,
//       items,
//       amount: totalAmount,
//       address,
//       paymentType: "COD",
//     });

//     // 5. Populate and Send Emails (Non-blocking)
//     // We don't necessarily need to 'await' the emails before responding to the user
//     // if you want the UI to feel instant, but keeping it for reliability:
//     const populatedItems = items.map(item => ({
//       ...item,
//       product: productMap[item.product.toString()]
//     }));

//     const productHTML = generateOrderProductsHTML(populatedItems);

//     // Fire and forget (or await if you must)
//     Promise.all([
//       sendEmail({
//         to: user.email,
//         subject: `Order Confirmed - #${order._id}`,
//         html: `<h3>Hi ${user.name}</h3><p>Order #${order._id} placed.</p>${productHTML}`,
//       }),
//       sendEmail({
//         to: adminEmail,
//         subject: `New COD Order - #${order._id}`,
//         html: `<p>Customer: ${user.name}</p>${productHTML}`,
//       })
//     ]).catch(err => console.error("Email failed:", err));

//     // 6. Respond immediately
//     res.status(201).json({ success: true, message: "Order placed successfully", order });

//   } catch (err) {
//     console.error("❌ Error:", err.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };






// export const placeOrderCOD = async (req, res) => {
//   try {
//     const { userId, items, address } = req.body;

//     if (!address || !items || items.length === 0) {
//       return res.status(400).json({ success: false, message: "Invalid data" });
//     }

//     const [user, products] = await Promise.all([
//       User.findById(userId),
//       Product.find({ _id: { $in: items.map(i => i.product) } })
//     ]);

//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     const productMap = products.reduce((map, p) => {
//       map[p._id.toString()] = p;
//       return map;
//     }, {});

//     let totalAmount = 0;
//     let totalWalletDeduction = 0;

//     // Build order items with finalPrice and discount info
//     const orderItems = items.map(item => {
//       const product = productMap[item.product.toString()];
//       if (!product) throw new Error(`Product ${item.product} not found`);

//       let finalPrice = product.offerPrice;
//       let walletDeduction = 0;

//       if (item.couponSelected && product.couponDiscount) {
//         walletDeduction = Math.min(product.couponDiscount, user.walletBalance);
//         finalPrice -= walletDeduction;

//         // Deduct wallet
//         user.walletBalance -= walletDeduction;
//         totalWalletDeduction += walletDeduction;

//         user.transactions.push({
//           amount: walletDeduction,
//           type: "debit",
//           description: `Coupon applied on ${product.name}`
//         });
//       }

//       totalAmount += finalPrice * item.quantity;

//       return {
//         product: item.product,
//         quantity: item.quantity,
//         finalPrice,
//         couponSelected: item.couponSelected || false,
//         couponDiscount: walletDeduction
//       };
//     });

//     await user.save();

//     // Create order
//     const order = await Order.create({
//       userId,
//       items: orderItems,
//       totalAmount,
//       walletDeduction: totalWalletDeduction,
//       address,
//       paymentType: "COD"
//     });

//     const productHTML = generateOrderProductsHTML(
//       orderItems.map(i => ({ ...i, product: productMap[i.product.toString()] }))
//     );

//     // Send emails (fire & forget)
//     Promise.all([
//       sendEmail({
//         to: user.email,
//         subject: `Order Confirmed - #${order._id}`,
//         html: `<h3>Hi ${user.name}</h3><p>Order #${order._id} placed.</p>${productHTML}`,
//       }),
//       sendEmail({
//         to: adminEmail,
//         subject: `New COD Order - #${order._id}`,
//         html: `<p>Customer: ${user.name}</p>${productHTML}`,
//       })
//     ]).catch(err => console.error("Email failed:", err));

//     res.status(201).json({ success: true, message: "Order placed successfully", order });

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

    // Fetch user and products
    const [user, products] = await Promise.all([
      User.findById(userId),
      Product.find({ _id: { $in: items.map(i => i.product) } })
    ]);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Map products by ID for easy lookup
    const productMap = products.reduce((map, p) => {
      map[p._id.toString()] = p;
      return map;
    }, {});

    let totalAmount = 0;
    let totalWalletDeduction = 0;

    // Build order items
    const orderItems = items.map(item => {
      const product = productMap[item.product.toString()];
      if (!product) throw new Error(`Product ${item.product} not found`);

      // Start with offer price
      let finalPricePerUnit = product.offerPrice;
      let walletDeductionPerUnit = 0;

      // Apply coupon if selected and wallet has balance
      if (item.couponSelected && product.couponDiscount) {
        walletDeductionPerUnit = Math.min(product.couponDiscount, user.walletBalance);
        finalPricePerUnit -= walletDeductionPerUnit;

        // Deduct from wallet per unit
        const totalDeduction = walletDeductionPerUnit * item.quantity;
        user.walletBalance -= totalDeduction;
        totalWalletDeduction += totalDeduction;

        // Record transaction for this item
        user.transactions.push({
          amount: totalDeduction,
          type: "debit",
          description: `Coupon applied on ${product.name} × ${item.quantity}`
        });
      }

      const finalPriceTotal = finalPricePerUnit * item.quantity;
      totalAmount += finalPriceTotal;

      return {
        product: item.product,
        quantity: item.quantity,
        finalPrice: finalPricePerUnit, // price per unit
        finalPriceTotal,               // total for this item
        couponSelected: item.couponSelected || false,
        couponDiscount: walletDeductionPerUnit
      };
    });

    // Save user wallet and transaction updates
    await user.save();

    // Create order
    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      walletDeduction: totalWalletDeduction,
      address,
      paymentType: "COD",
      status: "Order Placed"
    });

    // Generate email HTML
    const productHTML = generateOrderProductsHTML(
      orderItems.map(i => ({ ...i, product: productMap[i.product.toString()] }))
    );

    // Send emails (non-blocking)
    Promise.all([
      sendEmail({
        to: user.email,
        subject: `Order Confirmed - #${order._id}`,
        html: `<h3>Hi ${user.name}</h3><p>Order #${order._id} placed successfully.</p>${productHTML}`,
      }),
      sendEmail({
        to: adminEmail,
        subject: `New COD Order - #${order._id}`,
        html: `<p>Customer: ${user.name}</p>${productHTML}`,
      })
    ]).catch(err => console.error("Email failed:", err));

    // ✅ Send response with updated wallet balance
    res.status(201).json({
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



// export const placeOrderStripe = async (req, res) => {
//   try {
//     const { userId, items, address } = req.body;
//     const { origin } = req.headers;
//     if (!address || !items || items.length === 0)
//       return res.status(400).json({ success: false, message: "Invalid data" });

//     const user = await User.findById(userId);
//     const products = await Product.find({ _id: { $in: items.map(i => i.product) } });
//     const productMap = products.reduce((map, p) => { map[p._id.toString()] = p; return map; }, {});

//     let totalAmount = 0;
//     const orderItems = items.map(item => {
//       const product = productMap[item.product.toString()];
//       const coupon = item.couponDiscount || 0;
//       const finalPrice = product.offerPrice - coupon;
//       totalAmount += finalPrice * item.quantity;
//       return { product: product._id, quantity: item.quantity, finalPrice };
//     });

//     totalAmount += Math.floor(totalAmount * 0.02);

//     const order = await Order.create({
//       userId,
//       items: orderItems,
//       amount: totalAmount,
//       address,
//       paymentType: "Online",
//       isPaid: false
//     });

//     const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
//     const line_items = orderItems.map(i => {
//       const product = productMap[i.product.toString()];
//       return {
//         price_data: {
//           currency: "usd",
//           product_data: { name: product.name },
//           unit_amount: i.finalPrice * 100
//         },
//         quantity: i.quantity
//       };
//     });

//     const session = await stripeInstance.checkout.sessions.create({
//       line_items,
//       mode: "payment",
//       success_url: `${origin}/loader?next=my-orders`,
//       cancel_url: `${origin}/cart`,
//       metadata: { orderId: order._id.toString(), userId },
//     });

//     res.status(201).json({ success: true, url: session.url });
//   } catch (err) {
//     console.error("❌ Stripe Order Error:", err.message);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// ------------------------
// Place Order - Stripe (Online)
// POST: /api/order/stripe
// ------------------------
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
// export const getUserOrder = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     const orders = await Order.find({ userId, $or: [{ paymentType: "COD" }, { isPaid: true }] })
//       .populate("items.product address")
//       .sort({ createdAt: -1 });

//     // No need to recalc discounts, use stored finalPrice
//     const ordersWithTotal = orders.map(order => {
//       const updatedItems = order.items.map(item => ({
//         ...item._doc,
//         totalPrice: item.finalPrice * item.quantity
//       }));

//       const totalAmount = updatedItems.reduce((acc, i) => acc + i.totalPrice, 0);

//       return { ...order._doc, items: updatedItems, totalAmount };
//     });

//     console.log(`📦 Fetched ${orders.length} orders for user ${userId}`);
//     res.json({ success: true, orders: ordersWithTotal });

//   } catch (err) {
//     console.error("❌ Error in getUserOrder:", err.message);
//     res.json({ success: false, message: err.message });
//   }
// };


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

// ------------------------
// Get All Orders (Admin/Seller)
// POST: /api/order/seller
// ------------------------
// export const getAllOrder = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       $or: [{ paymentType: "COD" }, { isPaid: true }],
//     })
//       .populate("items.product address")
//       .sort({ createdAt: -1 });

//     // Compute finalPrice per item dynamically
//     const ordersWithFinalPrice = orders.map(order => {
//       const updatedItems = order.items.map(item => {
//         let price = item.product.offerPrice;

//         if (item.couponSelected) {
//           price -= item.product.couponDiscount || 0;
//         }

//         const finalPrice = price * item.quantity;

//         return { ...item._doc, finalPrice };
//       });

//       const totalAmount = updatedItems.reduce((acc, i) => acc + i.finalPrice, 0);

//       return { ...order._doc, items: updatedItems, amount: totalAmount };
//     });

//     console.log(`📦 Fetched all orders: ${orders.length}`);
//     res.json({ success: true, orders: ordersWithFinalPrice });
//   } catch (err) {
//     console.error("❌ Error in getAllOrder:", err.message);
//     res.json({ success: false, message: err.message });
//   }
// };


// export const getAllOrder = async (req, res) => {
//   try {
//     const orders = await Order.find({
//       $or: [{ paymentType: "COD" }, { isPaid: true }],
//     })
//       .populate("items.product address")
//       .sort({ createdAt: -1 });

//     const enrichedOrders = orders.map(order => {
//       const updatedItems = order.items.map(item => {
//         const product = item.product;

//         if (!product) {
//           return {
//             ...item._doc,
//             finalPrice: 0,
//             name: "Product unavailable",
//             couponSelected: item.couponSelected || false,
//             couponDiscount: item.couponDiscount || 0
//           };
//         }

//         const finalPrice = (product.offerPrice - (item.couponSelected ? product.couponDiscount : 0)) * item.quantity;

//         return {
//           ...item._doc,
//           finalPrice,
//           name: product.name,
//           category: product.category,
//           image: product.image,
//           offerPrice: product.offerPrice,
//           couponDiscount: item.couponSelected ? product.couponDiscount : 0
//         };
//       });

//       const totalAmount = updatedItems.reduce((acc, i) => acc + i.finalPrice, 0);

//       return {
//         _id: order._id,
//         userId: order.userId,
//         items: updatedItems,
//         amount: totalAmount,
//         walletDeduction: order.walletDeduction,
//         address: order.address,
//         status: order.status,
//         paymentType: order.paymentType,
//         isPaid: order.isPaid,
//         createdAt: order.createdAt,
//         updatedAt: order.updatedAt,
//       };
//     });

//     res.json({ success: true, orders: enrichedOrders });
//   } catch (err) {
//     console.error("❌ Error in getAllOrder:", err.message);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const getAllOrder = async (req, res) => {
//   try {
//     // Fetch all orders (COD or paid)
//     const orders = await Order.find({
//       $or: [{ paymentType: "COD" }, { isPaid: true }],
//     })
//       .populate("items.product") // only populate products (not address)
//       .sort({ createdAt: -1 });

//     // Map each order to include enriched info
//     const enrichedOrders = orders.map(order => {
//       const updatedItems = order.items.map(item => {
//         const product = item.product;

//         if (!product) {
//           return {
//             ...item._doc,
//             finalPrice: 0,
//             name: "Product unavailable",
//             couponSelected: item.couponSelected || false,
//             couponDiscount: item.couponDiscount || 0,
//           };
//         }

//         // Calculate final price per item (quantity included)
//         const finalPrice = (product.offerPrice - (item.couponSelected ? item.couponDiscount : 0)) * item.quantity;

//         return {
//           ...item._doc,
//           finalPrice,
//           name: product.name,
//           category: product.category,
//           image: product.image,
//           offerPrice: product.offerPrice,
//           couponDiscount: item.couponSelected ? product.couponDiscount : 0,
//         };
//       });

//       // Total amount for this order
//       const totalAmount = updatedItems.reduce((acc, i) => acc + i.finalPrice, 0);

//       return {
//         _id: order._id,
//         userId: order.userId,
//         items: updatedItems,
//         amount: totalAmount,
//         walletDeduction: order.walletDeduction || 0,
//         address: order.address, // plain object, no populate
//         status: order.status,
//         paymentType: order.paymentType,
//         isPaid: order.isPaid,
//         createdAt: order.createdAt,
//         updatedAt: order.updatedAt,
//       };
//     });

//     res.json({ success: true, orders: enrichedOrders });

//   } catch (err) {
//     console.error("❌ Error in getAllOrder:", err.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };






// export const getAllOrder = async (req, res) => {

//   try {
//     const orders = await Order.find({
//       $or: [{ paymentType: "COD" }, { isPaid: true }],
//     })
//       .populate("items.product")
//       .populate("userId", "name email phone")
//       // Only populate address if it's a valid ObjectId
//       .sort({ createdAt: -1 })
//       .lean();

//     const enrichedOrders = orders.map((order) => {
//       // Handle address: if it's a string, use as-is
//       const address =
//         typeof order.address === "string" ? { full: order.address } : order.address;

//       const updatedItems = order.items.map((item) => {
//         const product = item.product;

//         if (!product) {
//           return {
//             ...item,
//             finalPrice: 0,
//             finalPriceTotal: 0,
//             name: "Product unavailable",
//             category: null,
//             image: [],
//             couponSelected: item.couponSelected || false,
//             couponDiscount: item.couponDiscount || 0,
//           };
//         }

//         const couponDeduction = item.couponSelected
//           ? Math.min(product.couponDiscount || 0, product.offerPrice)
//           : 0;
//         const finalPrice = product.offerPrice - couponDeduction;

//         return {
//           ...item,
//           finalPrice,
//           finalPriceTotal: finalPrice * item.quantity,
//           name: product.name,
//           category: product.category,
//           image: product.image,
//           offerPrice: product.offerPrice,
//           couponDiscount: couponDeduction,
//         };
//       });

//       const totalAmount = updatedItems.reduce((acc, i) => acc + i.finalPriceTotal, 0);

//       return {
//         _id: order._id,
//         user: order.userId,
//         items: updatedItems,
//         amount: totalAmount,
//         walletDeduction: order.walletDeduction || 0,
//         address, // safe
//         status: order.status,
//         paymentType: order.paymentType,
//         isPaid: order.isPaid,
//         createdAt: order.createdAt,
//         updatedAt: order.updatedAt,
//       };
//     });

//     res.json({ success: true, orders: enrichedOrders });
//   } catch (err) {
//     console.error("❌ Error in getAllOrder:", err.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };




// export const getAllOrder = async (req, res) => {

//   try {
//     // Fetch all orders, sorted by newest first
//     const orders = await Order.find({})
//       .populate("items.product")           // Populate product details
//       .populate("userId", "name email phone") // Populate user info
//       .populate("address")                 // Populate address if it's an ObjectId
//       .sort({ createdAt: -1 })
//       .lean();

//     // Enrich items and safely handle address
//     const enrichedOrders = orders.map((order) => {
//       const address =
//         typeof order.address === "string" ? { full: order.address } : order.address;

//       const updatedItems = order.items.map((item) => {
//         const product = item.product;

//         if (!product) {
//           return {
//             ...item,
//             finalPrice: 0,
//             finalPriceTotal: 0,
//             name: "Product unavailable",
//             category: null,
//             image: [],
//             couponSelected: item.couponSelected || false,
//             couponDiscount: item.couponDiscount || 0,
//           };
//         }

//         const couponDeduction = item.couponSelected
//           ? Math.min(product.couponDiscount || 0, product.offerPrice)
//           : 0;
//         const finalPrice = product.offerPrice - couponDeduction;

//         return {
//           ...item,
//           finalPrice,
//           finalPriceTotal: finalPrice * item.quantity,
//           name: product.name,
//           category: product.category,
//           image: product.image,
//           offerPrice: product.offerPrice,
//           couponDiscount: couponDeduction,
//         };
//       });

//       const totalAmount = updatedItems.reduce((acc, i) => acc + i.finalPriceTotal, 0);

//       return {
//         _id: order._id,
//         user: order.userId,
//         items: updatedItems,
//         amount: totalAmount,
//         walletDeduction: order.walletDeduction || 0,
//         address,
//         status: order.status,
//         paymentType: order.paymentType,
//         isPaid: order.isPaid,
//         createdAt: order.createdAt,
//         updatedAt: order.updatedAt,
//       };
//     });

//     res.json({ success: true, orders: enrichedOrders });
//   } catch (err) {
//     console.error("❌ Error in getAllOrder:", err.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };





import mongoose from "mongoose";


import address from "../models/adress.js";

// export const getAllOrder = async (req, res) => {

//   try {
//     // 1. Fetch orders WITHOUT populating address yet
//     const orders = await Order.find({})
//       .populate("items.product")
//       .populate("userId", "name email phone")
//       .sort({ createdAt: -1 })
//       .lean();

//     // 2. Process each order manually
//     const enrichedOrders = await Promise.all(orders.map(async (order) => {
//       let finalAddress = null;

//       // Check if the address field looks like a MongoDB ObjectId
//       if (order.address && mongoose.Types.ObjectId.isValid(order.address)) {
//         try {
//           // Attempt to find the document in the Address collection
//           finalAddress = await address.findById(order.address);
//         } catch (err) {
//           finalAddress = null;
//         }
//       }

//       // If no document was found, or if it was a string like "Mumbai, India"
//       if (!finalAddress) {
//         finalAddress = { 
//           full: typeof order.address === 'string' ? order.address : "No address details",
//           isLegacy: true 
//         };
//       }

//       // 3. Map Items and calculate totals
//       const updatedItems = (order.items || []).map((item) => {
//         const product = item.product;
//         if (!product) {
//           return { ...item, name: "Product unavailable", finalPrice: 0 };
//         }

//         const couponDeduction = item.couponSelected
//           ? Math.min(product.couponDiscount || 0, product.offerPrice)
//           : 0;
//         const finalPrice = (product.offerPrice || 0) - couponDeduction;

//         return {
//           ...item,
//           name: product.name,
//           image: product.image,
//           finalPrice,
//           finalPriceTotal: finalPrice * item.quantity,
//         };
//       });

//       const totalAmount = updatedItems.reduce((acc, i) => acc + (i.finalPriceTotal || 0), 0);

//       return {
//         ...order,
//         user: order.userId, // Matches your frontend 'user' expectation
//         address: finalAddress,
//         items: updatedItems,
//         amount: totalAmount,
//       };
//     }));

//     console.log(`✅ Returning ${enrichedOrders.length} orders successfully.`);
//     res.json({ success: true, orders: enrichedOrders });

//   } catch (err) {
//     console.error("❌ Critical Error in getAllOrder:", err.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


// export const getAllOrder = async (req, res) => {
//   try {
//     const orders = await Order.find({})
//       .populate("items.product")
//       .populate("userId", "name email phone")
//       .sort({ createdAt: -1 })
//       .lean();

//     const enrichedOrders = await Promise.all(orders.map(async (order) => {
//       let finalAddress = null;

//       if (order.address && mongoose.Types.ObjectId.isValid(order.address)) {
//         try {
//           finalAddress = await address.findById(order.address);
//         } catch (err) {
//           finalAddress = null;
//         }
//       }

//       if (!finalAddress) {
//         finalAddress = { 
//           full: typeof order.address === 'string' ? order.address : "No address details",
//           isLegacy: true 
//         };
//       }

//       // 🔍 VS CODE LOGGING START
//       console.log("--- Order Debug Info ---");
//       console.log(`Order ID: ${order._id}`);
//       console.log(`User Name: ${order.userId?.name}`);
//       console.log(`User Phone (from userId): ${order.userId?.phone || "NOT FOUND"}`);

//       if (finalAddress.isLegacy) {
//         console.log(`Address: Legacy String -> ${finalAddress.full}`);
//       } else {
//         console.log(`Address Phone: ${finalAddress.phone || "NOT FOUND IN ADDRESS"}`);
//         console.log(`Address City: ${finalAddress.city}`);
//       }
//       console.log("------------------------");
//       // 🔍 VS CODE LOGGING END

//       const updatedItems = (order.items || []).map((item) => {
//         const product = item.product;
//         if (!product) return { ...item, name: "Product unavailable", finalPrice: 0 };

//         const couponDeduction = item.couponSelected
//           ? Math.min(product.couponDiscount || 0, product.offerPrice)
//           : 0;
//         const finalPrice = (product.offerPrice || 0) - couponDeduction;

//         return {
//           ...item,
//           name: product.name,
//           image: product.image,
//           finalPrice,
//           finalPriceTotal: finalPrice * item.quantity,
//         };
//       });

//       const totalAmount = updatedItems.reduce((acc, i) => acc + (i.finalPriceTotal || 0), 0);

//       return {
//         ...order,
//         user: order.userId,
//         address: finalAddress,
//         items: updatedItems,
//         amount: totalAmount,
//       };
//     }));

//     res.json({ success: true, orders: enrichedOrders });

//   } catch (err) {
//     console.error("❌ Critical Error in getAllOrder:", err.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


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