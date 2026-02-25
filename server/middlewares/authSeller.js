// import jwt from 'jsonwebtoken' ;

// const authSeller = async(req,res, next) => {
//     const { token } = req.cookies ;

//     if(!token){
//         return res.json({success: false, message: "User Not Authorized."}) ;
//     }

//     try{
//         const tokenDecode = jwt.verify(token, process.env.JWT_SECRET) ;
//         if(tokenDecode.email === process.env.SELLER_EMAIL){
//             next() ;
//         }else{
//             return res.json({success: false, message: "Not Authorized."}) ;
//         }

//     }catch(err){    
//         return res.json({success: false, message: err.message}) ;
//     }
// }

// export default authSeller ;



// const authSeller = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized - No token"
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (decoded.email !== process.env.SELLER_EMAIL) {
//       return res.status(403).json({
//         success: false,
//         message: "Forbidden"
//       });
//     }

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid Token"
//     });
//   }
// };
import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.SELLER_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Not Seller",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

export default authSeller;