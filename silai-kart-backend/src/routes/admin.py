from flask import Blueprint, request, jsonify
from src.models.silai_models import db, Admin, Customer, Order, OrderItem, Product, Category, Measurement
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import json

admin_bp = Blueprint('admin', __name__)

# Admin Authentication
@admin_bp.route('/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    admin = Admin.query.filter_by(username=username).first()
    
    if admin and check_password_hash(admin.password_hash, password):
        admin.last_login = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'admin': {
                'id': admin.id,
                'username': admin.username,
                'full_name': admin.full_name,
                'role': admin.role
            }
        })
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

# Dashboard Statistics
@admin_bp.route('/dashboard/stats', methods=['GET'])
def dashboard_stats():
    try:
        # Get basic statistics
        total_orders = Order.query.count()
        pending_orders = Order.query.filter_by(status='pending').count()
        completed_orders = Order.query.filter_by(status='completed').count()
        total_customers = Customer.query.count()
        total_products = Product.query.count()
        
        # Get recent orders
        recent_orders = Order.query.order_by(Order.created_at.desc()).limit(5).all()
        
        # Calculate revenue (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_revenue = db.session.query(db.func.sum(Order.total_amount)).filter(
            Order.created_at >= thirty_days_ago,
            Order.payment_status == 'paid'
        ).scalar() or 0
        
        return jsonify({
            'success': True,
            'stats': {
                'total_orders': total_orders,
                'pending_orders': pending_orders,
                'completed_orders': completed_orders,
                'total_customers': total_customers,
                'total_products': total_products,
                'recent_revenue': float(recent_revenue)
            },
            'recent_orders': [{
                'id': order.id,
                'order_number': order.order_number,
                'customer_name': f"{order.customer.first_name} {order.customer.last_name}",
                'total_amount': order.total_amount,
                'status': order.status,
                'created_at': order.created_at.isoformat()
            } for order in recent_orders]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Order Management
@admin_bp.route('/orders', methods=['GET'])
def get_orders():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        
        query = Order.query
        if status:
            query = query.filter_by(status=status)
        
        orders = query.order_by(Order.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'orders': [{
                'id': order.id,
                'order_number': order.order_number,
                'customer': {
                    'name': f"{order.customer.first_name} {order.customer.last_name}",
                    'email': order.customer.email,
                    'phone': order.customer.phone
                },
                'total_amount': order.total_amount,
                'status': order.status,
                'payment_status': order.payment_status,
                'created_at': order.created_at.isoformat(),
                'estimated_delivery': order.estimated_delivery.isoformat() if order.estimated_delivery else None,
                'items_count': len(order.order_items)
            } for order in orders.items],
            'pagination': {
                'page': orders.page,
                'pages': orders.pages,
                'per_page': orders.per_page,
                'total': orders.total
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@admin_bp.route('/orders/<int:order_id>', methods=['GET'])
def get_order_details(order_id):
    try:
        order = Order.query.get_or_404(order_id)
        
        return jsonify({
            'success': True,
            'order': {
                'id': order.id,
                'order_number': order.order_number,
                'customer': {
                    'id': order.customer.id,
                    'name': f"{order.customer.first_name} {order.customer.last_name}",
                    'email': order.customer.email,
                    'phone': order.customer.phone,
                    'address': order.customer.address,
                    'city': order.customer.city,
                    'state': order.customer.state,
                    'pincode': order.customer.pincode
                },
                'items': [{
                    'id': item.id,
                    'product': {
                        'id': item.product.id,
                        'name': item.product.name,
                        'category': item.product.category.name
                    },
                    'quantity': item.quantity,
                    'fabric': item.fabric,
                    'color': item.color,
                    'unit_price': item.unit_price,
                    'total_price': item.total_price,
                    'measurements': {
                        'bust': item.measurement.bust if item.measurement else None,
                        'waist': item.measurement.waist if item.measurement else None,
                        'hip': item.measurement.hip if item.measurement else None,
                        'kurti_length': item.measurement.kurti_length if item.measurement else None,
                        'sleeve_length': item.measurement.sleeve_length if item.measurement else None,
                        'shoulder_width': item.measurement.shoulder_width if item.measurement else None,
                        'bottom_length': item.measurement.bottom_length if item.measurement else None,
                        'bottom_width': item.measurement.bottom_width if item.measurement else None,
                        'neck_depth': item.measurement.neck_depth if item.measurement else None,
                        'armhole': item.measurement.armhole if item.measurement else None,
                        'special_requests': item.measurement.special_requests if item.measurement else None
                    } if item.measurement else None
                } for item in order.order_items],
                'subtotal': order.subtotal,
                'shipping_cost': order.shipping_cost,
                'total_amount': order.total_amount,
                'status': order.status,
                'payment_method': order.payment_method,
                'payment_status': order.payment_status,
                'payment_id': order.payment_id,
                'shipping_address': order.shipping_address,
                'estimated_delivery': order.estimated_delivery.isoformat() if order.estimated_delivery else None,
                'notes': order.notes,
                'created_at': order.created_at.isoformat(),
                'updated_at': order.updated_at.isoformat()
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@admin_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    try:
        data = request.get_json()
        new_status = data.get('status')
        notes = data.get('notes', '')
        
        order = Order.query.get_or_404(order_id)
        order.status = new_status
        if notes:
            order.notes = notes
        order.updated_at = datetime.utcnow()
        
        # Set estimated delivery for confirmed orders
        if new_status == 'confirmed' and not order.estimated_delivery:
            order.estimated_delivery = datetime.utcnow() + timedelta(days=20)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Order status updated successfully',
            'order': {
                'id': order.id,
                'status': order.status,
                'estimated_delivery': order.estimated_delivery.isoformat() if order.estimated_delivery else None
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Product Management
@admin_bp.route('/products', methods=['GET'])
def get_products():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        category_id = request.args.get('category_id', type=int)
        
        query = Product.query
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        products = query.order_by(Product.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'products': [{
                'id': product.id,
                'name': product.name,
                'category': product.category.name,
                'base_price': product.base_price,
                'original_price': product.original_price,
                'is_active': product.is_active,
                'is_featured': product.is_featured,
                'rating': product.rating,
                'review_count': product.review_count,
                'created_at': product.created_at.isoformat()
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

# Customer Management
@admin_bp.route('/customers', methods=['GET'])
def get_customers():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        customers = Customer.query.order_by(Customer.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'customers': [{
                'id': customer.id,
                'name': f"{customer.first_name} {customer.last_name}",
                'email': customer.email,
                'phone': customer.phone,
                'city': customer.city,
                'state': customer.state,
                'orders_count': len(customer.orders),
                'created_at': customer.created_at.isoformat()
            } for customer in customers.items],
            'pagination': {
                'page': customers.page,
                'pages': customers.pages,
                'per_page': customers.per_page,
                'total': customers.total
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Category Management
@admin_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.order_by(Category.name).all()
        
        return jsonify({
            'success': True,
            'categories': [{
                'id': category.id,
                'name': category.name,
                'slug': category.slug,
                'description': category.description,
                'image_url': category.image_url,
                'is_active': category.is_active,
                'products_count': len(category.products),
                'created_at': category.created_at.isoformat()
            } for category in categories]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@admin_bp.route('/categories', methods=['POST'])
def create_category():
    try:
        data = request.get_json()
        
        category = Category(
            name=data['name'],
            slug=data['slug'],
            description=data.get('description'),
            image_url=data.get('image_url'),
            is_active=data.get('is_active', True)
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Category created successfully',
            'category': {
                'id': category.id,
                'name': category.name,
                'slug': category.slug
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

