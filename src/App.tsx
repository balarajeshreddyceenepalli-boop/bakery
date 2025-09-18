import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Categories from './pages/Categories';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminLogin from './admin/components/AdminLogin';
import StoresManagement from './admin/pages/StoresManagement';
import CategoriesManagement from './admin/pages/CategoriesManagement';
import SubcategoriesManagement from './admin/pages/SubcategoriesManagement';
import ProductsManagement from './admin/pages/ProductsManagement';
import PromotionsManagement from './admin/pages/PromotionsManagement';

function App() {
  return (
    <AdminAuthProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Admin Login */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="stores" element={<StoresManagement />} />
                  <Route path="categories" element={<CategoriesManagement />} />
                  <Route path="subcategories" element={<SubcategoriesManagement />} />
                  <Route path="products" element={<ProductsManagement />} />
                  <Route path="promotions" element={<PromotionsManagement />} />
                  <Route path="orders" element={<div className="p-6">Orders Management - Coming Soon</div>} />
                  <Route path="users" element={<div className="p-6">Users Management - Coming Soon</div>} />
                </Route>

                {/* User Routes */}
                <Route path="/*" element={
                  <>
                    <Header />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/categories/:categoryId" element={<Categories />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/account" element={<div className="p-6">Account - Coming Soon</div>} />
                        <Route path="/orders" element={<div className="p-6">Orders - Coming Soon</div>} />
                        <Route path="/location" element={<div className="p-6">Location - Coming Soon</div>} />
                        <Route path="/checkout" element={<div className="p-6">Checkout - Coming Soon</div>} />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                } />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </AdminAuthProvider>
  );
}

export default App;