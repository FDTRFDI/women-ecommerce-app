import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// راوترات المشروع
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/adminRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import paymentRoutes from "./routes/payment.js";
import legalRoutes from "./routes/legal.js";
import authRoutes from "./routes/authRoutes.js";
import categories from "./routes/categories.js";
import categoryProductsRoutes from "./routes/category-products.routes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* =====================
   MIDDLEWARE
===================== */
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// خدمة الملفات المرفوعة
app.use("/uploads", express.static("uploads"));

/* =====================
   ROUTES
===================== */
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/legal", legalRoutes);
app.use("/api/auth", authRoutes);

// ✔ الروت الصحيح للكاتجوري
app.use("/api/categories", categories);

// ✔ الروت الصحيح لمنتجات الكاتجوري
app.use("/api/category-products", categoryProductsRoutes);

/* =====================
   TEST ROUTE
===================== */
app.get("/", (req, res) => res.send("API Running 🚀"));

/* =====================
   START SERVER
===================== */
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));