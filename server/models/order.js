// // import mongoose from "mongoose";

// // const orderSchema = new mongoose.Schema({
// //     userId: {type: String, required:true, ref:'user'},
// //     items: [{
// //         product: {type: String, required:true, ref:'product'},
// //         quantity: {type: Number, required:true}
// //     }],
// //     amount: {type: Number, required:true},
// //     address: {type: String, required:true, ref: 'address'},
// //     status: {type: String, default:'Order Placed'},
// //     paymentType: {type: String, required:true},
// //     isPaid: {type: Boolean, required:true, default: false},

// // }, {timestamps: true})

// // const Order = mongoose.model.order || mongoose.model('order', orderSchema) ;
// // export default Order ;





// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   userId: { type: String, required: true, ref: "user" },
//   items: [
//     {
//       product: { type: String, required: true, ref: "product" },
//       quantity: { type: Number, required: true },
//       finalPrice: { type: Number, required: true }, // price after coupon
//     },
//   ],
//   totalAmount: { type: Number, required: true }, // sum of finalPrice * quantity
//   walletDeduction: { type: Number, default: 0 }, // amount deducted from wallet
//   address: { type: String, required: true, ref: "address" },
//   status: { type: String, default: "Order Placed" },
//   paymentType: { type: String, required: true },
//   isPaid: { type: Boolean, required: true, default: false },
// }, { timestamps: true });

// const Order = mongoose.models.order || mongoose.model("order", orderSchema);
// export default Order;


import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user", // lowercase
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "product", // lowercase (matches product model)
        },

        quantity: {
          type: Number,
          required: true,
        },

        finalPrice: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    walletDeduction: {
      type: Number,
      default: 0,
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "address", // lowercase
    },

    status: {
      type: String,
      enum: ["Pending", "Order Placed", "Shipped", "Delivered", "Cancelled"],
      default: "Order Placed"
    },

    paymentType: {
      type: String,
      required: true,
    },

    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;