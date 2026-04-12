import express from "express";
import upload from "../middleware/upload.js";
import {
  getAllProducts,
  getCategoryProducts,
  addCategoryProduct,
  updateCategoryProduct,
  deleteCategoryProduct,
  getSingleCategoryProduct,
} from "../controllers/categoryProducts.controller.js";

const router = express.Router();

// =======================
// GET ALL PRODUCTS
// =======================
router.get("/", getAllProducts);

// =======================
// GET PRODUCTS BY CATEGORY
// =======================
router.get("/category/:categoryId",
  (req, res, next) => {
    const categoryId = Number(req.params.categoryId);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }
    req.categoryId = categoryId;
    next();
  },
  getCategoryProducts
);

// =======================
// GET SINGLE PRODUCT
// =======================
router.get("/product/:id", getSingleCategoryProduct);

// =======================
// ADD PRODUCT
// =======================
router.post(
  "/",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  addCategoryProduct
);

// =======================
// UPDATE PRODUCT
// =======================
router.put(
  "/:id",
  (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    req.productId = id;
    next();
  },
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  updateCategoryProduct
);

// =======================
// DELETE PRODUCT
// =======================
router.delete(
  "/:id",
  (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    req.productId = id;
    next();
  },
  deleteCategoryProduct
);

export default router;