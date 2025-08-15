<div align="center">
  
  ## 🛠️ JalWiKi Installation Guide
  
</div>


## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### **Required Software**
- ![Python](https://img.shields.io/badge/Python-3.11+-blue?style=flat&logo=python) **Python 3.11 or higher**
- ![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat&logo=node.js) **Node.js 18.x or higher**
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue?style=flat&logo=postgresql) **PostgreSQL 12 or higher**
- ![Git](https://img.shields.io/badge/Git-Latest-orange?style=flat&logo=git) **Git** (for version control)

### **Optional Tools**
- **pnpm** (recommended over npm for faster installs)
- **Docker** (for containerized deployment)
- **VS Code** or your preferred IDE

---

## 🔧 Installation Steps

### 1️⃣ **Clone the Repository**

```bash
# Clone the repository
git clone https://github.com/yourusername/JalWiKi.git

# Navigate to project directory
cd JalWiKi

# Verify project structure
ls -la
```

### 2️⃣ **Backend Setup (Django)**

#### **Create Virtual Environment**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Verify activation (should show venv path)
which python
```

#### **Install Python Dependencies**
```bash
# Install all required packages
pip install -r requirements.txt

# Verify Django installation
python -c "import django; print(django.get_version())"
```

#### **Database Configuration**
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
# Update the following variables:
# DB_NAME=jalwiki_db
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_HOST=localhost
# DB_PORT=5432
```

#### **Database Setup**
```bash
# Create PostgreSQL database (if not exists)
createdb jalwiki_db

# Run database migrations
python manage.py migrate

# Create superuser account
python manage.py createsuperuser
# Follow prompts to set username, email, and password

# Load initial data (optional)
python manage.py loaddata initial_data.json
```

#### **Start Django Server**
```bash
# Start development server
python manage.py runserver 8000

# Server should be running at http://localhost:8000
```

### 3️⃣ **Frontend Setup (Next.js)**

#### **Navigate to Frontend Directory**
```bash
# Open new terminal and navigate to frontend
cd jalwiki_ui

# Verify package.json exists
ls package.json
```

#### **Install Node.js Dependencies**
```bash
# Using npm
npm install

# OR using pnpm (recommended)
pnpm install

# Verify installation
npm list --depth=0
```

#### **Environment Configuration**
```bash
# Create frontend environment file
touch .env.local

# Add the following variables:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
# NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

#### **Start Next.js Development Server**
```bash
# Start development server
npm run dev
# OR
pnpm dev

# Frontend should be running at http://localhost:3000
```

### 4️⃣ **Quick Launch (Windows)**

For Windows users, use the automated startup script:

```batch
# Simply double-click or run:
start_project.bat
```

This script will:
- Activate virtual environment
- Check Django installation
- Run migrations
- Start Django server
- Install frontend dependencies
- Start Next.js development server

---

## 🌐 Access the Application

Once both servers are running, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend Application** | [http://localhost:3000](http://localhost:3000) | Main user interface |
| **Django Admin Panel** | [http://localhost:8000/admin](http://localhost:8000/admin) | Admin dashboard |
| **API Endpoints** | [http://localhost:8000/api/](http://localhost:8000/api/) | REST API |
| **API Documentation** | [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/) | Swagger docs |

---

## 🔧 Configuration

### **Database Configuration**

Update `jalwiki_pro/settings.py` for custom database settings:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'jalwiki_db',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### **Environment Variables**

Create and configure your `.env` file:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=jalwiki_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# JWT Settings
JWT_SECRET_KEY=your_jwt_secret
```

### **Static Files Configuration**

```bash
# Collect static files (for production)
python manage.py collectstatic

# Create media directories
mkdir -p jalwiki_app/media/profiles
mkdir -p jalwiki_app/media/technique_images
```

---

## 🧪 Testing Installation

### **Backend Tests**
```bash
# Run Django tests
python manage.py test

# Run specific app tests
python manage.py test jalwiki_app

# Check for any issues
python manage.py check
```

### **Frontend Tests**
```bash
cd jalwiki_ui

# Run Jest tests
npm test

# Build for production (test)
npm run build
```

### **API Testing**
```bash
# Test API endpoints
curl http://localhost:8000/api/techniques/
curl http://localhost:8000/api/users/
```

---

## 🚀 Deployment

### **Docker Deployment**

#### **Backend Dockerfile**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Expose port
EXPOSE 8000

# Run server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

#### **Frontend Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY jalwiki_ui/package*.json ./
RUN npm ci --only=production

# Copy source code
COPY jalwiki_ui/ .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

#### **Docker Compose**
```yaml
version: '3.8'

services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: jalwiki_db
      POSTGRES_USER: jalwiki_user
      POSTGRES_PASSWORD: jalwiki_pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      - DB_HOST=db
      - DB_NAME=jalwiki_db
      - DB_USER=jalwiki_user
      - DB_PASSWORD=jalwiki_pass

  frontend:
    build:
      context: .
      dockerfile: jalwiki_ui/Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### **Production Deployment**

#### **Backend (Django)**
```bash
# Install production server
pip install gunicorn

# Collect static files
python manage.py collectstatic --noinput

# Run with Gunicorn
gunicorn jalwiki_pro.wsgi:application --bind 0.0.0.0:8000
```

#### **Frontend (Next.js)**
```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🔍 Troubleshooting

### **Common Issues**

#### **Python/Django Issues**
```bash
# Virtual environment not activated
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Django not found
pip install django

# Database connection error
# Check PostgreSQL service is running
sudo service postgresql start  # Linux
brew services start postgresql # Mac

# Migration errors
python manage.py makemigrations
python manage.py migrate --run-syncdb
```

#### **Node.js/Next.js Issues**
```bash
# Node modules issues
rm -rf node_modules package-lock.json
npm install

# Port already in use
# Kill process on port 3000
npx kill-port 3000

# Build errors
npm run build
# Check for TypeScript errors
```

#### **Database Issues**
```bash
# Reset database
python manage.py flush
python manage.py migrate

# Create new superuser
python manage.py createsuperuser

# Check database connection
python manage.py dbshell
```

### **Performance Optimization**

```bash
# Django optimizations
pip install django-debug-toolbar
pip install django-extensions

# Frontend optimizations
npm install --save-dev webpack-bundle-analyzer
npm run analyze
```

---

## 📚 Additional Resources

- **Django Documentation**: [https://docs.djangoproject.com/](https://docs.djangoproject.com/)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **PostgreSQL Documentation**: [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)
- **API Documentation**: [API_DOCUMENTATION.md](API_Documentation.md)
- **Screenshots**: [SCREENSHOTS.md](Screenshots.md)

---

## 🆘 Getting Help

If you encounter issues during installation:

1. **Check Prerequisites**: Ensure all required software is installed
2. **Review Error Messages**: Read error messages carefully
3. **Check Logs**: Look at Django and Next.js console outputs
4. **Environment Variables**: Verify all required environment variables are set
5. **Database Connection**: Ensure PostgreSQL is running and accessible
6. **Port Conflicts**: Check if ports 3000 and 8000 are available

### **Support Channels**
- **Email**: [me.avishkarpatil@gmail.com](mailto:me.avishkarpatil@gmail.com)
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/JalWiKi/issues)
- **Documentation**: Check other documentation files in the repository

---

<div align="center">
  
  ### 🌊 *Ready to contribute to water conservation!* 🌊
  
  **© 2025 JalWiKi Project. All rights reserved.**
  
  *Made with ❤️ by [Avishkar Patil](mailto:itsaitsavipatil@gmail.com)*
  
</div>
