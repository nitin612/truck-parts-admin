import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Orders from "./pages/Orders.jsx";
import Enquiries from "./pages/Enquiries.jsx";
import Customers from "./pages/Customers.jsx";
import Products from "./pages/Products.jsx";
import Categories from "./pages/Categories.jsx";
import Promos from "./pages/Promos.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="customers" element={<Customers />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="promos" element={<Promos />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
