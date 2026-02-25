// import jwt from "jsonwebtoken";

// // Login Seller : /api/seller/login
// export const sellerLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (
//       email === process.env.SELLER_EMAIL &&
//       password === process.env.SELLER_PASSWORD
//     ) {
//       const token = jwt.sign({ email }, process.env.JWT_SECRET, {
//         expiresIn: "7d",
//       });

//       res.cookie("token", token, {
//         httpOnly: true, // prevent js to access cookie
//         secure: process.env.NODE_ENV === "production", // use secure in production
//         sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
//       });

//       return res.json({ success: true, message: "Logged In", token });
//     } else {
//       return res.json({ success: false, message: "Invalid Credentials" });
//     }
//   } catch (err) {
//      res.json({success: false, message: err.message}) ;
//   }
// };


// // Seller auth : /api/seller/is-auth
// export const isSellerAuth = async(req, res) => {
//     try{
//         return res.json({success:true}) ;
//     }catch(error){
//         console.log(error.message) ;
//         return res.json({success: false, message: error.message}) ;
//     }
// }

// // Seller logOut user : /api/seller/logout
// export const sellerLogout = async(req, res) => {
//     try{    
//         res.clearCookie('sellerToken',{
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


import jwt from "jsonwebtoken";

// Login Seller : /api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.SELLER_EMAIL &&
      password === process.env.SELLER_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: "Logged In",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Seller auth check
export const isSellerAuth = async (req, res) => {
  return res.json({ success: true });
};

// Logout Seller
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({
      success: true,
      message: "Logged Out",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};