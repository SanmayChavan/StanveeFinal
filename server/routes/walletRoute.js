import express from "express";
import {
  getWallet,
  applyCoupon,
  removeCoupon,
  validateOrderWallet,
} from "../controllers/walletController.js";

const router = express.Router();

router.get("/:userId", getWallet);
router.post("/apply", applyCoupon);
router.post("/remove", removeCoupon);
router.post("/validate", validateOrderWallet);

export default router;