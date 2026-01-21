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








export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    // ✅ Validate request data
    if (!userId || !address || !items || items.length === 0) {
      console.log("❌ Invalid data for COD order");
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    // ✅ Fetch all products in one query
    const productIds = items.map(i => i.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({ success: false, message: "Some products not found" });
    }

    // ✅ Calculate total amount
    let amount = 0;
    items.forEach(item => {
      const product = products.find(p => p._id.toString() === item.product);
      if (product) {
        amount += product.offerPrice * item.quantity;
      }
    });

    // Add 2% tax
    amount += Math.floor(amount * 0.02);

    console.log(`💰 Total COD amount with tax: ₹${amount}`);

    // ✅ Create order
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    console.log("✅ COD order created:", order._id);

    // ✅ Respond immediately to frontend
    res.status(201).json({ success: true, message: "Order placed successfully", order });

    // ✅ Populate products for email (async, no await)
    order.populate("items.product").then(async (populatedOrder) => {
      try {
        const user = await User.findById(userId);
        const productHTML = generateOrderProductsHTML(populatedOrder.items);

        // Send emails asynchronously
        // await Promise.all([
        //   // Email to user
        //   sendEmail({
        //     to: user.email,
        //     subject: `Order Confirmed - #${order._id}`,
        //     html: `<h3>Hi ${user.name}</h3>
        //            <p>Your order <b>#${order._id}</b> has been placed successfully.</p>
        //            ${productHTML}
        //            <p>Payment Type: COD</p>`,
        //   }),
        //   // Email to admin
        //   sendEmail({
        //     to: adminEmail,
        //     subject: `New COD Order Received - #${order._id}`,
        //     html: `<h3>New COD Order Received</h3>
        //            <p>Customer: ${user.name} (${user.email})</p>
        //            <p>Order ID: ${order._id}</p>
        //            ${productHTML}`,
        //   }),
        // ]);

        console.log("✅ Emails sent successfully");
      } catch (err) {
        console.error("❌ Error sending emails:", err.message);
      }
    });

  } catch (err) {
    console.error("❌ Error in placeOrderCOD:", err.message);
    res.status(500).json({ success: false, message: err.message });
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
