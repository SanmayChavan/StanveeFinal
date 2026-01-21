// import jwt from 'jsonwebtoken' ;

// const authUser = async(req, res, next) => {
//     const token = req.cookies.token ;
//     console.log(token)

//     if(!token){
//         return res.json({success: false, message: "Not authorized. login again."}) ;
//     }

//     try{

//         const token_decode = jwt.verify(token, process.env.JWT_SECRET) ;
//         req.body.userId = token_decode.id ;
//         next() ;

//     }catch(err){    
//         return res.json({success: false, message: err.message}) ;
//     }
// }

// export default authUser ;



import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  console.log("========== AUTH USER MIDDLEWARE START ==========");

  try {
    console.log("1️⃣ Request method:", req.method);
    console.log("2️⃣ Request URL:", req.originalUrl);

    console.log("3️⃣ Cookies received:", req.cookies);
    console.log("4️⃣ Authorization header:", req.headers.authorization);

    let token;

    // 5️⃣ Get token from cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log("✅ Token found in cookies");
    }
    // 6️⃣ Get token from Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("✅ Token found in Authorization header");
    }

    console.log("7️⃣ Token value:", token);

    // 8️⃣ If no token
    if (!token) {
      console.log("❌ No token found → Unauthorized");
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login again.",
      });
    }

    // 9️⃣ Verify JWT
    console.log("9️⃣ Verifying token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified successfully:", decoded);

    // 🔟 Attach user to request (IMPORTANT)
    console.log("🔟 Attaching user to req.user");
    req.user = {
      userId: decoded.id,
    };
    console.log("✅ req.user set:", req.user);

    console.log("➡️ authUser middleware completed, calling next()");
    console.log("========== AUTH USER MIDDLEWARE END ==========\n");

    next();
  } catch (error) {
    console.log("🔥 AUTH USER ERROR:", error.message);
    console.log("========== AUTH USER MIDDLEWARE FAILED ==========\n");

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authUser;
