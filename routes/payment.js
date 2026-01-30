const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const db = require("../db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

/* CREATE ORDER */
router.post("/create-order", auth, async (req, res) => {
  const { amount, projectId } = req.body;

  const options = {
    amount: amount * 100, // paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  };

  const order = await razorpay.orders.create(options);

  res.json({
    order,
    key: process.env.RAZORPAY_KEY
  });
});

/* VERIFY PAYMENT */
router.post("/verify", auth, (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    projectId
  } = req.body;

  const body =
    razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    db.query(
      "INSERT INTO payments (user_id, project_id, razorpay_payment_id, status) VALUES (?, ?, ?, ?)",
      [req.user.id, projectId, razorpay_payment_id, "success"]
    );
    res.json({ msg: "Payment verified" });
  } else {
    res.status(400).json({ msg: "Payment verification failed" });
  }
});

module.exports = router;
