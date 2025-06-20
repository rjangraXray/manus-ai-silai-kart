from flask import Blueprint, request, jsonify
from src.models.silai_models import db, Order, Customer
import json
import hmac
import hashlib
from datetime import datetime

payment_bp = Blueprint('payment', __name__)

# Razorpay Integration
@payment_bp.route('/razorpay/create-order', methods=['POST'])
def create_razorpay_order():
    try:
        data = request.get_json()
        order_id = data.get('order_id')
        amount = data.get('amount')  # Amount in paise
        
        order = Order.query.get_or_404(order_id)
        
        # In a real implementation, you would use Razorpay SDK
        # import razorpay
        # client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
        # razorpay_order = client.order.create({
        #     'amount': amount,
        #     'currency': 'INR',
        #     'receipt': order.order_number,
        #     'payment_capture': 1
        # })
        
        # Mock Razorpay order response
        razorpay_order = {
            'id': f'order_{order.order_number}',
            'amount': amount,
            'currency': 'INR',
            'receipt': order.order_number,
            'status': 'created'
        }
        
        # Update order with payment details
        order.payment_id = razorpay_order['id']
        order.payment_method = 'razorpay'
        db.session.commit()
        
        return jsonify({
            'success': True,
            'razorpay_order': razorpay_order,
            'key_id': 'rzp_test_1234567890',  # Mock key ID
            'order_details': {
                'order_number': order.order_number,
                'customer_name': f"{order.customer.first_name} {order.customer.last_name}",
                'customer_email': order.customer.email,
                'customer_phone': order.customer.phone
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@payment_bp.route('/razorpay/verify-payment', methods=['POST'])
def verify_razorpay_payment():
    try:
        data = request.get_json()
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')
        
        # Find order by payment ID
        order = Order.query.filter_by(payment_id=razorpay_order_id).first_or_404()
        
        # In a real implementation, verify the signature
        # expected_signature = hmac.new(
        #     RAZORPAY_KEY_SECRET.encode(),
        #     f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
        #     hashlib.sha256
        # ).hexdigest()
        
        # Mock verification (always successful for demo)
        signature_valid = True
        
        if signature_valid:
            # Update order status
            order.payment_status = 'paid'
            order.status = 'confirmed'
            order.payment_id = razorpay_payment_id
            order.updated_at = datetime.utcnow()
            db.session.commit()
            
            # Send confirmation email (mock)
            send_order_confirmation_email(order)
            
            return jsonify({
                'success': True,
                'message': 'Payment verified successfully',
                'order_number': order.order_number,
                'status': order.status
            })
        else:
            return jsonify({'success': False, 'message': 'Invalid payment signature'}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# UPI Payment Integration
@payment_bp.route('/upi/create-payment', methods=['POST'])
def create_upi_payment():
    try:
        data = request.get_json()
        order_id = data.get('order_id')
        upi_id = data.get('upi_id')
        
        order = Order.query.get_or_404(order_id)
        
        # Mock UPI payment creation
        upi_payment = {
            'payment_id': f'upi_{order.order_number}',
            'amount': order.total_amount,
            'upi_id': upi_id,
            'status': 'pending',
            'qr_code': f'upi://pay?pa={upi_id}&pn=Silai Kart&am={order.total_amount}&cu=INR&tn=Order {order.order_number}'
        }
        
        # Update order
        order.payment_method = 'upi'
        order.payment_id = upi_payment['payment_id']
        db.session.commit()
        
        return jsonify({
            'success': True,
            'upi_payment': upi_payment
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Paytm Wallet Integration
@payment_bp.route('/paytm/create-payment', methods=['POST'])
def create_paytm_payment():
    try:
        data = request.get_json()
        order_id = data.get('order_id')
        
        order = Order.query.get_or_404(order_id)
        
        # Mock Paytm payment creation
        paytm_payment = {
            'payment_id': f'paytm_{order.order_number}',
            'amount': order.total_amount,
            'status': 'pending',
            'redirect_url': f'https://securegw-stage.paytm.in/order/process?ORDER_ID={order.order_number}'
        }
        
        # Update order
        order.payment_method = 'paytm'
        order.payment_id = paytm_payment['payment_id']
        db.session.commit()
        
        return jsonify({
            'success': True,
            'paytm_payment': paytm_payment
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Cash on Delivery
@payment_bp.route('/cod/confirm', methods=['POST'])
def confirm_cod_order():
    try:
        data = request.get_json()
        order_id = data.get('order_id')
        
        order = Order.query.get_or_404(order_id)
        
        # Update order for COD
        order.payment_method = 'cod'
        order.payment_status = 'pending'
        order.status = 'confirmed'
        order.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Send confirmation email
        send_order_confirmation_email(order)
        
        return jsonify({
            'success': True,
            'message': 'COD order confirmed successfully',
            'order_number': order.order_number
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Payment Status Check
@payment_bp.route('/status/<order_number>', methods=['GET'])
def check_payment_status(order_number):
    try:
        order = Order.query.filter_by(order_number=order_number).first_or_404()
        
        return jsonify({
            'success': True,
            'order_number': order.order_number,
            'payment_status': order.payment_status,
            'order_status': order.status,
            'payment_method': order.payment_method,
            'total_amount': order.total_amount
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Webhook for payment updates
@payment_bp.route('/webhook/payment-update', methods=['POST'])
def payment_webhook():
    try:
        data = request.get_json()
        payment_id = data.get('payment_id')
        status = data.get('status')
        
        # Find order by payment ID
        order = Order.query.filter_by(payment_id=payment_id).first()
        if not order:
            return jsonify({'success': False, 'message': 'Order not found'}), 404
        
        # Update payment status
        if status == 'success':
            order.payment_status = 'paid'
            order.status = 'confirmed'
        elif status == 'failed':
            order.payment_status = 'failed'
        
        order.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Send notification if payment successful
        if status == 'success':
            send_order_confirmation_email(order)
        
        return jsonify({'success': True, 'message': 'Payment status updated'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Helper function for sending emails (mock implementation)
def send_order_confirmation_email(order):
    """
    Mock email sending function.
    In a real implementation, you would use services like:
    - SendGrid
    - Amazon SES
    - SMTP
    """
    email_data = {
        'to': order.customer.email,
        'subject': f'Order Confirmation - {order.order_number}',
        'template': 'order_confirmation',
        'data': {
            'customer_name': f"{order.customer.first_name} {order.customer.last_name}",
            'order_number': order.order_number,
            'total_amount': order.total_amount,
            'estimated_delivery': order.estimated_delivery.strftime('%B %d, %Y') if order.estimated_delivery else 'TBD',
            'items': [{
                'name': item.product.name,
                'quantity': item.quantity,
                'fabric': item.fabric,
                'color': item.color,
                'price': item.total_price
            } for item in order.order_items]
        }
    }
    
    # Mock email sending
    print(f"📧 Sending email to {email_data['to']}: {email_data['subject']}")
    return True

# Helper function for sending SMS (mock implementation)
def send_sms_notification(phone, message):
    """
    Mock SMS sending function.
    In a real implementation, you would use services like:
    - Twilio
    - AWS SNS
    - MSG91
    """
    print(f"📱 Sending SMS to {phone}: {message}")
    return True

