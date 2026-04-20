import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Truck, Shield, ArrowLeft } from 'lucide-react';
import { fetchProductById } from '../services/api';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { Loader } from '../components/Loader';
import { ErrorState } from '../components/ErrorState';

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;
  if (!product) return <ErrorState message="Product not found" />;

  const inWishlist = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid lg:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
        {/* Image Gallery */}
        <div className="relative bg-gray-50 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
          <button 
            onClick={() => toggleWishlist(product)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors z-10"
          >
            <Heart className={`w-6 h-6 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            src={product.image} 
            alt={product.title} 
            className="w-full h-full max-h-[500px] object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <p className="text-sm text-primary-600 font-medium capitalize tracking-wider mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-yellow-700">{product.rating.rate}</span>
              </div>
              <span className="text-gray-500 text-sm">{product.rating.count} Reviews</span>
            </div>
          </div>

          <div className="mb-8">
            <span className="text-4xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
          </div>

          <div className="mb-8 border-t border-b border-gray-100 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-primary-500/30"
            >
              <ShoppingCart className="w-6 h-6" />
              Add to Cart
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-900">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-900">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">2 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
