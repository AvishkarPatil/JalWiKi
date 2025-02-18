## JalWiKi - Local Setup Guide

### Prerequisites

- Python 3.x
- PostgreSQL
- pip (Python package manager)

### Local Setup

#### 1. Clone the Repository

```bash
git clone -b Avishkar-Patil https://github.com/AvishkarPatil/JalWiKi.git
cd JalWiKi
```

#### 2. Create and Activate Virtual Environment

For Linux/macOS:
```bash
python3 -m venv venv
source venv/bin/activate
```

For Windows:
```bash
python3 -m venv venv
venv\Scripts\activate
```

#### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 4. Database Configuration

1. Install and start PostgreSQL server
2. Create a new PostgreSQL database 
3. Update the database configuration in `jalwiki_pro/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db_name',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```


#### 4. Run Migrations and create a super user

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```
You can access the admin panel at `http://localhost:8000/admin` to add sample data.

#### 5. Start Development Server

```bash
python manage.py runserver 
```

### 6. Requirements

Main dependencies:
- Django
- Django REST Framework
- psycopg2-binary
- drf-yasg (for Swagger/OpenAPI documentation)

For a complete list of dependencies, see `requirements.txt`

### Importing PostgreSQL Database

Run the following command to import the database:

```bash
psql -U postgres -h localhost -p 5432 -d target_database < path/to/database_backup.sql
```

### License

This project is licensed under the MIT License - see the LICENSE file for details
