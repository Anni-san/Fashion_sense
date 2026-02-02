import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import { CartProvider } from './context/CartContext';
import Splash from './pages/Splash';
import InputMethod from './pages/InputMethod';
import ManualInput from './pages/ManualInput';
import CameraScan from './pages/CameraScan';
import Processing from './pages/Processing';
import Recommendations from './pages/Recommendations';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Receipt from './pages/Receipt';
import './styles/global.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  // Here we could implement Framer Motion or React Transition Group
  // For now, standard routing.

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Splash />} />
      <Route path="/input-selection" element={<InputMethod />} />
      <Route path="/manual-input" element={<ManualInput />} />
      <Route path="/camera-scan" element={<CameraScan />} />
      <Route path="/processing" element={<Processing />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/receipt" element={<Receipt />} />
    </Routes>
  );
};

function App() {
  return (
    <SessionProvider>
      <CartProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </CartProvider>
    </SessionProvider>
  );
}

export default App;
