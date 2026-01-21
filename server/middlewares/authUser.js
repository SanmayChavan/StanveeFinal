// import jwt from 'jsonwebtoken' ;

// const authUser = async(req, res, next) => {
//     const token = req.cookies.token ;
//     console.log(" from user.js TOKEN -> " ,token)

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





import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const token = req.cookies.token;
    console.log("TOKEN ->", token);

    if (!token) {
        return res.json({ success: false, message: "Not authorized. Login again." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure req.body exists
        if (!req.body) req.body = {};

        // Attach userId to req.body (controller relies on this)
        req.body.userId = decoded.id;

        next();
    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

export default authUser;
