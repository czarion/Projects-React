import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(product.id);

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative pt-[100%] bg-white overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.title} 
            className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        <button 
          onClick={() => toggleWishlist(product)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors z-10"
        >
          <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-600">{product.rating.rate}</span>
          <span className="text-xs text-gray-400">({product.rating.count})</span>
        </div>
        
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 capitalize mb-4 line-clamp-1">{product.category}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button 
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
