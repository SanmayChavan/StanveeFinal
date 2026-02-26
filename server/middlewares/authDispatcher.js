import jwt from "jsonwebtoken";

const authDispatcher = async (req, res, next) => {
  try {
    const token = req.cookies.d_token; // Looking for dispatcher-specific cookie

    if (!token) {
      return res.status(401).json({ success: false, message: "Login Required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Hardcoded check
    if (decoded.email !== "dispatcher@gmail.com") {
      return res.status(403).json({ success: false, message: "Not a Dispatcher" });
    }

    req.dispatcher = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Session Expired" });
  }
};

export default authDispatcher;