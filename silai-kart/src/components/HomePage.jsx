import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Headphones } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import heroBanner from '../assets/hero_banner.png';

const HomePage = () => {
  const categories = [
    {
      name: 'Punjabi Suits',
      image: '/src/assets/AkQL7SYn2elS.jpg',
      description: 'Traditional Punjabi style with modern comfort',
      link: '/category/punjabi-suits'
    },
    {
      name: 'Salwar Suits',
      image: '/src/assets/qIZQICESzVuA.jpg',
      description: 'Classic three-piece elegance',
      link: '/category/salwar-suits'
    },
    {
      name: 'Lehengas',
      image: '/src/assets/v5oH1DBQaqML.jpg',
      description: 'Royal and festive occasion wear',
      link: '/category/lehengas'
    },
    {
      name: 'Palazzo Suits',
      image: '/src/assets/0V2sjXzvOY4E.jpg',
      description: 'Contemporary comfort meets tradition',
      link: '/category/palazzo-suits'
    },
    {
      name: 'Naira Cut Suits',
      image: '/src/assets/5depkqkYDxmA.jpeg',
      description: 'Modern silhouette with traditional charm',
      link: '/category/naira-cut-suits'
    },
    {
      name: 'Haryanvi Ghagras',
      image: '/src/assets/pPNcXQP4KnjQ.jpg',
      description: 'Regional traditional dance wear',
      link: '/category/haryanvi-ghagras'
    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-accent" />,
      title: 'Quality Assured',
      description: 'Premium fabrics and expert craftsmanship guaranteed'
    },
    {
      icon: <Truck className="w-8 h-8 text-accent" />,
      title: 'Free Shipping',
      description: 'Free delivery on orders above ₹2000'
    },
    {
      icon: <Headphones className="w-8 h-8 text-accent" />,
      title: '24/7 Support',
      description: 'WhatsApp and phone support available'
    },
    {
      icon: <Star className="w-8 h-8 text-accent" />,
      title: 'Custom Fit',
      description: 'Perfect measurements with video guidance'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Delhi',
      rating: 5,
      comment: 'Amazing quality and perfect fit! The measurement guide was so helpful.',
      outfit: 'Punjabi Suit'
    },
    {
      name: 'Anjali Patel',
      location: 'Mumbai',
      rating: 5,
      comment: 'Beautiful lehenga for my sister\'s wedding. Exceeded expectations!',
      outfit: 'Lehenga'
    },
    {
      name: 'Kavya Reddy',
      location: 'Bangalore',
      rating: 5,
      comment: 'Love the palazzo suits! So comfortable and stylish.',
      outfit: 'Palazzo Suit'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Design Your Perfect
            <span className="block text-secondary">Traditional Outfit</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Custom-stitched traditional Indian wear with premium fabrics and expert craftsmanship
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-traditional text-lg px-8 py-3">
              Start Designing
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary">
              View Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-traditional">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our <span className="text-gradient">Collections</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our wide range of traditional Indian outfits, each crafted with love and attention to detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="category-card overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-200">{category.description}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Button asChild className="w-full btn-traditional">
                    <Link to={category.link}>
                      Explore Designs
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple steps to get your perfect custom outfit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Choose Design', desc: 'Browse and select your favorite outfit design' },
              { step: '02', title: 'Add Measurements', desc: 'Follow our video guide for accurate measurements' },
              { step: '03', title: 'Place Order', desc: 'Secure payment and order confirmation' },
              { step: '04', title: 'Receive Outfit', desc: 'Get your custom-stitched outfit delivered' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="text-gradient">Customers Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-traditional">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.comment}"</p>
                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location} • {testimonial.outfit}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Design Your Perfect Outfit?
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            Join thousands of satisfied customers who trust Silai Kart for their traditional wear needs
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

