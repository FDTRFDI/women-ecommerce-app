import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { sendTelegramMessage } from "../utils/telegram.js";

const router = express.Router();

/* ============================
   CREATE NEW ORDER
============================ */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { products, total_price } = req.body;
    const userId = req.user.id;

    // إنشاء الطلب في DB
    const newOrder = await pool.query(
      `INSERT INTO orders (user_id, total_price, status)
       VALUES ($1, $2, 'Pending') RETURNING *`,
      [userId, total_price]
    );

    // جلب بيانات العميل
    const userResult = await pool.query(
      "SELECT name, email FROM users WHERE id=$1",
      [userId]
    );
    const user = userResult.rows[0];

    // تجهيز رسالة Telegram
    let msg = `<b>New Order Received!</b>\n`;
    msg += `Customer: ${user.name}\n`;
    msg += `Email: ${user.email}\n`;
    msg += `Total: ${total_price} AED\n`;
    msg += `Products:\n`;
    products.forEach((p) => {
      msg += `- ${p.name} x ${p.quantity}\n`;
    });

    // إرسال رسالة Telegram
    await sendTelegramMessage(process.env.TELEGRAM_CHAT_ID, msg);

    res.json({
      message: "Order created and Telegram notified",
      order: newOrder.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order creation failed" });
  }
});

/* ============================
   GET USER ORDERS (My Orders)
============================ */
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC",
      [userId]
    );

    res.json(orders.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

export default router;