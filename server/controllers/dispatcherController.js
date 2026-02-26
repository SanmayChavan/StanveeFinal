import jwt from "jsonwebtoken";

const DISPATCHER_EMAIL = "dispatcher@gmail.com";
const DISPATCHER_PASSWORD = "dispatcher";

export const dispatcherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === DISPATCHER_EMAIL && password === DISPATCHER_PASSWORD) {
      // Create token specifically for dispatcher
      const token = jwt.sign({ email, role: 'dispatcher' }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("d_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ success: true, message: "Dispatcher Logged In" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const isDispatcherAuth = async (req, res) => {
  return res.json({ success: true });
};

export const dispatcherLogout = async (req, res) => {
  res.clearCookie("d_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  return res.json({ success: true, message: "Logged Out" });
};