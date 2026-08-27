import { Routes, Route } from "react-router-dom";
import MainLayout from "./pages/layouts/MainLayout.jsx";

// =========================
// USER PAGES
// =========================
import Home from "./pages/Home";
import CategoryProducts from "./assets/components/Categories/CategoryProducts";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Success from "./pages/Success.jsx";

import Login from "./pages/Login";
import Register from "./pages/Register";

import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory.jsx";
import Orders from "./pages/Orders.jsx";
import MyOrders from "./pages/MyOrders.jsx";

import ProDetails from "./pages/ProDetails.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import CookiePolicy from "./pages/CookiePolicy.jsx";
import LegalPage from "./pages/LegalPage.jsx";

// =========================
// ADMIN
// =========================
import AdminRoute from "./pages/admin/AdminRoute.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProductManager from "./pages/admin/ProductManager.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

import AssignProductToCategory from "./pages/admin/Categories/AssignProductToCategory.jsx";
import Categories from "./pages/admin/Categories/Categories.jsx";
import ProductsPage from "./pages/admin/Categories/ProductsPage.jsx";

// =========================
// APP
// =========================

function App() {
  return (
    <Routes>

      {/* ==================================================
          USER WEBSITE
      ================================================== */}

      <Route element={<MainLayout />}>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* CATEGORIES */}
        <Route
          path="/category/:id"
          element={<CategoryProducts />}
        />

        {/* CATEGORY PRODUCT DETAILS */}
        <Route
          path="/prodetails/:id"
          element={<ProDetails />}
        />

        {/* NORMAL PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* SHOPPING */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/payment"
          element={<Payment />}
        />

        {/* ORDER SUCCESS */}
        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        <Route
          path="/success"
          element={<Success />}
        />

        {/* USER ORDERS */}
        <Route
          path="/orders"
          element={<OrderHistory />}
        />

        <Route
          path="/myOrders"
          element={<MyOrders />}
        />

        {/* ==================================================
            USER AUTH
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* LEGAL */}
        <Route
          path="/privacy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />

        <Route
          path="/refund"
          element={<RefundPolicy />}
        />

        <Route
          path="/cookies"
          element={<CookiePolicy />}
        />

        <Route
          path="/legal/:type"
          element={<LegalPage />}
        />

      </Route>


      {/* ==================================================
          ADMIN LOGIN
          
          IMPORTANT:
          This is separate from the normal customer login.
          
          Customer:
          /login
          
          Admin:
          /admin/login
      ================================================== */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />


      {/* ==================================================
          ADMIN PANEL
          
          AdminRoute protects all /admin/* pages.
      ================================================== */}

      <Route element={<AdminRoute />}>

        {/* ==================================================
            ADMIN DASHBOARD
        ================================================== */}

        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />


        {/* ==================================================
            PRODUCTS
        ================================================== */}

        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <ProductManager />
            </AdminLayout>
          }
        />


        {/* ==================================================
            CATEGORIES
        ================================================== */}

        <Route
          path="/admin/categories"
          element={
            <AdminLayout>
              <Categories />
            </AdminLayout>
          }
        />


        {/* ==================================================
            CATEGORY PRODUCTS
        ================================================== */}

        <Route
          path="/admin/ProductsPage"
          element={
            <AdminLayout>
              <ProductsPage />
            </AdminLayout>
          }
        />


        {/* ==================================================
            ASSIGN PRODUCT TO CATEGORY
        ================================================== */}

        <Route
          path="/admin/products/assign"
          element={
            <AdminLayout>
              <AssignProductToCategory />
            </AdminLayout>
          }
        />


        {/* ==================================================
            ORDERS
        ================================================== */}

        <Route
          path="/admin/orders"
          element={
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          }
        />


        {/* ==================================================
            USERS
        ================================================== */}

        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          }
        />

      </Route>

    </Routes>
  );
}

export default App;