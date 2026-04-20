import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    clearCart();
    // In a real app, send data to server here
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto px-4 py-20 text-center"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 text-green-500 rounded-full mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. We've sent an email with your order details.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700 transition-colors"
        >
          Return to Home
        </Link>
      </motion.div>
    );
  }

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No items to checkout</h2>
        <Link to="/products" className="text-primary-600 hover:underline">Go shopping</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <Link to="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping & Payment</h2>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input required type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input required type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                <input required type="text" placeholder="123" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
            >
              Pay ${total.toFixed(2)}
            </button>
          </form>
        </div>

        <div>
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-contain bg-white p-2 rounded-md" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-1">{item.title}</h4>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold text-lg pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
