import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ لازم apiVersion
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

/*
================================
CREATE PAYMENT INTENT
POST /api/payment/create-payment-intent
================================
*/
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    // ✅ حماية لو المبلغ مش موجود
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100), // AED → fils
      currency: "aed",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.error("Stripe Error:", err.message);
    res.status(500).json({ error: "Payment intent failed" });
  }
});

export default router;
