import { Routes, Route } from "react-router-dom";
import MainLayout from "./pages/layouts/MainLayout.jsx";

// Pages
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

// ⭐ هنا التعديل الحقيقي
import ProDetails from "./pages/ProDetails.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import CookiePolicy from "./pages/CookiePolicy.jsx";
import LegalPage from "./pages/LegalPage.jsx";

// Admin
import AdminRoute from "./pages/admin/AdminRoute.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import ProductManager from "./pages/admin/ProductManager.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AssignProductToCategory from "./pages/admin/Categories/AssignProductToCategory.jsx";
import Categories from "./pages/admin/Categories/Categories.jsx";
import ProductsPage from "./pages/admin/Categories/ProductsPage.jsx";



function App() {
  return (
    <Routes>
      {/* USER LAYOUT */}
      <Route element={<MainLayout />}>

        {/* Home */}
        <Route path="/" element={<Home />} />



        {/* DYNAMIC CATEGORIES → PRODUCTS */}
        <Route path="/category/:id" element={<CategoryProducts />} />

        {/* ⭐ PRODUCT DETAILS → هنا التعديل */}
        <Route path="/prodetails/:id" element={<ProDetails />} />
        <Route path="/product/:id" element={<ProductDetails />} />


        {/* Shopping Flow */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/success" element={<Success />} />
        <Route path="/myOrders" element={<MyOrders/>} />

        {/* Orders */}
        <Route path="/orders" element={<OrderHistory />} />

        {/* Legal */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/legal/:type" element={<LegalPage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ADMIN LAYOUT */}
      <Route element={<AdminRoute />}>
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <ProductManager />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <ProductManager />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AdminLayout>
              <Categories />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/ProductsPage"
          element={
            <AdminLayout>
              <ProductsPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/products/assign"
          element={
            <AdminLayout>
              <AssignProductToCategory />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          }
        />

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