from flask import Blueprint, request, jsonify
from src.models.silai_models import db, Customer, Product, Category, Order, OrderItem, Measurement
from datetime import datetime, timedelta
import json
import random
import string

customer_bp = Blueprint('customer', __name__)

# Product and Category APIs
@customer_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.filter_by(is_active=True).order_by(Category.name).all()
        
        return jsonify({
            'success': True,
            'categories': [{
                'id': category.id,
                'name': category.name,
                'slug': category.slug,
                'description': category.description,
                'image_url': category.image_url,
                'products_count': Product.query.filter_by(category_id=category.id, is_active=True).count()
            } for category in categories]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@customer_bp.route('/categories/<slug>/products', methods=['GET'])
def get_category_products(slug):
    try:
        category = Category.query.filter_by(slug=slug, is_active=True).first_or_404()
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        sort_by = request.args.get('sort_by', 'popular')
        
        query = Product.query.filter_by(category_id=category.id, is_active=True)
        
        # Apply sorting
        if sort_by == 'price_low':
            query = query.order_by(Product.base_price.asc())
        elif sort_by == 'price_high':
            query = query.order_by(Product.base_price.desc())
        elif sort_by == 'rating':
            query = query.order_by(Product.rating.desc())
        elif sort_by == 'newest':
            query = query.order_by(Product.created_at.desc())
        else:  # popular
            query = query.order_by(Product.review_count.desc(), Product.rating.desc())
        
        products = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'success': True,
            'category': {
                'id': category.id,
                'name': category.name,
                'description': category.description
            },
            'products': [{
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'base_price': product.base_price,
                'original_price': product.original_price,
                'images': json.loads(product.images) if product.images else [],
                'fabrics': json.loads(product.fabrics) if product.fabrics else [],
                'colors': json.loads(product.colors) if product.colors else [],
                'rating': product.rating,
                'review_count': product.review_count,
                'is_featured': product.is_featured
            } for product in products.items],
            'pagination': {
                'page': products.page,
                'pages': products.pages,
                'per_page': products.per_page,
                'total': products.total
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@customer_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product_details(product_id):
    try:
        product = Product.query.filter_by(id=product_id, is_active=True).first_or_404()
        
        return jsonify({
            'success': True,
            'product': {
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'category': {
                    'id': product.category.id,
                    'name': product.category.name,
                    'slug': product.category.slug
                },
                'base_price': product.base_price,
                'original_price': product.original_price,
                'images': json.loads(product.images) if product.images else [],
                'fabrics': json.loads(product.fabrics) if product.fabrics else [],
                'colors': json.loads(product.colors) if product.colors else [],
                'features': json.loads(product.features) if product.features else [],
                'care_instructions': json.loads(product.care_instructions) if product.care_instructions else [],
                'rating': product.rating,
                'review_count': product.review_count,
                'is_featured': product.is_featured
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Customer Management
@customer_bp.route('/customers', methods=['POST'])
def create_customer():
    try:
        data = request.get_json()
        
        # Check if customer already exists
        existing_customer = Customer.query.filter_by(email=data['email']).first()
        if existing_customer:
            return jsonify({
                'success': True,
                'customer_id': existing_customer.id,
                'message': 'Customer already exists'
            })
        
        customer = Customer(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone=data['phone'],
            address=data.get('address'),
            city=data.get('city'),
            state=data.get('state'),
            pincode=data.get('pincode')
        )
        
        db.session.add(customer)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'customer_id': customer.id,
            'message': 'Customer created successfully'
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Measurement Management
@customer_bp.route('/measurements', methods=['POST'])
def save_measurements():
    try:
        data = request.get_json()
        
        measurement = Measurement(
            customer_id=data['customer_id'],
            bust=data.get('bust'),
            waist=data.get('waist'),
            hip=data.get('hip'),
            kurti_length=data.get('kurti_length'),
            sleeve_length=data.get('sleeve_length'),
            shoulder_width=data.get('shoulder_width'),
            bottom_length=data.get('bottom_length'),
            bottom_width=data.get('bottom_width'),
            neck_depth=data.get('neck_depth'),
            armhole=data.get('armhole'),
            special_requests=data.get('special_requests')
        )
        
        db.session.add(measurement)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'measurement_id': measurement.id,
            'message': 'Measurements saved successfully'
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@customer_bp.route('/customers/<int:customer_id>/measurements', methods=['GET'])
def get_customer_measurements(customer_id):
    try:
        measurements = Measurement.query.filter_by(customer_id=customer_id).order_by(Measurement.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'measurements': [{
                'id': measurement.id,
                'bust': measurement.bust,
                'waist': measurement.waist,
                'hip': measurement.hip,
                'kurti_length': measurement.kurti_length,
                'sleeve_length': measurement.sleeve_length,
                'shoulder_width': measurement.shoulder_width,
                'bottom_length': measurement.bottom_length,
                'bottom_width': measurement.bottom_width,
                'neck_depth': measurement.neck_depth,
                'armhole': measurement.armhole,
                'special_requests': measurement.special_requests,
                'created_at': measurement.created_at.isoformat()
            } for measurement in measurements]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Order Management
def generate_order_number():
    """Generate a unique order number"""
    prefix = "SK"
    year = datetime.now().year
    random_part = ''.join(random.choices(string.digits, k=6))
    return f"{prefix}{year}{random_part}"

@customer_bp.route('/orders', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        
        # Generate unique order number
        order_number = generate_order_number()
        while Order.query.filter_by(order_number=order_number).first():
            order_number = generate_order_number()
        
        # Create order
        order = Order(
            order_number=order_number,
            customer_id=data['customer_id'],
            subtotal=data['subtotal'],
            shipping_cost=data.get('shipping_cost', 0),
            total_amount=data['total_amount'],
            payment_method=data.get('payment_method'),
            shipping_address=data.get('shipping_address'),
            estimated_delivery=datetime.utcnow() + timedelta(days=20)
        )
        
        db.session.add(order)
        db.session.flush()  # Get the order ID
        
        # Create order items
        for item_data in data['items']:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data['product_id'],
                measurement_id=item_data.get('measurement_id'),
                quantity=item_data['quantity'],
                fabric=item_data.get('fabric'),
                color=item_data.get('color'),
                unit_price=item_data['unit_price'],
                total_price=item_data['total_price'],
                customizations=json.dumps(item_data.get('customizations', {}))
            )
            db.session.add(order_item)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'order_id': order.id,
            'order_number': order.order_number,
            'message': 'Order created successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@customer_bp.route('/orders/<order_number>', methods=['GET'])
def get_order_by_number(order_number):
    try:
        order = Order.query.filter_by(order_number=order_number).first_or_404()
        
        return jsonify({
            'success': True,
            'order': {
                'id': order.id,
                'order_number': order.order_number,
                'status': order.status,
                'payment_status': order.payment_status,
                'total_amount': order.total_amount,
                'estimated_delivery': order.estimated_delivery.isoformat() if order.estimated_delivery else None,
                'created_at': order.created_at.isoformat(),
                'items': [{
                    'product_name': item.product.name,
                    'quantity': item.quantity,
                    'fabric': item.fabric,
                    'color': item.color,
                    'total_price': item.total_price
                } for item in order.order_items]
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@customer_bp.route('/customers/<int:customer_id>/orders', methods=['GET'])
def get_customer_orders(customer_id):
    try:
        orders = Order.query.filter_by(customer_id=customer_id).order_by(Order.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'orders': [{
                'id': order.id,
                'order_number': order.order_number,
                'status': order.status,
                'payment_status': order.payment_status,
                'total_amount': order.total_amount,
                'estimated_delivery': order.estimated_delivery.isoformat() if order.estimated_delivery else None,
                'created_at': order.created_at.isoformat(),
                'items_count': len(order.order_items)
            } for order in orders]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Search functionality
@customer_bp.route('/search', methods=['GET'])
def search_products():
    try:
        query = request.args.get('q', '').strip()
        category_id = request.args.get('category_id', type=int)
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        
        if not query:
            return jsonify({'success': False, 'message': 'Search query is required'}), 400
        
        # Build search query
        search_query = Product.query.filter(Product.is_active == True)
        
        if query:
            search_query = search_query.filter(
                db.or_(
                    Product.name.contains(query),
                    Product.description.contains(query)
                )
            )
        
        if category_id:
            search_query = search_query.filter_by(category_id=category_id)
        
        products = search_query.order_by(Product.rating.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'query': query,
            'products': [{
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'category': product.category.name,
                'base_price': product.base_price,
                'original_price': product.original_price,
                'images': json.loads(product.images) if product.images else [],
                'rating': product.rating,
                'review_count': product.review_count
            } for product in products.items],
            'pagination': {
                'page': products.page,
                'pages': products.pages,
                'per_page': products.per_page,
                'total': products.total
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

