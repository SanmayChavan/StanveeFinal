// controllers/orderController.js
import Product from "../models/product.js";
import Order from "../models/order.js";
import User from "../models/User.js";
import stripe from "stripe";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOrderProductsHTML } from "../utils/emailTemplates.js";

// Admin email
const adminEmail = "sanmaychavan22@gmail.com";

// ------------------------
// Place Order - COD
// POST: /api/order/COD
// ------------------------
// export const placeOrderCOD = async (req, res) => {
//   try {
//     const { userId, items, address } = req.body;
//     if (!address || !items || items.length === 0) {
//       console.log("❌ Invalid data for COD order");
//       return res.json({ success: false, message: "Invalid data" });
//     }

//     // Calculate total amount
//     let amount = await items.reduce(async (acc, item) => {
//       const product = await Product.findById(item.product);
//       console.log(`📦 Adding product ${product.name} x ${item.quantity} = ${product.offerPrice * item.quantity}`);
//       return (await acc) + product.offerPrice * item.quantity;
//     }, 0);

//     // Add 2% tax
//     amount += Math.floor(amount * 0.02);
//     console.log(`💰 Total amount with tax: ₹${amount}`);

//     // Create order
//     const order = await Order.create({
//       userId,
//       items,
//       amount,
//       address,
//       paymentType: "COD",
//     });
//     console.log("✅ COD order created:", order._id);

//     // Populate products for email
//     await order.populate("items.product");

//     // Get user info
//     const user = await User.findById(userId);

//     // Generate product HTML
//     const productHTML = generateOrderProductsHTML(order.items);

//     console.log("📧 Sending emails to user and admin...");
//     await Promise.all([
//       // User email
//       sendEmail({
//         to: user.email,
//         subject: `Order Confirmed - #${order._id}`,
//         html: `<h3>Hi ${user.name}</h3>
//                <p>Your order <b>#${order._id}</b> has been placed successfully.</p>
//                ${productHTML}
//                <p>Payment Type: COD</p>`,
//       }),

//       // Admin email
//       sendEmail({
//         to: adminEmail,
//         subject: `New COD Order Received - #${order._id}`,
//         html: `<h3>New COD Order Received</h3>
//                <p>Customer: ${user.name} (${user.email})</p>
//                <p>Order ID: ${order._id}</p>
//                ${productHTML}`,
//       }),
//     ]);
//     console.log("✅ Emails sent successfully");

//     res.status(201).json({ success: true, message: "Order placed successfully", order });
//   } catch (err) {
//     console.error("❌ Error in placeOrderCOD:", err.message);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


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

export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    // 1. Fetch products & user in parallel
    const productIds = items.map(item => item.product);
    const [products, user] = await Promise.all([
      Product.find({ _id: { $in: productIds } }),
      User.findById(userId)
    ]);

    // 2. Map products
    const productMap = products.reduce((map, p) => {
      map[p._id.toString()] = p;
      return map;
    }, {});

    // 3. Calculate total
    let totalAmount = items.reduce((acc, item) => {
      const product = productMap[item.product.toString()];
      return acc + (product.offerPrice * item.quantity);
    }, 0);

    totalAmount += Math.floor(totalAmount * 0.02);

    // 4. Create order
    const order = await Order.create({
      userId,
      items,
      amount: totalAmount,
      address,
      paymentType: "COD",
    });

    // 5. Prepare email HTML
    const populatedItems = items.map(item => ({
      ...item,
      product: productMap[item.product.toString()]
    }));

    const productHTML = generateOrderProductsHTML(populatedItems);

    // ✅ 6. SEND EMAILS (AWAITED — RENDER SAFE)
    try {
      await Promise.all([
        sendEmail({
          to: user.email,
          subject: `Order Confirmed - #${order._id}`,
          html: `<h3>Hi ${user.name}</h3><p>Your order has been placed.</p>${productHTML}`,
        }),
        sendEmail({
          to: adminEmail,
          subject: `New COD Order - #${order._id}`,
          html: `<p>Customer: ${user.name}</p>${productHTML}`,
        })
      ]);
    } catch (emailErr) {
      console.error("❌ Email failed:");
      console.error(emailErr);
      // ❗ We do NOT fail the order if email fails
    }

    // 7. Respond after email completes
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    });

  } catch (err) {
    console.error("❌ Order Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



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
// GET: /api/order/user
// ------------------------
export const getUserOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    console.log(`📦 Fetched ${orders.length} orders for user ${userId}`);
    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Error in getUserOrder:", err.message);
    res.json({ success: false, message: err.message });
  }
};

// ------------------------
// Get All Orders (Admin/Seller)
// GET: /api/order/seller
// ------------------------
export const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    console.log(`📦 Fetched all orders: ${orders.length}`);
    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Error in getAllOrder:", err.message);
    res.json({ success: false, message: err.message });
  }
};
