import React from 'react';

export const Filters = ({ selectedCategory, setSelectedCategory, selectedPriceRange, setSelectedPriceRange, categories }) => {
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: '$0 - $100', value: '0-100' },
    { label: '$100 - $500', value: '100-500' },
    { label: '$500 - $1000', value: '500-1000' },
    { label: '$1000+', value: '1000+' }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-semibold text-lg mb-4 text-gray-900">Filters</h3>
      
      <div className="mb-6">
        <h4 className="font-medium text-sm text-gray-700 mb-3 uppercase tracking-wider">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="category" 
              value="all"
              checked={selectedCategory === 'all'}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="text-gray-600">All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="category" 
                value={category}
                checked={selectedCategory === category}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-600 capitalize">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-sm text-gray-700 mb-3 uppercase tracking-wider">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.value} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="price" 
                value={range.value}
                checked={selectedPriceRange === range.value}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-600">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
