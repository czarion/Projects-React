import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { Loader } from '../components/Loader';
import { ErrorState } from '../components/ErrorState';

export const Home = () => {
  const { products, loading, error } = useProducts();

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  // Display only top 4 highest rated products
  const featuredProducts = [...products]
    .sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="bg-primary-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 text-balance">
                Elevate Your Lifestyle with <span className="text-primary-600">ModernShop</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Discover curated collections of premium electronics, fashion, and jewelry. Quality products delivered straight to your door.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-lg shadow-primary-500/30">
                  Shop Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/products?category=electronics" className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold border border-gray-200 hover:border-primary-600 hover:text-primary-600 transition-colors">
                  Explore Electronics
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-primary-200 rounded-full blur-3xl opacity-50 transform translate-x-10 translate-y-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Fashion Header" 
                className="relative rounded-2xl shadow-2xl object-cover h-[500px] w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
              <div className="p-3 bg-primary-100 text-primary-600 rounded-full">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                <p className="text-sm text-gray-500">On all orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
              <div className="p-3 bg-primary-100 text-primary-600 rounded-full">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                <p className="text-sm text-gray-500">100% secure payment</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
              <div className="p-3 bg-primary-100 text-primary-600 rounded-full">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">30 Days Return</h3>
                <p className="text-sm text-gray-500">If goods have problems</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Top rated items from our collection</p>
            </div>
            <Link to="/products" className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};
