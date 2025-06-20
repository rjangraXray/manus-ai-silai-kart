# Silai Kart - Deployment Guide & Admin Manual

## Table of Contents

1. [Quick Start Guide](#quick-start-guide)
2. [System Requirements](#system-requirements)
3. [Installation Instructions](#installation-instructions)
4. [Configuration Guide](#configuration-guide)
5. [Admin Panel User Manual](#admin-panel-user-manual)
6. [API Documentation](#api-documentation)
7. [Troubleshooting Guide](#troubleshooting-guide)
8. [Maintenance Procedures](#maintenance-procedures)

## Quick Start Guide

### Prerequisites

Before deploying Silai Kart, ensure you have the following installed on your system:

- Node.js (version 18 or higher)
- Python (version 3.11 or higher)
- Git for version control
- A modern web browser for testing

### Quick Deployment Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd silai-kart
   ```

2. **Setup Backend**
   ```bash
   cd silai-kart-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python src/main.py
   ```

3. **Setup Frontend**
   ```bash
   cd ../silai-kart
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:5001
   - Admin Panel: http://localhost:5174/admin

## System Requirements

### Minimum Requirements

- **Operating System**: Linux, macOS, or Windows 10+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 10GB free space
- **Network**: Stable internet connection for payment processing

### Production Requirements

- **Server**: VPS or dedicated server with 2+ CPU cores
- **RAM**: 8GB minimum, 16GB recommended for high traffic
- **Storage**: SSD with 50GB+ free space
- **Database**: PostgreSQL or MySQL for production (SQLite for development)
- **SSL Certificate**: Required for payment processing and security

### Browser Compatibility

- **Chrome**: Version 90+
- **Firefox**: Version 88+
- **Safari**: Version 14+
- **Edge**: Version 90+
- **Mobile**: iOS Safari 14+, Android Chrome 90+

## Installation Instructions

### Development Environment Setup

#### Backend Setup

1. **Create Virtual Environment**
   ```bash
   cd silai-kart-backend
   python -m venv venv
   source venv/bin/activate
   ```

2. **Install Dependencies**
   ```bash
   pip install flask flask-sqlalchemy flask-cors
   pip install -r requirements.txt
   ```

3. **Database Initialization**
   ```bash
   python src/main.py
   # Database tables will be created automatically
   ```

4. **Create Admin User**
   The system automatically creates a default admin user:
   - Username: `admin`
   - Password: `admin123`
   - Email: `admin@silaikart.com`

#### Frontend Setup

1. **Install Node Dependencies**
   ```bash
   cd silai-kart
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

### Production Deployment

#### Using Docker (Recommended)

1. **Create Docker Compose File**
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./silai-kart-backend
       ports:
         - "5001:5001"
       environment:
         - FLASK_ENV=production
         - DATABASE_URL=postgresql://user:pass@db:5432/silaikart
       depends_on:
         - db
     
     frontend:
       build: ./silai-kart
       ports:
         - "80:80"
       depends_on:
         - backend
     
     db:
       image: postgres:13
       environment:
         - POSTGRES_DB=silaikart
         - POSTGRES_USER=user
         - POSTGRES_PASSWORD=pass
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d
   ```

#### Manual Production Deployment

1. **Setup Production Database**
   ```bash
   # For PostgreSQL
   sudo apt install postgresql postgresql-contrib
   sudo -u postgres createdb silaikart
   sudo -u postgres createuser silaikart_user
   ```

2. **Configure Environment Variables**
   ```bash
   export FLASK_ENV=production
   export DATABASE_URL=postgresql://user:pass@localhost/silaikart
   export SECRET_KEY=your-secret-key-here
   export RAZORPAY_KEY_ID=your-razorpay-key
   export RAZORPAY_KEY_SECRET=your-razorpay-secret
   ```

3. **Setup Web Server (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           root /path/to/silai-kart/dist;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:5001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## Configuration Guide

### Environment Variables

#### Backend Configuration

Create a `.env` file in the backend directory:

```env
# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-change-this-in-production
DEBUG=False

# Database Configuration
DATABASE_URL=sqlite:///app.db
# For PostgreSQL: postgresql://username:password@localhost/dbname
# For MySQL: mysql://username:password@localhost/dbname

# Payment Gateway Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# SMS Configuration
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=SILAIKART

# WhatsApp Configuration
WHATSAPP_API_TOKEN=your-whatsapp-api-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
```

#### Frontend Configuration

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5001/api
VITE_BACKEND_URL=http://localhost:5001

# Payment Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id

# Analytics Configuration
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### Database Configuration

#### SQLite (Development)
- Automatically configured
- Database file: `src/database/app.db`
- No additional setup required

#### PostgreSQL (Production)
```python
# In main.py
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/silaikart'
```

#### MySQL (Alternative)
```python
# In main.py
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/silaikart'
```

### Payment Gateway Setup

#### Razorpay Configuration

1. **Create Razorpay Account**
   - Visit https://razorpay.com
   - Complete business verification
   - Generate API keys

2. **Configure Webhooks**
   - Webhook URL: `https://yourdomain.com/api/payment/webhook/payment-update`
   - Events: `payment.captured`, `payment.failed`

3. **Test Integration**
   ```bash
   curl -X POST http://localhost:5001/api/payment/razorpay/create-order \
     -H "Content-Type: application/json" \
     -d '{"order_id": 1, "amount": 249900}'
   ```

## Admin Panel User Manual

### Accessing the Admin Panel

1. **Login Process**
   - Navigate to `/admin` or click Admin link
   - Use default credentials:
     - Username: `admin`
     - Password: `admin123`
   - Change password after first login

2. **Dashboard Overview**
   - Total orders and revenue metrics
   - Recent orders list
   - Customer statistics
   - Product performance data

### Order Management

#### Viewing Orders

1. **Order List**
   - Navigate to Orders section
   - Filter by status: Pending, Confirmed, In Progress, Completed
   - Search by order number or customer name
   - Sort by date, amount, or status

2. **Order Details**
   - Click on any order to view complete details
   - Customer information and contact details
   - Product specifications and customizations
   - Detailed measurements
   - Payment status and method

#### Processing Orders

1. **Status Updates**
   - Change order status from dropdown
   - Add notes for internal tracking
   - Set estimated delivery dates
   - Notify customers automatically

2. **Order Workflow**
   ```
   Pending → Confirmed → In Progress → Quality Check → Shipped → Delivered
   ```

3. **Communication**
   - Send status update emails
   - SMS notifications for important updates
   - WhatsApp messages for customer queries

### Customer Management

#### Customer Information

1. **Customer List**
   - View all registered customers
   - Search by name, email, or phone
   - Filter by registration date or order history
   - Export customer data for analysis

2. **Customer Details**
   - Personal information and contact details
   - Order history and purchase patterns
   - Saved measurements
   - Communication preferences

#### Customer Support

1. **Order Queries**
   - Track customer inquiries
   - Respond to measurement questions
   - Handle customization requests
   - Process returns and exchanges

2. **Measurement Assistance**
   - Review customer measurements
   - Provide measurement guidance
   - Suggest corrections if needed
   - Save corrected measurements

### Product Management

#### Adding New Products

1. **Product Information**
   - Product name and description
   - Category selection
   - Base price and original price
   - Featured product designation

2. **Product Images**
   - Upload multiple product images
   - Set primary image
   - Optimize images for web display
   - Maintain consistent image quality

3. **Customization Options**
   - Configure fabric options with pricing
   - Set available colors
   - Define size ranges
   - Add special features

#### Managing Inventory

1. **Stock Tracking**
   - Monitor fabric availability
   - Track popular products
   - Manage seasonal collections
   - Plan inventory restocking

2. **Pricing Management**
   - Update product prices
   - Set promotional discounts
   - Configure bulk order pricing
   - Manage currency conversions

### Category Management

#### Creating Categories

1. **Category Setup**
   - Category name and slug
   - Description and SEO content
   - Category image upload
   - Display order configuration

2. **Measurement Guides**
   - Upload measurement videos
   - Create step-by-step instructions
   - Configure measurement fields
   - Set category-specific requirements

### Reports and Analytics

#### Sales Reports

1. **Revenue Analytics**
   - Daily, weekly, monthly revenue
   - Product performance metrics
   - Customer acquisition costs
   - Average order values

2. **Order Analytics**
   - Order completion rates
   - Popular products and categories
   - Geographic distribution
   - Seasonal trends

#### Customer Analytics

1. **Customer Behavior**
   - Registration and retention rates
   - Purchase frequency
   - Cart abandonment analysis
   - Customer lifetime value

2. **Measurement Analytics**
   - Common measurement patterns
   - Fit accuracy tracking
   - Return rates by measurements
   - Size distribution analysis

### System Administration

#### User Management

1. **Admin Users**
   - Create additional admin accounts
   - Set role-based permissions
   - Monitor admin activity
   - Manage password policies

2. **Security Settings**
   - Configure session timeouts
   - Set password requirements
   - Enable two-factor authentication
   - Monitor login attempts

#### System Configuration

1. **General Settings**
   - Company information
   - Contact details
   - Business hours
   - Holiday schedules

2. **Notification Settings**
   - Email templates
   - SMS configurations
   - WhatsApp integration
   - Notification schedules

## API Documentation

### Authentication

#### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "admin": {
    "id": 1,
    "username": "admin",
    "full_name": "Admin User",
    "role": "super_admin"
  }
}
```

### Customer Endpoints

#### Get Categories
```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "Punjabi Suits",
      "slug": "punjabi-suits",
      "description": "Traditional Punjabi style suits",
      "image_url": "/assets/punjabi-suits.jpg",
      "products_count": 25
    }
  ]
}
```

#### Get Category Products
```http
GET /api/categories/punjabi-suits/products?page=1&per_page=12&sort_by=popular
```

#### Create Customer
```http
POST /api/customers
Content-Type: application/json

{
  "first_name": "Priya",
  "last_name": "Sharma",
  "email": "priya@example.com",
  "phone": "+91-9876543210",
  "address": "123 Main Street",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001"
}
```

#### Save Measurements
```http
POST /api/measurements
Content-Type: application/json

{
  "customer_id": 1,
  "bust": 36,
  "waist": 30,
  "hip": 38,
  "kurti_length": 42,
  "sleeve_length": 18,
  "shoulder_width": 15,
  "special_requests": "Slightly loose fit preferred"
}
```

#### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "customer_id": 1,
  "subtotal": 2499,
  "shipping_cost": 0,
  "total_amount": 2499,
  "payment_method": "razorpay",
  "shipping_address": "123 Main Street, Delhi, 110001",
  "items": [
    {
      "product_id": 1,
      "measurement_id": 1,
      "quantity": 1,
      "fabric": "Pure Silk",
      "color": "Purple",
      "unit_price": 2499,
      "total_price": 2499,
      "customizations": {}
    }
  ]
}
```

### Payment Endpoints

#### Create Razorpay Order
```http
POST /api/payment/razorpay/create-order
Content-Type: application/json

{
  "order_id": 1,
  "amount": 249900
}
```

#### Verify Payment
```http
POST /api/payment/razorpay/verify-payment
Content-Type: application/json

{
  "razorpay_order_id": "order_SK20241001",
  "razorpay_payment_id": "pay_SK20241001",
  "razorpay_signature": "signature_hash"
}
```

### Admin Endpoints

#### Dashboard Statistics
```http
GET /api/admin/dashboard/stats
```

#### Get Orders
```http
GET /api/admin/orders?page=1&per_page=20&status=pending
```

#### Update Order Status
```http
PUT /api/admin/orders/1/status
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Order confirmed and sent to production"
}
```

### Notification Endpoints

#### Send Order Confirmation
```http
POST /api/notifications/order-confirmation/1
```

#### Send Status Update
```http
POST /api/notifications/order-status-update/1
Content-Type: application/json

{
  "status": "shipped"
}
```

## Troubleshooting Guide

### Common Issues

#### Frontend Issues

1. **Build Errors**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **API Connection Issues**
   - Check backend server is running on port 5001
   - Verify CORS configuration in Flask app
   - Check environment variables for API URLs

3. **Styling Issues**
   - Clear browser cache
   - Check CSS file imports
   - Verify responsive design breakpoints

#### Backend Issues

1. **Database Connection Errors**
   ```bash
   # Check database file permissions
   ls -la src/database/
   
   # Recreate database
   rm src/database/app.db
   python src/main.py
   ```

2. **Import Errors**
   ```bash
   # Activate virtual environment
   source venv/bin/activate
   
   # Install missing dependencies
   pip install -r requirements.txt
   ```

3. **Port Already in Use**
   ```bash
   # Find process using port 5001
   lsof -i :5001
   
   # Kill process
   kill -9 <PID>
   ```

#### Payment Integration Issues

1. **Razorpay Test Mode**
   - Ensure using test API keys
   - Check webhook configuration
   - Verify signature validation

2. **Payment Verification Failures**
   - Check API key configuration
   - Verify webhook endpoint accessibility
   - Review payment flow logs

### Error Codes

#### API Error Codes

- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **500**: Internal Server Error - Server-side error

#### Payment Error Codes

- **PAYMENT_FAILED**: Payment processing failed
- **INVALID_SIGNATURE**: Payment signature verification failed
- **ORDER_NOT_FOUND**: Order not found for payment
- **AMOUNT_MISMATCH**: Payment amount doesn't match order

### Performance Optimization

#### Frontend Optimization

1. **Image Optimization**
   - Compress product images
   - Use WebP format when possible
   - Implement lazy loading

2. **Code Splitting**
   - Implement route-based code splitting
   - Lazy load non-critical components
   - Optimize bundle size

#### Backend Optimization

1. **Database Optimization**
   - Add database indexes
   - Optimize query performance
   - Implement connection pooling

2. **Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data
   - Use CDN for static assets

## Maintenance Procedures

### Regular Maintenance Tasks

#### Daily Tasks

1. **Monitor System Health**
   - Check server resources (CPU, memory, disk)
   - Review error logs
   - Verify payment processing
   - Monitor order processing

2. **Backup Procedures**
   ```bash
   # Database backup
   pg_dump silaikart > backup_$(date +%Y%m%d).sql
   
   # File system backup
   tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
   ```

#### Weekly Tasks

1. **Performance Review**
   - Analyze website performance metrics
   - Review customer feedback
   - Check payment success rates
   - Monitor conversion rates

2. **Security Updates**
   - Update system packages
   - Review security logs
   - Check SSL certificate status
   - Update dependencies

#### Monthly Tasks

1. **Data Analysis**
   - Generate sales reports
   - Analyze customer behavior
   - Review product performance
   - Plan inventory updates

2. **System Updates**
   - Update application dependencies
   - Review and update documentation
   - Plan feature enhancements
   - Conduct security audits

### Backup and Recovery

#### Backup Strategy

1. **Database Backups**
   - Daily automated backups
   - Weekly full system backups
   - Monthly archive backups
   - Offsite backup storage

2. **File Backups**
   - Product images and uploads
   - Configuration files
   - Log files
   - SSL certificates

#### Recovery Procedures

1. **Database Recovery**
   ```bash
   # Restore from backup
   psql silaikart < backup_20241201.sql
   ```

2. **Application Recovery**
   ```bash
   # Restore application files
   tar -xzf app_backup_20241201.tar.gz
   
   # Restart services
   systemctl restart nginx
   systemctl restart silaikart-backend
   ```

### Security Maintenance

#### Security Checklist

1. **Access Control**
   - Review admin user accounts
   - Update passwords regularly
   - Monitor login attempts
   - Implement IP restrictions

2. **Data Protection**
   - Encrypt sensitive data
   - Secure API endpoints
   - Implement rate limiting
   - Monitor for vulnerabilities

#### Security Updates

1. **System Updates**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade
   
   # Update Python packages
   pip install --upgrade -r requirements.txt
   
   # Update Node.js packages
   npm audit fix
   ```

2. **SSL Certificate Renewal**
   ```bash
   # Renew Let's Encrypt certificate
   certbot renew
   
   # Restart web server
   systemctl restart nginx
   ```

This comprehensive deployment guide and admin manual provides all the necessary information for successfully deploying, configuring, and maintaining the Silai Kart e-commerce platform. The documentation covers everything from initial setup to ongoing maintenance procedures, ensuring smooth operation and optimal performance.

