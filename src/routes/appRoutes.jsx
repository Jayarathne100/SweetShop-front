import React from "react";
import { Routes, Route } from "react-router-dom";

// User pages
import Home from "../pages/user/home/home";
import Products from "../pages/user/products/products";
import Cakes from "../pages/user/cakes/cakes";
import Drinks from "../pages/user/drinks/drinks";
import About from "../pages/user/about/about";
import Contact from "../pages/user/contact/contact";
import Cart from "../pages/user/cart/cart";
import Login from "../pages/user/login/login";
import Register from "../pages/user/register/register";
import Checkout from "../pages/user/Checkout/Checkout";

// Admin pages
import AdminLogin from "../pages/admin/adminLogin/adminLogin";
import Dashboard from "../pages/admin/dashboard/dashboard";
import AdminProducts from "../pages/admin/adminProducts/adminProducts";
import AdminOrders from "../pages/admin/adminOrders/adminOrders";
import AdminUsers from "../pages/admin/adminUsers/adminUsers";
import AdminMessages from "../pages/admin/adminMessages/adminMessages";

// Routes
// import ProtectedRoute from "../components/protectedRoute/protectedRoute";
import AdminRoute from "../components/AdminRoute/AdminRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* USER */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cakes" element={<Cakes />} />
      <Route path="/drinks" element={<Drinks />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />

      {/* ADMIN LOGIN */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ADMIN */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/messages"
        element={
          <AdminRoute>
            <AdminMessages />
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
