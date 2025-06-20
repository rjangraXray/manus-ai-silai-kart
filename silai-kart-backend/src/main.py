import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.silai_models import db, Admin, Category, Product
from src.routes.admin import admin_bp
from src.routes.customer import customer_bp
from src.routes.payment import payment_bp
from src.routes.notification import notification_bp
from werkzeug.security import generate_password_hash
import json

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'silai-kart-secret-key-2024'

# Enable CORS for all routes
CORS(app, origins="*")

# Register blueprints
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(customer_bp, url_prefix='/api')
app.register_blueprint(payment_bp, url_prefix='/api/payment')
app.register_blueprint(notification_bp, url_prefix='/api/notifications')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

def init_sample_data():
    """Initialize sample data for testing"""
    
    # Create admin user
    admin = Admin.query.filter_by(username='admin').first()
    if not admin:
        admin = Admin(
            username='admin',
            email='admin@silaikart.com',
            password_hash=generate_password_hash('admin123'),
            full_name='Admin User',
            role='super_admin'
        )
        db.session.add(admin)
    
    # Create categories
    categories_data = [
        {
            'name': 'Punjabi Suits',
            'slug': 'punjabi-suits',
            'description': 'Traditional Punjabi style suits with modern comfort and elegant designs',
            'image_url': '/assets/punjabi-suits.jpg'
        },
        {
            'name': 'Salwar Suits',
            'slug': 'salwar-suits',
            'description': 'Classic three-piece elegance for every occasion',
            'image_url': '/assets/salwar-suits.jpg'
        },
        {
            'name': 'Lehengas',
            'slug': 'lehengas',
            'description': 'Royal and festive occasion wear for special celebrations',
            'image_url': '/assets/lehengas.jpg'
        },
        {
            'name': 'Palazzo Suits',
            'slug': 'palazzo-suits',
            'description': 'Contemporary comfort meets traditional style',
            'image_url': '/assets/palazzo-suits.jpg'
        },
        {
            'name': 'Naira Cut Suits',
            'slug': 'naira-cut-suits',
            'description': 'Modern silhouette with traditional charm',
            'image_url': '/assets/naira-cut-suits.jpg'
        },
        {
            'name': 'Haryanvi Ghagras',
            'slug': 'haryanvi-ghagras',
            'description': 'Regional traditional dance and celebration wear',
            'image_url': '/assets/haryanvi-ghagras.jpg'
        }
    ]
    
    for cat_data in categories_data:
        category = Category.query.filter_by(slug=cat_data['slug']).first()
        if not category:
            category = Category(**cat_data)
            db.session.add(category)
    
    db.session.commit()
    
    # Create sample products
    punjabi_category = Category.query.filter_by(slug='punjabi-suits').first()
    salwar_category = Category.query.filter_by(slug='salwar-suits').first()
    lehenga_category = Category.query.filter_by(slug='lehengas').first()
    
    products_data = [
        {
            'name': 'Royal Purple Punjabi Suit',
            'description': 'Elegant royal purple Punjabi suit crafted with premium silk fabric. Features intricate golden embroidery work and traditional patterns. Perfect for festivals, weddings, and special occasions.',
            'category_id': punjabi_category.id if punjabi_category else 1,
            'base_price': 2499,
            'original_price': 3499,
            'images': json.dumps(['/assets/punjabi-1.jpg', '/assets/punjabi-2.jpg']),
            'fabrics': json.dumps([
                {'name': 'Pure Silk', 'price': 2499, 'description': 'Premium quality silk with rich texture'},
                {'name': 'Cotton Silk', 'price': 1999, 'description': 'Comfortable blend for daily wear'},
                {'name': 'Georgette', 'price': 1799, 'description': 'Lightweight and flowy fabric'}
            ]),
            'colors': json.dumps([
                {'name': 'Purple', 'hex': '#8B0080'},
                {'name': 'Maroon', 'hex': '#8B0000'},
                {'name': 'Green', 'hex': '#50C878'},
                {'name': 'Blue', 'hex': '#0066CC'}
            ]),
            'features': json.dumps([
                'Custom stitching with perfect fit',
                'Premium quality fabric',
                'Traditional embroidery work',
                'Includes matching dupatta',
                'Free alterations within 30 days'
            ]),
            'care_instructions': json.dumps([
                'Dry clean only',
                'Store in cool, dry place',
                'Avoid direct sunlight',
                'Iron on medium heat'
            ]),
            'rating': 4.8,
            'review_count': 124,
            'is_featured': True
        },
        {
            'name': 'Elegant Green Salwar Set',
            'description': 'Beautiful green salwar suit with intricate embroidery and comfortable fit.',
            'category_id': salwar_category.id if salwar_category else 2,
            'base_price': 1899,
            'original_price': 2499,
            'images': json.dumps(['/assets/salwar-1.jpg', '/assets/salwar-2.jpg']),
            'fabrics': json.dumps([
                {'name': 'Cotton Silk', 'price': 1899, 'description': 'Comfortable blend for daily wear'},
                {'name': 'Pure Cotton', 'price': 1599, 'description': 'Breathable and comfortable'},
                {'name': 'Georgette', 'price': 1999, 'description': 'Lightweight and flowy fabric'}
            ]),
            'colors': json.dumps([
                {'name': 'Green', 'hex': '#50C878'},
                {'name': 'Pink', 'hex': '#FFC0CB'},
                {'name': 'Blue', 'hex': '#0066CC'}
            ]),
            'features': json.dumps([
                'Comfortable daily wear',
                'Machine washable',
                'Breathable fabric',
                'Includes matching dupatta'
            ]),
            'care_instructions': json.dumps([
                'Machine wash cold',
                'Hang dry',
                'Iron on low heat'
            ]),
            'rating': 4.6,
            'review_count': 89,
            'is_featured': False
        },
        {
            'name': 'Traditional Red Lehenga',
            'description': 'Stunning red lehenga with heavy embroidery work, perfect for weddings and special occasions.',
            'category_id': lehenga_category.id if lehenga_category else 3,
            'base_price': 4999,
            'original_price': 6999,
            'images': json.dumps(['/assets/lehenga-1.jpg', '/assets/lehenga-2.jpg']),
            'fabrics': json.dumps([
                {'name': 'Heavy Silk', 'price': 4999, 'description': 'Premium heavy silk with rich texture'},
                {'name': 'Silk Blend', 'price': 3999, 'description': 'Comfortable silk blend'},
                {'name': 'Net', 'price': 3499, 'description': 'Lightweight net fabric'}
            ]),
            'colors': json.dumps([
                {'name': 'Red', 'hex': '#FF0000'},
                {'name': 'Gold', 'hex': '#FFD700'},
                {'name': 'Maroon', 'hex': '#8B0000'}
            ]),
            'features': json.dumps([
                'Heavy embroidery work',
                'Perfect for weddings',
                'Includes blouse and dupatta',
                'Custom fitting available'
            ]),
            'care_instructions': json.dumps([
                'Dry clean only',
                'Store carefully',
                'Handle with care'
            ]),
            'rating': 4.9,
            'review_count': 203,
            'is_featured': True
        }
    ]
    
    for prod_data in products_data:
        product = Product.query.filter_by(name=prod_data['name']).first()
        if not product:
            product = Product(**prod_data)
            db.session.add(product)
    
    db.session.commit()

with app.app_context():
    db.create_all()
    init_sample_data()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "Backend API is running. Access admin panel at /admin", 200

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Silai Kart Backend API is running',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

