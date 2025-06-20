import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Share2, Ruler, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const ProductPage = () => {
  const { productId } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedFabric, setSelectedFabric] = useState('silk');
  const [selectedColor, setSelectedColor] = useState('purple');
  const [quantity, setQuantity] = useState(1);

  // Sample product data
  const product = {
    id: productId,
    name: 'Royal Purple Punjabi Suit',
    category: 'Punjabi Suits',
    price: 2499,
    originalPrice: 3499,
    rating: 4.8,
    reviews: 124,
    description: 'Elegant royal purple Punjabi suit crafted with premium silk fabric. Features intricate golden embroidery work and traditional patterns. Perfect for festivals, weddings, and special occasions.',
    images: [
      '/src/assets/AkQL7SYn2elS.jpg',
      '/src/assets/FXcQ9gUfdNzx.jpg',
      '/src/assets/8QbxpfsBdHon.jpg',
      '/src/assets/RHKj3LRnOGbJ.jpg'
    ],
    fabrics: [
      { name: 'Pure Silk', price: 2499, description: 'Premium quality silk with rich texture' },
      { name: 'Cotton Silk', price: 1999, description: 'Comfortable blend for daily wear' },
      { name: 'Georgette', price: 1799, description: 'Lightweight and flowy fabric' }
    ],
    colors: [
      { name: 'Purple', hex: '#8B0080' },
      { name: 'Maroon', hex: '#8B0000' },
      { name: 'Green', hex: '#50C878' },
      { name: 'Blue', hex: '#0066CC' }
    ],
    features: [
      'Custom stitching with perfect fit',
      'Premium quality fabric',
      'Traditional embroidery work',
      'Includes matching dupatta',
      'Free alterations within 30 days'
    ],
    careInstructions: [
      'Dry clean only',
      'Store in cool, dry place',
      'Avoid direct sunlight',
      'Iron on medium heat'
    ],
    deliveryTime: '15-20 business days',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom']
  };

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Added to cart:', {
      productId,
      fabric: selectedFabric,
      color: selectedColor,
      quantity
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-primary">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {product.category}
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-traditional"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              >
                <Heart className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-16 bg-white/80 hover:bg-white"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-secondary text-secondary" />
                  <span className="font-medium ml-1">{product.rating}</span>
                  <span className="text-muted-foreground ml-1">({product.reviews} reviews)</span>
                </div>
                <Badge variant="secondary">Bestseller</Badge>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-primary">
                  ₹{product.fabrics.find(f => f.name.toLowerCase().includes(selectedFabric))?.price || product.price}
                </span>
                <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
                <Badge className="bg-accent text-accent-foreground">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              </div>
            </div>

            {/* Fabric Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Choose Fabric</h3>
              <div className="grid grid-cols-1 gap-3">
                {product.fabrics.map((fabric) => (
                  <Card
                    key={fabric.name}
                    className={`cursor-pointer transition-all ${
                      selectedFabric === fabric.name.toLowerCase().replace(/\s+/g, '') 
                        ? 'border-primary shadow-md' 
                        : 'hover:border-muted-foreground'
                    }`}
                    onClick={() => setSelectedFabric(fabric.name.toLowerCase().replace(/\s+/g, ''))}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{fabric.name}</div>
                          <div className="text-sm text-muted-foreground">{fabric.description}</div>
                        </div>
                        <div className="text-lg font-semibold">₹{fabric.price}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Choose Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name.toLowerCase())}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      selectedColor === color.name.toLowerCase()
                        ? 'border-primary scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button asChild size="lg" className="w-full btn-traditional">
                <Link to="/measurements">
                  <Ruler className="w-5 h-5 mr-2" />
                  Add Measurements & Continue
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Delivery Info */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-sm">
                  <div className="font-medium mb-1">Estimated Delivery</div>
                  <div className="text-muted-foreground">{product.deliveryTime} after measurements</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="care">Care Instructions</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="care" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-2">
                    {product.careInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    Customer reviews will be displayed here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

