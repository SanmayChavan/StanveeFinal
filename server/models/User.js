// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//     name:{
//         type: String,
//         required : true
//     },
//     email:{
//         type: String,
//         required: true,
//         unique: true
//     },
//     password:{
//         type: String,
//         required : true
//     },
//     cartItems:{
//         type: Object,
//         default: {}
//     }
// }, {minimize: false})

// const User = mongoose.models.user || mongoose.model('user', UserSchema) ;
// export default User ;


import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartItems: { type: Object, default: {} },

    // 💰 Wallet
    walletBalance: { type: Number, default: 0 },
    transactions: [
        {
            amount: { type: Number, required: true },
            type: { type: String, required: true }, // 'credit' or 'debit'
            description: { type: String, required: true },
            date: { type: Date, default: Date.now }
        }
    ]
}, { minimize: false });

const User = mongoose.models.user || mongoose.model('user', UserSchema);
export default User;