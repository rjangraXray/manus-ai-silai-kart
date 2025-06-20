import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, Grid, List, Star, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState('all');

  // Sample product data - in real app this would come from API
  const products = [
    {
      id: 1,
      name: 'Royal Purple Punjabi Suit',
      price: 2499,
      originalPrice: 3499,
      rating: 4.8,
      reviews: 124,
      image: '/src/assets/AkQL7SYn2elS.jpg',
      fabric: 'Pure Silk',
      colors: ['Purple', 'Gold'],
      isNew: true,
      isBestseller: false
    },
    {
      id: 2,
      name: 'Elegant Green Salwar Set',
      price: 1899,
      originalPrice: 2499,
      rating: 4.6,
      reviews: 89,
      image: '/src/assets/FXcQ9gUfdNzx.jpg',
      fabric: 'Cotton Silk',
      colors: ['Green', 'Pink'],
      isNew: false,
      isBestseller: true
    },
    {
      id: 3,
      name: 'Designer Blue Palazzo Suit',
      price: 2199,
      originalPrice: 2899,
      rating: 4.7,
      reviews: 156,
      image: '/src/assets/8QbxpfsBdHon.jpg',
      fabric: 'Georgette',
      colors: ['Blue', 'Silver'],
      isNew: false,
      isBestseller: false
    },
    {
      id: 4,
      name: 'Traditional Red Lehenga',
      price: 4999,
      originalPrice: 6999,
      rating: 4.9,
      reviews: 203,
      image: '/src/assets/v5oH1DBQaqML.jpg',
      fabric: 'Heavy Silk',
      colors: ['Red', 'Gold'],
      isNew: true,
      isBestseller: true
    },
    {
      id: 5,
      name: 'Naira Cut Floral Suit',
      price: 1799,
      originalPrice: 2299,
      rating: 4.5,
      reviews: 67,
      image: '/src/assets/5depkqkYDxmA.jpeg',
      fabric: 'Cotton',
      colors: ['Multi'],
      isNew: false,
      isBestseller: false
    },
    {
      id: 6,
      name: 'Haryanvi Dance Ghagra',
      price: 3299,
      originalPrice: 4299,
      rating: 4.8,
      reviews: 91,
      image: '/src/assets/pPNcXQP4KnjQ.jpg',
      fabric: 'Silk Blend',
      colors: ['Multi'],
      isNew: false,
      isBestseller: false
    }
  ];

  const categoryInfo = {
    'punjabi-suits': {
      title: 'Punjabi Suits',
      description: 'Traditional Punjabi style suits with modern comfort and elegant designs',
      totalProducts: 156
    },
    'salwar-suits': {
      title: 'Salwar Suits',
      description: 'Classic three-piece elegance for every occasion',
      totalProducts: 203
    },
    'lehengas': {
      title: 'Lehengas',
      description: 'Royal and festive occasion wear for special celebrations',
      totalProducts: 89
    },
    'palazzo-suits': {
      title: 'Palazzo Suits',
      description: 'Contemporary comfort meets traditional style',
      totalProducts: 134
    },
    'naira-cut-suits': {
      title: 'Naira Cut Suits',
      description: 'Modern silhouette with traditional charm',
      totalProducts: 78
    },
    'haryanvi-ghagras': {
      title: 'Haryanvi Ghagras',
      description: 'Regional traditional dance and celebration wear',
      totalProducts: 45
    }
  };

  const currentCategory = categoryInfo[categoryName] || categoryInfo['punjabi-suits'];

  const ProductCard = ({ product }) => (
    <Card className="category-card overflow-hidden group">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-accent text-accent-foreground">New</Badge>
          )}
          {product.isBestseller && (
            <Badge className="bg-secondary text-secondary-foreground">Bestseller</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
        >
          <Heart className="w-4 h-4" />
        </Button>
        <div className="absolute bottom-2 right-2">
          <Badge variant="outline" className="bg-white/90">
            {product.fabric}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span className="text-sm font-medium ml-1">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-primary">₹{product.price}</span>
          <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
          <Badge variant="secondary" className="text-xs">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.colors.map((color, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {color}
            </Badge>
          ))}
        </div>

        <Button asChild className="w-full btn-traditional">
          <Link to={`/product/${product.id}`}>
            Customize This Design
          </Link>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span>Categories</span>
          <span>/</span>
          <span className="text-primary">{currentCategory.title}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {currentCategory.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            {currentCategory.description}
          </p>
          <div className="text-sm text-muted-foreground">
            Showing {products.length} of {currentCategory.totalProducts} products
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 bg-muted/50 rounded-lg">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Prices</option>
              <option value="under-2000">Under ₹2,000</option>
              <option value="2000-4000">₹2,000 - ₹4,000</option>
              <option value="above-4000">Above ₹4,000</option>
            </select>

            <select className="px-3 py-1 border rounded-md text-sm">
              <option value="all">All Fabrics</option>
              <option value="silk">Silk</option>
              <option value="cotton">Cotton</option>
              <option value="georgette">Georgette</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

