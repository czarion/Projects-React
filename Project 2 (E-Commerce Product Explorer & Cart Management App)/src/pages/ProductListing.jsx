import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import { ProductCard } from '../components/ProductCard';
import { Loader } from '../components/Loader';
import { ErrorState } from '../components/ErrorState';
import { Filters } from '../components/Filters';

export const ProductListing = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 300);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Sync state if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const searchParam = searchParams.get('search');
    if (searchParam) setSearch(searchParam);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by Search
    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(lowerSearch) || 
        p.description.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by Price Range
    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.split('-');
      if (max) {
        result = result.filter(p => p.price >= Number(min) && p.price <= Number(max));
      } else {
        result = result.filter(p => p.price >= Number(min.replace('+', '')));
      }
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'newest':
      default:
        // Mock newest by reversing ID since FakeStore doesn't have dates
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [products, debouncedSearch, selectedCategory, selectedPriceRange, sortBy]);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop All Products</h1>
          <p className="text-gray-600">Showing {filteredProducts.length} results</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text"
              placeholder="Filter products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-64"
            />
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4 flex-shrink-0">
          <div className="sticky top-24">
            <Filters 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPriceRange={selectedPriceRange}
              setSelectedPriceRange={setSelectedPriceRange}
              categories={categories}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  setSelectedPriceRange('all');
                }}
                className="mt-4 text-primary-600 font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
