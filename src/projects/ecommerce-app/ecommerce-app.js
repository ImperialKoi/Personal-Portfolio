// E-commerce Application
// React-based shopping platform with modern UI

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, Filter } from 'lucide-react';

const EcommerceApp = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState('all');

  // Sample product data
  const sampleProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 299.99,
      rating: 4.8,
      category: "electronics",
      image: "/api/placeholder/300/300",
      inStock: true
    },
    {
      id: 2,
      name: "Organic Cotton T-Shirt",
      price: 29.99,
      rating: 4.5,
      category: "clothing",
      image: "/api/placeholder/300/300",
      inStock: true
    },
    {
      id: 3,
      name: "Smart Fitness Watch",
      price: 199.99,
      rating: 4.7,
      category: "electronics",
      image: "/api/placeholder/300/300",
      inStock: false
    }
  ];

  useEffect(() => {
    setProducts(sampleProducts);
  }, []);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ShopFast</h1>
          <div className="flex items-center space-x-4">
            <button className="relative p-2">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <Filter className="w-5 h-5 text-gray-600" />
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('electronics')}
            className={`px-4 py-2 rounded-full ${filter === 'electronics' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Electronics
          </button>
          <button
            onClick={() => setFilter('clothing')}
            className={`px-4 py-2 rounded-full ${filter === 'clothing' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Clothing
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`px-4 py-2 rounded-lg ${
                      product.inStock 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EcommerceApp;