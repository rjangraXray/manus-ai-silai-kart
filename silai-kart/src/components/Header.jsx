import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    'Punjabi Suits',
    'Salwar Suits', 
    'Lehengas',
    'Palazzo Suits',
    'Naira Cut Suits',
    'Haryanvi Ghagras'
  ];

  return (
    <header className="bg-primary text-primary-foreground shadow-traditional">
      {/* Top Bar */}
      <div className="border-b border-secondary/20">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="hidden md:block">
              <span>Free shipping on orders above ₹2000</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>📞 +91-9876543210</span>
              <span>✉️ support@silaikart.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl md:text-3xl font-bold text-gradient">
              Silai Kart
            </div>
            <div className="hidden md:block text-xs text-secondary">
              Custom Traditional Wear
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="hover:text-secondary transition-colors">
              Home
            </Link>
            <div className="relative group">
              <button className="hover:text-secondary transition-colors">
                Categories
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-card text-card-foreground rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block px-4 py-2 hover:bg-muted transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/how-it-works" className="hover:text-secondary transition-colors">
              How It Works
            </Link>
            <Link to="/measurements" className="hover:text-secondary transition-colors">
              Measurement Guide
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-white/10 rounded-lg px-3 py-2 max-w-xs">
            <Search className="w-4 h-4 mr-2 text-secondary" />
            <input
              type="text"
              placeholder="Search outfits..."
              className="bg-transparent placeholder-secondary/70 text-sm flex-1 outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="w-4 h-4 mr-1" />
              Account
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/cart">
                <ShoppingCart className="w-4 h-4 mr-1" />
                <span className="hidden md:inline">Cart</span>
                <span className="ml-1 bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs">
                  0
                </span>
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-primary/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="hover:text-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <div>
                <div className="font-medium mb-2">Categories</div>
                <div className="pl-4 space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block hover:text-secondary transition-colors text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                to="/how-it-works"
                className="hover:text-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/measurements"
                className="hover:text-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Measurement Guide
              </Link>
              <div className="pt-4 border-t border-secondary/20">
                <Link
                  to="/account"
                  className="flex items-center hover:text-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  My Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

