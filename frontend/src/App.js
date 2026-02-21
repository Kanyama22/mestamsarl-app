import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import MobileLayout from "./components/MobileLayout";
import HomeMobile from "./pages/HomeMobile";
import ShopMobile from "./pages/ShopMobile";
import ProductDetailMobile from "./pages/ProductDetailMobile";
import CartMobile from "./pages/CartMobile";
import ProfileMobile from "./pages/ProfileMobile";
import ContactAdmin from "./pages/ContactAdmin";
import Checkout from "./pages/Checkout";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./components/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminMessages from "./pages/admin/AdminMessages";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Mobile App Routes */}
            <Route path="/" element={<MobileLayout />}>
              <Route index element={<HomeMobile />} />
              <Route path="shop" element={<ShopMobile />} />
              <Route path="product/:id" element={<ProductDetailMobile />} />
              <Route path="cart" element={<CartMobile />} />
              <Route path="checkout/:id" element={<Checkout />} />
              <Route path="profile" element={<ProfileMobile />} />
              <Route path="contact-admin" element={<ContactAdmin />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="login" element={<AdminLogin />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route index element={<AdminLogin />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
