import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/*
=====================
GET CART
=====================
*/
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        cart.id,
        cart.product_id,
        cart.quantity,
        products.name,
        products.price,
        CONCAT('http://localhost:5000/uploads/', products.image) AS image
      FROM cart
      JOIN products
      ON products.id = cart.product_id
      ORDER BY cart.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/*
=====================
ADD TO CART
=====================
*/
router.post("/", async (req, res) => {
  try {
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        message: "product_id required",
      });
    }

    // هل المنتج موجود مسبقاً؟
    const existing = await pool.query(
      "SELECT * FROM cart WHERE product_id=$1",
      [product_id]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE product_id=$1",
        [product_id]
      );
    } else {
      await pool.query(
        "INSERT INTO cart (product_id, quantity) VALUES ($1,1)",
        [product_id]
      );
    }

    res.json({ message: "Added to cart ✅" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/*
=====================
CLEAR CART
=====================
*/
router.delete("/", async (req, res) => {
  await pool.query("DELETE FROM cart");
  res.json({ message: "Cart cleared ✅" });
});

export default router;