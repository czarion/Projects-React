import React from 'react';
import { Store, Mail, Globe, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Store className="h-8 w-8 text-primary-400" />
              <span className="font-bold text-xl tracking-tight">ModernShop</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your one-stop destination for premium products. Experience shopping like never before.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/products" className="hover:text-primary-400">All Products</Link></li>
              <li><Link to="/products?category=electronics" className="hover:text-primary-400">Electronics</Link></li>
              <li><Link to="/products?category=clothing" className="hover:text-primary-400">Clothing</Link></li>
              <li><Link to="/products?category=jewelery" className="hover:text-primary-400">Jewelry</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary-400">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary-400">FAQs</a></li>
              <li><a href="#" className="hover:text-primary-400">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-primary-400">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400"><Globe className="w-6 h-6" /></a>
              <a href="#" className="text-gray-400 hover:text-primary-400"><MessageCircle className="w-6 h-6" /></a>
              <a href="#" className="text-gray-400 hover:text-primary-400"><Mail className="w-6 h-6" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} ModernShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
