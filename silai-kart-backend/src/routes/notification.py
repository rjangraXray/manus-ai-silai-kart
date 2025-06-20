from flask import Blueprint, request, jsonify
from src.models.silai_models import db, Order, Customer
from datetime import datetime
import json

notification_bp = Blueprint('notification', __name__)

# Email Templates
EMAIL_TEMPLATES = {
    'order_confirmation': {
        'subject': 'Order Confirmation - Silai Kart',
        'template': '''
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #8B0080;">Silai Kart</h1>
                    <p style="color: #666;">Custom Traditional Wear</p>
                </div>
                
                <h2>Thank you for your order!</h2>
                <p>Dear {customer_name},</p>
                <p>We have received your order and it is being processed. Here are your order details:</p>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3>Order Details</h3>
                    <p><strong>Order Number:</strong> {order_number}</p>
                    <p><strong>Order Date:</strong> {order_date}</p>
                    <p><strong>Total Amount:</strong> ₹{total_amount}</p>
                    <p><strong>Estimated Delivery:</strong> {estimated_delivery}</p>
                </div>
                
                <h3>Items Ordered</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background: #8B0080; color: white;">
                            <th style="padding: 10px; text-align: left;">Item</th>
                            <th style="padding: 10px; text-align: center;">Qty</th>
                            <th style="padding: 10px; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_html}
                    </tbody>
                </table>
                
                <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h4>What happens next?</h4>
                    <ul>
                        <li>Our team will review your measurements</li>
                        <li>We'll start crafting your custom outfit</li>
                        <li>You'll receive updates via SMS and email</li>
                        <li>Your order will be delivered in 15-20 business days</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                    <p>Need help? Contact us:</p>
                    <p>📞 +91-9876543210 | 📧 support@silaikart.com</p>
                    <p style="color: #666; font-size: 12px;">© 2024 Silai Kart. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        '''
    },
    'order_status_update': {
        'subject': 'Order Status Update - Silai Kart',
        'template': '''
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #8B0080;">Silai Kart</h1>
                </div>
                
                <h2>Order Status Update</h2>
                <p>Dear {customer_name},</p>
                <p>Your order <strong>{order_number}</strong> status has been updated to: <strong>{status}</strong></p>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Current Status:</strong> {status}</p>
                    <p><strong>Updated On:</strong> {update_date}</p>
                    {status_message}
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p>Track your order: <a href="https://silaikart.com/track/{order_number}" style="color: #8B0080;">Click here</a></p>
                </div>
            </div>
        </body>
        </html>
        '''
    }
}

# SMS Templates
SMS_TEMPLATES = {
    'order_confirmation': 'Hi {customer_name}! Your Silai Kart order {order_number} for ₹{total_amount} has been confirmed. Estimated delivery: {estimated_delivery}. Track: silaikart.com/track/{order_number}',
    'order_status_update': 'Hi {customer_name}! Your order {order_number} status: {status}. Track: silaikart.com/track/{order_number}. Call +91-9876543210 for queries.',
    'order_shipped': 'Great news {customer_name}! Your order {order_number} has been shipped and will arrive by {delivery_date}. Track: silaikart.com/track/{order_number}',
    'order_delivered': 'Your Silai Kart order {order_number} has been delivered! We hope you love your custom outfit. Please share your feedback: silaikart.com/review'
}

