import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/header/header";
import Footer from "./components/footer/footer";

// Import your existing page components here.

const Layout = () => {
  const location = useLocation();

  const hideHeaderRoutes = [
    "/login",
    "/register",
    "/admin/login",
  ];

  const hideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        {/* Keep your existing Route components here */}
      </Routes>

      {!hideHeader && <Footer />}
    </>
  );
};

export default Layout;