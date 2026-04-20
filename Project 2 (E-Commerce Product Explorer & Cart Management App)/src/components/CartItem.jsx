import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <Link to={`/products/${item.id}`} className="shrink-0 w-24 h-24 bg-gray-50 rounded-md p-2">
        <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
      </Link>
      
      <div className="flex-grow">
        <Link to={`/products/${item.id}`}>
          <h4 className="font-medium text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
            {item.title}
          </h4>
        </Link>
        <p className="text-primary-600 font-semibold mt-1">${item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-200 rounded-lg">
          <button 
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-2 text-gray-500 hover:text-primary-600 transition-colors disabled:opacity-50"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-medium text-gray-700">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <button 
          onClick={() => removeFromCart(item.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