@notification_bp.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.get_json()
        template_name = data.get('template')
        recipient = data.get('recipient')
        template_data = data.get('data', {})
        
        if template_name not in EMAIL_TEMPLATES:
            return jsonify({'success': False, 'message': 'Invalid email template'}), 400
        
        template = EMAIL_TEMPLATES[template_name]
        
        # Format email content
        if template_name == 'order_confirmation':
            items_html = ''
            for item in template_data.get('items', []):
                items_html += f'''
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                        {item['name']}<br>
                        <small style="color: #666;">Fabric: {item['fabric']}, Color: {item['color']}</small>
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">{item['quantity']}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹{item['price']}</td>
                </tr>
                '''
            template_data['items_html'] = items_html
        
        subject = template['subject']
        html_content = template['template'].format(**template_data)
        
        # Mock email sending
        email_result = {
            'to': recipient,
            'subject': subject,
            'status': 'sent',
            'message_id': f'email_{datetime.now().timestamp()}'
        }
        
        print(f"📧 Email sent to {recipient}: {subject}")
        
        return jsonify({
            'success': True,
            'message': 'Email sent successfully',
            'email_result': email_result
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@notification_bp.route('/send-sms', methods=['POST'])
def send_sms():
    try:
        data = request.get_json()
        template_name = data.get('template')
        phone = data.get('phone')
        template_data = data.get('data', {})
        
        if template_name not in SMS_TEMPLATES:
            return jsonify({'success': False, 'message': 'Invalid SMS template'}), 400
        
        template = SMS_TEMPLATES[template_name]
        message = template.format(**template_data)
        
        # Mock SMS sending
        sms_result = {
            'to': phone,
            'message': message,
            'status': 'sent',
            'message_id': f'sms_{datetime.now().timestamp()}'
        }
        
        print(f"📱 SMS sent to {phone}: {message}")
        
        return jsonify({
            'success': True,
            'message': 'SMS sent successfully',
            'sms_result': sms_result
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@notification_bp.route('/order-confirmation/<int:order_id>', methods=['POST'])
def send_order_confirmation(order_id):
    try:
        order = Order.query.get_or_404(order_id)
        customer = order.customer
        
        # Prepare template data
        template_data = {
            'customer_name': f"{customer.first_name} {customer.last_name}",
            'order_number': order.order_number,
            'order_date': order.created_at.strftime('%B %d, %Y'),
            'total_amount': order.total_amount,
            'estimated_delivery': order.estimated_delivery.strftime('%B %d, %Y') if order.estimated_delivery else 'TBD',
            'items': [{
                'name': item.product.name,
                'quantity': item.quantity,
                'fabric': item.fabric or 'Standard',
                'color': item.color or 'Default',
                'price': item.total_price
            } for item in order.order_items]
        }
        
        # Send email
        email_data = {
            'template': 'order_confirmation',
            'recipient': customer.email,
            'data': template_data
        }
        
        # Send SMS
        sms_data = {
            'template': 'order_confirmation',
            'phone': customer.phone,
            'data': template_data
        }
        
        # Mock sending (in real implementation, call actual email/SMS services)
        print(f"📧 Order confirmation email sent to {customer.email}")
        print(f"📱 Order confirmation SMS sent to {customer.phone}")
        
        return jsonify({
            'success': True,
            'message': 'Order confirmation notifications sent',
            'email_sent': True,
            'sms_sent': True
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@notification_bp.route('/order-status-update/<int:order_id>', methods=['POST'])
def send_status_update(order_id):
    try:
        data = request.get_json()
        new_status = data.get('status')
        
        order = Order.query.get_or_404(order_id)
        customer = order.customer
        
        # Status messages
        status_messages = {
            'confirmed': 'Your order has been confirmed and is being prepared.',
            'in_progress': 'Our skilled artisans are working on your custom outfit.',
            'quality_check': 'Your outfit is undergoing final quality checks.',
            'shipped': 'Your order has been shipped and is on its way to you.',
            'delivered': 'Your order has been delivered. We hope you love it!',
            'cancelled': 'Your order has been cancelled. Refund will be processed if applicable.'
        }
        
        template_data = {
            'customer_name': f"{customer.first_name} {customer.last_name}",
            'order_number': order.order_number,
            'status': new_status.title(),
            'update_date': datetime.now().strftime('%B %d, %Y at %I:%M %p'),
            'status_message': f'<p>{status_messages.get(new_status, "Your order status has been updated.")}</p>'
        }
        
        # Send notifications
        print(f"📧 Status update email sent to {customer.email}")
        print(f"📱 Status update SMS sent to {customer.phone}")
        
        return jsonify({
            'success': True,
            'message': 'Status update notifications sent',
            'status': new_status
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@notification_bp.route('/whatsapp/send', methods=['POST'])
def send_whatsapp_message():
    try:
        data = request.get_json()
        phone = data.get('phone')
        message = data.get('message')
        template = data.get('template', 'custom')
        
        # Mock WhatsApp API integration
        # In real implementation, you would use WhatsApp Business API
        whatsapp_result = {
            'to': phone,
            'message': message,
            'template': template,
            'status': 'sent',
            'message_id': f'wa_{datetime.now().timestamp()}'
        }
        
        print(f"💬 WhatsApp message sent to {phone}: {message}")
        
        return jsonify({
            'success': True,
            'message': 'WhatsApp message sent successfully',
            'whatsapp_result': whatsapp_result
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@notification_bp.route('/bulk-notifications', methods=['POST'])
def send_bulk_notifications():
    try:
        data = request.get_json()
        notification_type = data.get('type')  # email, sms, whatsapp
        template_name = data.get('template')
        recipients = data.get('recipients', [])
        template_data = data.get('data', {})
        
        results = []
        
        for recipient in recipients:
            try:
                if notification_type == 'email':
                    # Send email
                    result = {'recipient': recipient, 'status': 'sent', 'type': 'email'}
                elif notification_type == 'sms':
                    # Send SMS
                    result = {'recipient': recipient, 'status': 'sent', 'type': 'sms'}
                elif notification_type == 'whatsapp':
                    # Send WhatsApp
                    result = {'recipient': recipient, 'status': 'sent', 'type': 'whatsapp'}
                else:
                    result = {'recipient': recipient, 'status': 'failed', 'error': 'Invalid type'}
                
                results.append(result)
                print(f"📤 Bulk {notification_type} sent to {recipient}")
                
            except Exception as e:
                results.append({
                    'recipient': recipient,
                    'status': 'failed',
                    'error': str(e)
                })
        
        return jsonify({
            'success': True,
            'message': f'Bulk {notification_type} notifications processed',
            'results': results,
            'total_sent': len([r for r in results if r['status'] == 'sent']),
            'total_failed': len([r for r in results if r['status'] == 'failed'])
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

