
import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import AppRoutes from "./routes/appRoutes";

import Header from "./components/header/header";
import Footer from "./components/footer/footer";

const AppLayout = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const hideHeader =
    path === "/login" ||
    path === "/register" ||
    path.startsWith("/admin");

  const hideFooter = path.startsWith("/admin");

  return (
    <>
      {!hideHeader && <Header />}

      <AppRoutes />

      {!hideFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
