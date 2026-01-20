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
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

/**
 * COOKIE CONFIGURATION
 * For Vercel-to-Vercel (Cross-Domain):
 * 1. sameSite: 'none' is MANDATORY.
 * 2. secure: true is MANDATORY (requires HTTPS, which Vercel provides).
 * 3. httpOnly: true prevents XSS attacks.
 */
const cookieOptions = {
    httpOnly: true,
    secure: true, 
    sameSite: 'none', 
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    path: '/'
};

// register user : /api/user/register
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

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, cookieOptions);

        return res.json({ 
            success: true, 
            user: { 
                _id: user._id, 
                email: user.email, 
                name: user.name, 
                cartItems: user.cartItems || {} 
            } 
        });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// login user : /api/user/login
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
            return res.json({ success: false, message: "Enter correct password." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, cookieOptions);

        return res.json({ 
            success: true, 
            user: { 
                _id: user._id, 
                email: user.email, 
                name: user.name, 
                cartItems: user.cartItems || {} 
            } 
        });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// Check auth : /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        const { userId } = req.body; // Passed from your auth middleware

        if (!userId) {
            return res.json({ success: false, message: "Not Authorized" });
        }

        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// logOut user : /api/user/logout
export const logout = async (req, res) => {
    try {
        // We use the exact same flags (none/secure) that we used to set the cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,      // Must be true for SameSite: none
            sameSite: 'none',  // Must match the login cookie exactly
            path: '/'          // Ensure it clears for the whole app
        });

        return res.json({ success: true, message: "Logged Out" });
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
}