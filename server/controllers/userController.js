// import User from '../models/User.js'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'

// // register user : /api/user/register
// export const register = async(req, res) => {
//     const {name, email, password} = req.body ;

//     if(!name || !email || !password){
//         return res.json({success: false, message:"Missing details"}) ;
//     }

//     try{
//         const existingUser = await User.findOne({email}) ;
//         if(existingUser){
//             return res.json({success: false, message: "User already exists."}) ;
//         }

//         const hashedPassword = await bcrypt.hash(password, 10) ;

//         const user = new User({name, email, password: hashedPassword}) ;
//         await user.save() ;

//         const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'}) ; 

//         res.cookie('token', token, {
//             httpOnly: true,    // prevent js to access cookie   
//             secure: process.env.NODE_ENV === 'production',  // use secure in production
//             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict' ,
//             maxAge: 7 * 24 * 60 * 60 * 1000  // Cookie expiration time
//         })

//         return res.json({success: true, user: {email: user.email, name: user.name}}) ;

//     }catch(error){
//         console.log(error.message) ;
//         return res.json({success: false, message: error.message}) ;
//     }
// }

// // login user : /api/user/login
// export const login = async(req, res) => {
//     const {email, password} = req.body ;

//     if(!email || !password){
//         return res.json({success: false, message:"Missing details"}) ;
//     }

//     try{
//         const user = await User.findOne({email}) ;
//         if(!user){
//             return res.json({success: false, message: "User not exists."}) ;
//         }

//         const isMatch = await bcrypt.compare(password, user.password);

//         if(!isMatch){
//             return res.json({success: false, message: "Enter correct password."}) ; 
//         }

//         const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'}) ; 

//         res.cookie('token', token, {
//             httpOnly: true,    // prevent js to access cookie   
//             secure: process.env.NODE_ENV === 'production',  // use secure in production
//             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict' ,
//             maxAge: 7 * 24 * 60 * 60 * 1000  // Cookie expiration time
//         })

//         return res.json({success: true, user: {email: user.email, name: user.name}}) ;

//     }catch(error){
//         console.log(error.message) ;
//         return res.json({success: false, message: error.message}) ;
//     }
// }

// // Check auth : /api/user/is-auth
// export const isAuth = async(req, res) => {
//     try{
//         const {userId} = req.body ;
//         const user = await User.findById(req.body.userId).select("-password") ;
//         res.json({ success: true, user});
//     }catch(error){
//         console.log(error.message) ;
//         return res.json({success: false, message: error.message}) ;
//     }
// }

// // logOut user : /api/user/logout
// export const logout = async(req, res) => {
//     try{    
//         res.clearCookie('token',{
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict' ,
//             maxAge: 7 * 24 * 60 * 60 * 1000
//         })

//         return res.json({success: true, message: "Logged Out"}) ;
//     }catch(err){
//         return res.json({success:false, message:err.message});
//     }
// }



import User from '../models/User.js'
import Product from '../models/product.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

/* ======================================================
   REGISTER USER : /api/user/register
   ====================================================== */

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing details" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,

            // 🎁 Welcome Bonus
            walletBalance: 5000,
            transactions: [
                {
                    amount: 5000,
                    type: "credit",
                    description: "Welcome Bonus"
                }
            ]
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                walletBalance: user.walletBalance
            }
        });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};


/* ======================================================
   LOGIN USER : /api/user/login
   ====================================================== */

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Missing details" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect password." });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                walletBalance: user.walletBalance
            }
        });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};


/* ======================================================
   CHECK AUTH : /api/user/is-auth
   ====================================================== */

export const isAuth = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId)
            .select("-password");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, user });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};


/* ======================================================
   LOGOUT USER : /api/user/logout
   ====================================================== */

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: "Logged Out Successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


/* ======================================================
   APPLY COUPON & DEDUCT WALLET (SAFE VERSION)
   ====================================================== */

export const applyCoupon = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const discountAmount = product.couponDiscount || 0;

        // ✅ Atomic Update (Prevents double deduction)
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, walletBalance: { $gte: discountAmount } },
            {
                $inc: { walletBalance: -discountAmount },
                $push: {
                    transactions: {
                        amount: discountAmount,
                        type: "debit",
                        description: `Coupon used for ${product.name}`
                    }
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.json({
                success: false,
                message: "Insufficient wallet balance"
            });
        }

        return res.json({
            success: true,
            walletBalance: updatedUser.walletBalance
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


/* ======================================================
   GET WALLET DETAILS
   ====================================================== */

export const getWallet = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId)
            .select("walletBalance transactions");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({
            success: true,
            walletBalance: user.walletBalance,
            transactions: user.transactions
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};