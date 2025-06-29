<div align="center">
  <img src="static/JalWiKi.png" alt="JalWiKi Logo" width="200" height="200">
  
  # 🌊 JalWiKi: Digital Platform for Water Conservation
  
  ### *Empowering Knowledge Sharing and Collaboration for Sustainable Water Management*
  
  [![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
  [![Django](https://img.shields.io/badge/Django-5.1.6-green?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
  [![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
  [![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)
  
</div>

---

## 🌟 About JalWiKi

**JalWiKi** is a comprehensive digital platform designed to combat water scarcity through collaborative knowledge sharing. Built with modern web technologies, it serves as a centralized hub where water conservation experts, enthusiasts, and learners can contribute, discover, and implement sustainable water management solutions.

The platform combines traditional water conservation wisdom with cutting-edge technology, featuring detailed documentation of techniques ranging from agricultural innovations like drip irrigation to household solutions such as rainwater harvesting. Each technique includes comprehensive guides with benefits, required materials, step-by-step implementation instructions, and region-specific applicability.

## ✨ Key Features

### 🏛️ **Core Platform Features**
- **📚 Knowledge Repository**: Wikipedia-style collaborative editing for water conservation techniques
- **🔐 Secure Authentication**: JWT-based user authentication with profile management
- **🌓 Theme Support**: Dynamic light/dark mode with persistent user preferences
- **📱 Responsive Design**: Mobile-first approach ensuring accessibility across all devices
- **🔍 Advanced Search**: Powerful search and filtering capabilities across techniques and categories

### 💧 **Water Management Tools**
- **📊 Technique Database**: Comprehensive collection of water conservation methods
- **🗺️ Regional Mapping**: Location-specific technique recommendations
- **📈 Impact Assessment**: Categorized impact levels (Low, Medium, High) for each technique
- **🏷️ Smart Categorization**: Organized content with multiple category support
- **📸 Visual Documentation**: Image galleries with step-by-step visual guides

### 🤝 **Community Features**
- **💬 Discussion Forums**: Community-driven discussions with threaded comments
- **👍 Social Interactions**: Like/upvote system for techniques and forum posts
- **🏆 User Contributions**: Track and showcase user-contributed content
- **🏷️ Tagging System**: Flexible tagging for better content organization
- **📢 Announcements**: Platform-wide announcements and updates

### 🤖 **AI Integration**
- **🧠 AI-Powered Recommendations**: Intelligent technique suggestions based on user preferences
- **💡 Smart Solutions**: AI-driven water conservation problem-solving assistance
- **📊 Data Analytics**: Usage patterns and effectiveness tracking

### 🏛️ **Government Integration**
- **📋 Scheme Information**: Access to government water management schemes
- **📄 Policy Updates**: Latest water conservation policies and regulations
- **🤝 NGO Partnerships**: Collaboration with water conservation organizations

## 🛠️ Technology Stack

### **Backend Technologies**
- ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) **Python 3.11** - Core backend language
- ![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white) **Django 5.1.6** - Web framework
- ![DRF](https://img.shields.io/badge/DRF-ff1709?style=flat&logo=django&logoColor=white) **Django REST Framework** - API development
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) **PostgreSQL** - Primary database
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=JSON%20web%20tokens&logoColor=white) **JWT Authentication** - Secure token-based auth

### **Frontend Technologies**
- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white) **Next.js 15.2.4** - React framework
- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **React 19.1.0** - UI library
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript 5.0** - Type-safe JavaScript
- ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS** - Utility-first CSS framework
- ![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat&logo=radix-ui&logoColor=white) **Radix UI** - Accessible component primitives

### **Additional Tools & Libraries**
- ![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=flat&logo=Firebase&logoColor=white) **Firebase** - Additional services integration
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) **Axios** - HTTP client
- ![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat&logo=framer&logoColor=blue) **Framer Motion** - Animation library
- **Google Gemini AI** - AI-powered features

## 📁 Project Structure

```
JalWiKi/
├── 🐍 Backend (Django)
│   ├── jalwiki_app/              # Main Django application
│   │   ├── migrations/           # Database migrations
│   │   ├── models.py            # Data models (User, Technique, Forum, etc.)
│   │   ├── serializers.py       # API serializers
│   │   ├── views.py             # API viewsets and endpoints
│   │   ├── urls.py              # URL routing
│   │   └── admin.py             # Django admin configuration
│   ├── jalwiki_pro/             # Django project settings
│   │   ├── settings.py          # Main configuration
│   │   ├── urls.py              # Root URL patterns
│   │   └── wsgi.py              # WSGI configuration
│   ├── static/                  # Static files
│   ├── media/                   # User uploads
│   ├── manage.py                # Django management script
│   └── requirements.txt         # Python dependencies
│
├── ⚛️ Frontend (Next.js)
│   ├── jalwiki_ui/
│   │   ├── app/                 # Next.js 13+ app directory
│   │   │   ├── auth/            # Authentication pages
│   │   │   ├── techniques/      # Technique management
│   │   │   ├── forum/           # Community forums
│   │   │   ├── dashboard/       # User dashboard
│   │   │   ├── gov/             # Government schemes
│   │   │   └── waterai/         # AI features
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # Base UI components
│   │   │   ├── forum_comp/      # Forum-specific components
│   │   │   ├── gov_ngo/         # Government/NGO components
│   │   │   └── water_ai/        # AI-related components
│   │   ├── context/             # React context providers
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utility functions and API clients
│   │   ├── types/               # TypeScript type definitions
│   │   └── styles/              # Global styles
│   └── package.json             # Node.js dependencies
│
└── 📄 Documentation
    ├── README.md                # This file
    ├── Documentation.md         # Detailed documentation
    ├── LICENSE                  # MIT License
    └── start_project.bat        # Windows startup script
```

## 🚀 Quick Start Guide

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- ![Python](https://img.shields.io/badge/Python-3.11+-blue?style=flat&logo=python) **Python 3.11 or higher**
- ![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat&logo=node.js) **Node.js 18.x or higher**
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue?style=flat&logo=postgresql) **PostgreSQL 12 or higher**
- ![Git](https://img.shields.io/badge/Git-Latest-orange?style=flat&logo=git) **Git** (for version control)

### 🔧 Installation Steps

#### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/yourusername/JalWiKi.git
cd JalWiKi
```

#### 2️⃣ **Backend Setup (Django)**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Configure database (update jalwiki_pro/settings.py with your PostgreSQL credentials)
# Run migrations
python manage.py migrate

# Create superuser account
python manage.py createsuperuser

# Start Django development server
python manage.py runserver 8000
```

#### 3️⃣ **Frontend Setup (Next.js)**
```bash
# Navigate to frontend directory
cd jalwiki_ui

# Install Node.js dependencies
npm install
# or using pnpm (recommended)
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

#### 4️⃣ **Quick Launch (Windows)**
For Windows users, simply run:
```batch
start_project.bat
```
This script will automatically start both backend and frontend servers.

### 🌐 **Access the Application**

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Django Admin Panel**: [http://localhost:8000/admin](http://localhost:8000/admin)
- **API Endpoints**: [http://localhost:8000/api/](http://localhost:8000/api/)

## 📖 Usage Guide

### 🔑 **Getting Started**

1. **Create an Account**: Register through the web interface or API
2. **Explore Techniques**: Browse the comprehensive water conservation database
3. **Join Discussions**: Participate in community forums
4. **Contribute Content**: Add your own water conservation techniques
5. **Use AI Features**: Get personalized recommendations

### 💧 **Key Workflows**

#### **Adding a Water Conservation Technique**
1. Navigate to the Techniques section
2. Click "Add New Technique"
3. Fill in technique details (title, description, materials, steps)
4. Add images and categorize appropriately
5. Specify regional applicability and impact level
6. Publish for community review

#### **Participating in Forums**
1. Browse existing discussions or create new threads
2. Use tags to categorize your posts
3. Engage with community through comments and upvotes
4. Share experiences and ask questions

#### **Using AI Recommendations**
1. Access the WaterAI section
2. Input your specific water conservation needs
3. Receive personalized technique suggestions
4. Get implementation guidance and tips

## 🔧 Configuration

### 🗄️ **Database Setup**

Update `jalwiki_pro/settings.py`:

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

### 🔐 **Environment Variables**

Create a `.env` file in the project root:

```env
# Django Settings
SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=jalwiki_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# JWT Settings
JWT_SECRET_KEY=your_jwt_secret

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Firebase (if using)
FIREBASE_CONFIG=your_firebase_config
```

## 🧪 Testing

### Backend Testing
```bash
# Run Django tests
python manage.py test

# Run specific app tests
python manage.py test jalwiki_app

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

### Frontend Testing
```bash
cd jalwiki_ui

# Run Jest tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests (if configured)
npm run test:e2e
```

## 🚀 Deployment

### 🐳 **Docker Deployment**

```dockerfile
# Dockerfile example
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### ☁️ **Production Deployment**

1. **Backend (Django)**:
   - Use Gunicorn or uWSGI as WSGI server
   - Configure Nginx as reverse proxy
   - Set up PostgreSQL database
   - Configure static file serving

2. **Frontend (Next.js)**:
   - Build for production: `npm run build`
   - Deploy to Vercel, Netlify, or similar platform
   - Configure environment variables//github.com/yourusername/JalWiKi.git
cd JalWiKi
```

#### 2️⃣ **Backend Setup (Django)**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Configure database (update jalwiki_pro/settings.py with your PostgreSQL credentials)
# Run migrations
python manage.py migrate

# Create superuser account
python manage.py createsuperuser

# Start Django development server
python manage.py runserver 8000
```

#### 3️⃣ **Frontend Setup (Next.js)**
```bash
# Navigate to frontend directory
cd jalwiki_ui

# Install Node.js dependencies
npm install
# or using pnpm (recommended)
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

#### 4️⃣ **Quick Launch (Windows)**
For Windows users, simply run:
```batch
start_project.bat
```
This script will automatically start both backend and frontend servers.

### 🌐 **Access the Application**

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Django Admin Panel**: [http://localhost:8000/admin](http://localhost:8000/admin)
- **API Documentation**: [http://localhost:8000/api/](http://localhost:8000/api/)

## 📖 Usage Guide

### 👤 **User Management**

#### Registration & Authentication
```bash
# Register new user
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepassword123"
  }'

# Login
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### 💧 **Technique Management**

#### Creating a New Technique
```bash
curl -X POST http://localhost:8000/api/techniques/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Rainwater Harvesting System",
    "summary": "Collect and store rainwater for later use",
    "detailed_content": "Detailed implementation guide...",
    "impact": "high",
    "benefits": ["Reduces water bills", "Sustainable water source"],
    "materials": ["Gutters", "Storage tanks", "Filters"],
    "steps": ["Install gutters", "Connect to storage", "Add filtration"]
  }'
```

#### Searching Techniques
```bash
# Search by title or content
curl "http://localhost:8000/api/techniques/?search=irrigation"

# Filter by category
curl "http://localhost:8000/api/techniques/?categories__id=1"

# Filter by impact level
curl "http://localhost:8000/api/techniques/?impact=high"
```

### 💬 **Forum Interaction**

#### Creating Forum Threads
```bash
curl -X POST http://localhost:8000/api/forum-threads/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Best practices for drip irrigation",
    "content": "What are your experiences with drip irrigation systems?",
    "type": "discussion",
    "tag_ids": [1, 2]
  }'
```

## 🔧 Configuration

### 🗄️ **Database Configuration**

Update `jalwiki_pro/settings.py`:

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

### 🔐 **Environment Variables**

Create a `.env` file in the project root:

```env
# Django Settings
SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=jalwiki_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# JWT Settings
JWT_SECRET_KEY=your_jwt_secret

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Firebase (if using)
FIREBASE_CONFIG=your_firebase_config
```

## 🧪 Testing

### Backend Testing
```bash
# Run Django tests
python manage.py test

# Run specific app tests
python manage.py test jalwiki_app

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

### Frontend Testing
```bash
cd jalwiki_ui

# Run Jest tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests (if configured)
npm run test:e2e
```

## 🚀 Deployment

### 🐳 **Docker Deployment**

```dockerfile
# Dockerfile example
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### ☁️ **Production Deployment**

1. **Backend (Django)**:
   - Use Gunicorn or uWSGI as WSGI server
   - Configure Nginx as reverse proxy
   - Set up PostgreSQL database
   - Configure static file serving

2. **Frontend (Next.js)**:
   - Build for production: `npm run build`
   - Deploy to Vercel, Netlify, or similar platform
   - Configure environment variables

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

## 🗺️ Roadmap

### 🎯 **Current Phase (v1.0)**
- ✅ Core platform functionality
- ✅ User authentication and profiles
- ✅ Technique management system
- ✅ Community forums
- ✅ Basic AI integration

### 🚀 **Upcoming Features (v1.1)**
- 🌐 **Multi-language Support**: Internationalization for global accessibility
- 📱 **Mobile App**: Native iOS and Android applications
- 🗺️ **Interactive Maps**: Geographic visualization of techniques
- 📊 **Advanced Analytics**: Usage statistics and impact metrics
- 🔔 **Notification System**: Real-time updates and alerts

### 🌟 **Future Vision (v2.0)**
- 🤖 **Enhanced AI Features**: Machine learning recommendations
- 🏢 **Enterprise Features**: Organization management and collaboration
- 📈 **Impact Tracking**: Quantitative water conservation metrics
- 🌍 **Global Partnerships**: Integration with international water organizations
- 🎓 **Educational Modules**: Structured learning paths and certifications

## 📞 Support & Contact

For questions, support, or collaboration opportunities:

- **📧 Email**: [itsaitsavipatil@gmail.com](mailto:itsaitsavipatil@gmail.com)
- **🐛 Issues**: [GitHub Issues](https://github.com/yourusername/JalWiKi/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/yourusername/JalWiKi/discussions)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Avishkar Patil

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">
  
  ### 🌊 *"Every drop counts in the journey towards water sustainability"* 🌊
  
  **Made with ❤️ by [Avishkar Patil](mailto:itsaitsavipatil@gmail.com)**
  
  **© 2025 JalWiKi Project. All rights reserved.**
  
  [![GitHub stars](https://img.shields.io/github/stars/yourusername/JalWiKi?style=social)](https://github.com/yourusername/JalWiKi/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/yourusername/JalWiKi?style=social)](https://github.com/yourusername/JalWiKi/network/members)
  [![GitHub watchers](https://img.shields.io/github/watchers/yourusername/JalWiKi?style=social)](https://github.com/yourusername/JalWiKi/watchers)
  
</div>