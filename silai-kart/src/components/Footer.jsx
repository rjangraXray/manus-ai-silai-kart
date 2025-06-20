import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-gradient">Silai Kart</div>
            <p className="text-secondary/80 text-sm">
              Your trusted partner for custom-stitched traditional Indian outfits. 
              Quality craftsmanship meets modern convenience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block hover:text-secondary transition-colors">
                Home
              </Link>
              <Link to="/about" className="block hover:text-secondary transition-colors">
                About Us
              </Link>
              <Link to="/how-it-works" className="block hover:text-secondary transition-colors">
                How It Works
              </Link>
              <Link to="/measurements" className="block hover:text-secondary transition-colors">
                Measurement Guide
              </Link>
              <Link to="/size-chart" className="block hover:text-secondary transition-colors">
                Size Chart
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">Categories</h3>
            <div className="space-y-2 text-sm">
              <Link to="/category/punjabi-suits" className="block hover:text-secondary transition-colors">
                Punjabi Suits
              </Link>
              <Link to="/category/salwar-suits" className="block hover:text-secondary transition-colors">
                Salwar Suits
              </Link>
              <Link to="/category/lehengas" className="block hover:text-secondary transition-colors">
                Lehengas
              </Link>
              <Link to="/category/palazzo-suits" className="block hover:text-secondary transition-colors">
                Palazzo Suits
              </Link>
              <Link to="/category/naira-cut-suits" className="block hover:text-secondary transition-colors">
                Naira Cut Suits
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-secondary" />
                <span>+91-9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-secondary" />
                <span>support@silaikart.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-secondary mt-0.5" />
                <span>
                  123 Fashion Street,<br />
                  Delhi, India - 110001
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-secondary/80">
              © 2024 Silai Kart. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="hover:text-secondary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-secondary transition-colors">
                Terms of Service
              </Link>
              <Link to="/returns" className="hover:text-secondary transition-colors">
                Return Policy
              </Link>
              <Link to="/shipping" className="hover:text-secondary transition-colors">
                Shipping Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Traditional Pattern Border */}
      <div className="h-2 traditional-pattern"></div>
    </footer>
  );
};

export default Footer;

