import jwt from 'jsonwebtoken' ;

const authUser = async(req, res, next) => {
    const token = req.cookies.token ;
    console.log(token)

    if(!token){
        return res.json({success: false, message: "Not authorized. login again."}) ;
    }

    try{

        const token_decode = jwt.verify(token, process.env.JWT_SECRET) ;
        req.body.userId = token_decode.id ;
        next() ;

    }catch(err){    
        return res.json({success: false, message: err.message}) ;
    }
}

export default authUser ;






//  const isAuth = async (req, res) => {
//   console.log("========== IS AUTH CONTROLLER START ==========");
//   console.log("req.body:", req.body);   // should be undefined or {}
//   console.log("req.user:", req.user);   // MUST exist

//   try {
//     if (!req.user || !req.user.userId) {
//       console.log("❌ Authentication failed");
//       return res.status(401).json({
//         success: false,
//         message: "User not authenticated",
//       });
//     }

//     console.log("✅ Authentication success:", req.user.userId);

//     return res.status(200).json({
//       success: true,
//       userId: req.user.userId,
//     });
//   } catch (error) {
//     console.log("🔥 isAuth error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   } finally {
//     console.log("========== IS AUTH CONTROLLER END ==========\n");
//   }
// };

// export default isAuth