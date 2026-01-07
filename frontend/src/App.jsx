import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Checkout from './pages/Checkout'
import Settings from './pages/Settings'
import Orders from './pages/Orders'
import AdminOrders from './pages/AdminOrders'
import AdminUsers from './pages/AdminUsers'
import AdminProductsPanel from './pages/AdminProductsPanel'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import Navbar from './components/Navbar'
import { AuthContext } from './context/AuthContext'

function Protected({ children, adminOnly }) {
  const { user } = useContext(AuthContext)
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/orders" element={<Protected><Orders /></Protected>} />
          <Route path="/settings" element={<Protected><Settings /></Protected>} />
          <Route path="/dashboard" element={<Protected><UserDashboard /></Protected>} />
          <Route path="/admin" element={<Protected adminOnly><AdminDashboard /></Protected>} />
          <Route path="/admin/users" element={<Protected adminOnly><AdminUsers /></Protected>} />
          <Route path="/admin/orders" element={<Protected adminOnly><AdminOrders /></Protected>} />
          <Route path="/admin/products" element={<Protected adminOnly><AdminProductsPanel /></Protected>}/>

        </Routes>
      </div>
    </div>
  )
}


