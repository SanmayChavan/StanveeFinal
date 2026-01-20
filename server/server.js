import cookieParser from 'cookie-parser';
import express, { application, json } from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

// app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// //Allow multiple origins
// const allowedOrigins = [
//     'http://localhost:5173', 
//     'https://stanveeproducts.vercel.app'

// ];
// // 'https://greencart-flax.vercel.app'

//Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors({
//     origin: allowedOrigins,
//     credentials: true,
// }));

// Allow multiple origins
const allowedOrigins = [
    'http://localhost:5173',
    // 'https://stanveeproducts.vercel.app'
];

// Optimized Middleware Configuration
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));




await connectDB();
await connectCloudinary();


app.get('/', (req, res) => {
    res.send("API is working");
})

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`)
})