<div align="center">
  
  # 🌊 JalWiKi API Documentation
  
  ### *RESTful API Reference for Water Conservation Platform*
  
  ![API](https://img.shields.io/badge/API-REST-blue?style=for-the-badge)
  ![Django](https://img.shields.io/badge/Django-REST_Framework-green?style=for-the-badge)
  ![Auth](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)
  ![Version](https://img.shields.io/badge/Version-1.0-purple?style=for-the-badge)
  
</div>

---

## 📋 Table of Contents

- [🔗 Base URL](#-base-url)
- [🔐 Authentication](#-authentication)
- [👤 User Management](#-user-management)
- [💧 Technique Management](#-technique-management)
- [🏷️ Category Management](#️-category-management)
- [🗺️ Region Management](#️-region-management)
- [💬 Forum Management](#-forum-management)
- [📸 Image Management](#-image-management)
- [❌ Error Handling](#-error-handling)
- [📊 Response Formats](#-response-formats)

---

## 🔗 Base URL

```
http://localhost:8000/api/
```

**Production URL**: `https://your-domain.com/api/`

---

## 🔐 Authentication

JalWiKi uses **JWT (JSON Web Token)** authentication for secure API access.

### **Authentication Headers**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### **Token Management**

#### **Obtain Token Pair**
```http
POST /api/token/
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### **Refresh Token**
```http
POST /api/token/refresh/
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

## 👤 User Management

### **User Registration**

```http
POST /api/users/register/
```

**Authentication:** `None` *(Public endpoint)*

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securepassword123",
  "mobile_no": "9876543210",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}
```

**Response (201 Created):**
```json
{
  "status": true,
  "message": "Registration successful",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "mobile_no": "9876543210",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "profile_pic": null
  }
}
```

### **User Login**

```http
POST /api/users/login/
```

**Authentication:** `None` *(Public endpoint)*

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "message": "Auth successful",
  "username": "johndoe",
  "user_id": 1,
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

### **User Logout**

```http
POST /api/users/logout/
```

**Authentication:** `Bearer Token`

**Response (200 OK):**
```json
{
  "status": true,
  "message": "Logout successful."
}
```

### **Get User Details**

```http
GET /api/users/get_user_details/
```

**Authentication:** `Bearer Token`

**Query Parameters:**
- `user_id` *(optional)*: Specific user ID to fetch

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "mobile_no": "9876543210",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "profile_pic": "/media/profiles/user_profile.jpg"
}
```

### **Update Profile Picture**

```http
POST /api/users/update_profile_picture/
```

**Authentication:** `Bearer Token`  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
profile_pic: <image_file>
```

**Response (200 OK):**
```json
{
  "status": true,
  "message": "Profile picture updated successfully",
  "data": {
    "id": 1,
    "username": "johndoe",
    "profile_pic": "/media/profiles/new_profile.jpg"
  }
}
```

### **List All Users**

```http
GET /api/users/
```

**Authentication:** `Bearer Token`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "johndoe",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_pic": "/media/profiles/user_profile.jpg"
  }
]
```

---

## 💧 Technique Management

### **List All Techniques**

```http
GET /api/techniques/
```

**Authentication:** `Bearer Token`

**Query Parameters:**
- `search`: Search in title, summary, content
- `categories__id`: Filter by category ID
- `regions__id`: Filter by region ID
- `impact`: Filter by impact level (`low`, `medium`, `high`)
- `is_published`: Filter by publication status
- `ordering`: Sort by fields (`created_on`, `updated_on`, `-created_on`)

**Example:**
```http
GET /api/techniques/?search=irrigation&impact=high&ordering=-created_on
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Drip Irrigation System",
    "slug": "drip-irrigation-system",
    "summary": "Efficient water delivery system for agriculture",
    "main_image": "/media/technique_images/drip_irrigation.jpg",
    "created_on": "2025-01-15T10:30:00Z",
    "updated_on": "2025-01-15T10:30:00Z",
    "is_published": true,
    "categories": [
      {
        "id": 1,
        "name": "Agriculture",
        "description": "Agricultural water conservation"
      }
    ],
    "regions": [
      {
        "id": 1,
        "name": "Maharashtra"
      }
    ],
    "added_by_username": "johndoe"
  }
]
```

### **Get Technique Details**

```http
GET /api/techniques/{id}/
```

**Authentication:** `Bearer Token`

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Drip Irrigation System",
  "slug": "drip-irrigation-system",
  "added_by": 1,
  "summary": "Efficient water delivery system for agriculture",
  "detailed_content": "Detailed implementation guide for drip irrigation...",
  "main_image": "/media/technique_images/drip_irrigation.jpg",
  "created_on": "2025-01-15T10:30:00Z",
  "updated_on": "2025-01-15T10:30:00Z",
  "is_published": true,
  "impact": "high",
  "benefits": [
    "Reduces water consumption by 30-50%",
    "Increases crop yield",
    "Prevents soil erosion"
  ],
  "materials": [
    "Drip tubing",
    "Emitters",
    "Pressure regulators",
    "Filters"
  ],
  "steps": [
    "Plan the irrigation layout",
    "Install main water line",
    "Connect drip tubing",
    "Install emitters",
    "Test the system"
  ],
  "categories": [
    {
      "id": 1,
      "name": "Agriculture",
      "description": "Agricultural water conservation"
    }
  ],
  "regions": [
    {
      "id": 1,
      "name": "Maharashtra"
    }
  ],
  "likes": [1, 2, 3],
  "likes_count": 3,
  "added_by_username": "johndoe",
  "images": [
    {
      "id": 1,
      "image": "/media/technique_images/step1.jpg",
      "caption": "Installation step 1",
      "order": 1,
      "type": "step"
    }
  ]
}
```

### **Create New Technique**

```http
POST /api/techniques/
```

**Authentication:** `Bearer Token`

**Request Body:**
```json
{
  "title": "Rainwater Harvesting System",
  "summary": "Collect and store rainwater for later use",
  "detailed_content": "Comprehensive guide to implementing rainwater harvesting...",
  "impact": "high",
  "benefits": [
    "Reduces water bills",
    "Sustainable water source",
    "Reduces flood risk"
  ],
  "materials": [
    "Gutters",
    "Storage tanks",
    "Filters",
    "Pipes"
  ],
  "steps": [
    "Install gutters",
    "Connect to storage tank",
    "Add filtration system",
    "Test collection system"
  ],
  "categories": [1, 2],
  "regions": [1],
  "is_published": true
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "title": "Rainwater Harvesting System",
  "slug": "rainwater-harvesting-system",
  "added_by": 1,
  "summary": "Collect and store rainwater for later use",
  "detailed_content": "Comprehensive guide to implementing rainwater harvesting...",
  "main_image": null,
  "created_on": "2025-01-15T11:00:00Z",
  "updated_on": "2025-01-15T11:00:00Z",
  "is_published": true,
  "impact": "high",
  "benefits": ["Reduces water bills", "Sustainable water source"],
  "materials": ["Gutters", "Storage tanks", "Filters"],
  "steps": ["Install gutters", "Connect to storage tank"],
  "categories": [
    {
      "id": 1,
      "name": "Agriculture"
    }
  ],
  "regions": [
    {
      "id": 1,
      "name": "Maharashtra"
    }
  ],
  "likes": [],
  "likes_count": 0,
  "added_by_username": "johndoe",
  "images": []
}
```

### **Update Technique**

```http
PUT /api/techniques/{id}/
PATCH /api/techniques/{id}/
```

**Authentication:** `Bearer Token`

**Request Body:** *(Same as create, but all fields optional for PATCH)*

### **Delete Technique**

```http
DELETE /api/techniques/{id}/
```

**Authentication:** `Bearer Token`

**Response (204 No Content)**

### **Toggle Like Technique**

```http
POST /api/techniques/{id}/toggle_like/
```

**Authentication:** `Bearer Token`

**Response (200 OK):**
```json
{
  "liked": true,
  "likes_count": 4
}
```

### **Get Related Techniques**

```http
GET /api/techniques/{id}/get_related/
```

**Authentication:** `Bearer Token`

**Response (200 OK):**
```json
[
  {
    "id": 3,
    "title": "Sprinkler Irrigation",
    "slug": "sprinkler-irrigation",
    "summary": "Overhead irrigation system",
    "main_image": "/media/technique_images/sprinkler.jpg",
    "categories": [
      {
        "id": 1,
        "name": "Agriculture"
      }
    ]
  }
]
```

### **Get User's Techniques**

```http
GET /api/techniques/user_techniques/
```

**Authentication:** `Bearer Token`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "My Water Conservation Technique",
    "slug": "my-water-conservation-technique",
    "summary": "Personal technique I developed",
    "is_published": true,
    "created_on": "2025-01-15T10:30:00Z"
  }
]
```

---

## 🏷️ Category Management

### **List All Categories**

```http
GET /api/categories/
```

**Authentication:** `Bearer Token`

**Query Parameters:**
- `search`: Search in category name
- `ordering`: Sort by name

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Agriculture",
    "description": "Agricultural water conservation techniques"
  },
  {
    "id": 2,
    "name": "Household",
    "description": "Home water conservation methods"
  }
]
```

### **Create Category**

```http
POST /api/categories/
```

**Authentication:** `Bearer Token`

**Request Body:**
```json
{
  "name": "Industrial",
  "description": "Industrial water conservation techniques"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "name": "Industrial",
  "description": "Industrial water conservation techniques"
}
```

### **Get Category Details**

```http
GET /api/categories/{id}/
```

**Authentication:** `Bearer Token`

### **Update Category**

```http
PUT /api/categories/{id}/
PATCH /api/categories/{id}/
```

**Authentication:** `Bearer Token`

### **Delete Category**

```http
DELETE /api/categories/{id}/
```

**Authentication:** `Bearer Token`

---

## 🗺️ Region Management

### **List All Regions**

```http
GET /api/regions/
```

**Authentication:** `Bearer Token`

**Query Parameters:**
- `search`: Search in region name
- `ordering`: Sort by name

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Maharashtra"
  },
  {
    "id": 2,
    "name": "Karnataka"
  }
]
```

### **Create Region**

```http
POST /api/regions/
```

**Authentication:** `Bearer Token`

**Request Body:**
```json
{
  "name": "Tamil Nadu"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "name": "Tamil Nadu"
}
```

### **CRUD Operations**
- `GET /api/regions/{id}/` - Get region details
- `PUT /api/regions/{id}/` - Update region
- `DELETE /api/regions/{id}/` - Delete region

---

## 💬 Forum Management

### **Forum Tags**

#### **List All Tags**

```http
GET /api/forum-tags/
```

**Authentication:** `Bearer Token` *(Read-only for unauthenticated)*

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "irrigation",
    "slug": "irrigation"
  },
  {
    "id": 2,
    "name": "rainwater-harvesting",
    "slug": "rainwater-harvesting"
  }
]
```

#### **Create Tag**

```http
POST /api/forum-tags/
```

**Authentication:** `Bearer Token`

**Request Body:**
```json
{
  "name": "water-conservation"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "name": "water-conservation",
  "slug": "water-conservation"
}
```

### **Forum Threads**

#### **List All Threads**

```http
GET /api/forum-threads/
```

**Authentication:** `Bearer Token` *(Read-only for unauthenticated)*

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Best practices for drip irrigation",
    "slug": "best-practices-for-drip-irrigation",
    "content": "What are your experiences with drip irrigation systems?",
    "type": "discussion",
    "author": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "profile_pic_url": "/media/profiles/john.jpg"
    },
    "tags": [
      {
        "id": 1,
        "name": "irrigation",
        "slug": "irrigation"
      }
    ],
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z",
    "last_activity_at": "2025-01-15T12:00:00Z",
    "upvote_count": 5,
    "comment_count": 3,
    "is_liked_by_user": true,
    "upvoted_by": [1, 2, 3]
  }
]
```

#### **Get Thread Details**

```http
GET /api/forum-threads/{slug}/
```

**Authentication:** `Bearer Token` *(Read-only for unauthenticated)*

#### **Create Thread**

```http
POST /api/forum-threads/
```

**Authentication:** `Bearer Token`

**Request Body:**
```json
{
  "title": "Water conservation in urban areas",
  "content": "Let's discuss effective water conservation methods for cities...",
  "type": "discussion",
  "tag_ids": [1, 2]
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "title": "Water conservation in urban areas",
  "slug": "water-conservation-in-urban-areas",
  "content": "Let's discuss effective water conservation methods for cities...",
  "type": "discussion",
  "author": {
    "id": 1,
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe"
  },
  "tags": [
    {
      "id": 1,
      "name": "irrigation"
    }
  ],
  "created_at": "2025-01-15T11:00:00Z",
  "upvote_count": 0,
  "comment_count": 0,
  "is_liked_by_user": false
}
```

#### **Upvote Thread**

```http
POST /api/forum-threads/{slug}/upvote/
```

**Authentication:** `Bearer Token`

**Response (200 OK):**
```json
{
  "status": "vote processed",
  "upvoted": true,
  "count": 6
}
```

#### **Get Thread Comments**

```http
GET /api/forum-threads/{slug}/thread-comments/
```

**Authentication:** `Bearer Token` *(Read-only for unauthenticated)*

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "thread": 1,
    "author": {
      "id": 2,
      "username": "jane_doe",
      "first_name": "Jane",
      "last_name": "Doe"
    },
    "content": "Great discussion! I've been using drip irrigation for 2 years...",
    "parent_comment": null,
    "created_at": "2025-01-15T11:30:00Z",
    "updated_at": "2025-01-15T11:30:00Z",
    "upvote_count": 2,
    "is_liked_by_user": false,
    "replies": [
      {
        "id": 2,
        "content": "Thanks for sharing your experience!",
        "author": {
          "id": 1,
          "username": "johndoe"
        },
        "created_at": "2025-01-15T12:00:00Z",
        "upvote_count": 1
      }
    ]
  }
]
```

### **Forum Comments**

#### **List Comments**

```http
GET /api/forum-comments/
```

**Authentication:** `Bearer Token` *(Read-only for unauthenticated)*

**Query Parameters:**
- `thread_id`: Filter by thread ID
- `thread_slug`: Filter by thread slug

#### **Create Comment**

```http
POST /api/forum-comments/
```

**Authentication:** `Bearer Token`

**Request Body:**
```json
{
  "thread": 1,
  "content": "This is a great technique! I've implemented it successfully.",
  "parent_comment": null
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "thread": 1,
  "author": {
    "id": 1,
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe"
  },
  "content": "This is a great technique! I've implemented it successfully.",
  "parent_comment": null,
  "created_at": "2025-01-15T13:00:00Z",
  "updated_at": "2025-01-15T13:00:00Z",
  "upvote_count": 0,
  "is_liked_by_user": false,
  "replies": []
}
```

#### **Reply to Comment**

```http
POST /api/forum-comments/
```

**Request Body:**
```json
{
  "thread": 1,
  "content": "Could you share more details about your implementation?",
  "parent_comment": 3
}
```

#### **Upvote Comment**

```http
POST /api/forum-comments/{id}/upvote/
```

**Authentication:** `Bearer Token`

**Response (200 OK):**
```json
{
  "status": "vote processed",
  "upvoted": true,
  "count": 1
}
```

---

## 📸 Image Management

### **Upload Technique Image**

```http
POST /api/technique-images/upload_image/
```

**Authentication:** `Bearer Token`  
**Content-Type:** `multipart/form-data`

**Request Body:**
```
technique: 1
image: <image_file>
caption: "Step 1: Installation process"
order: 1
type: "step"
```

**Response (201 Created):**
```json
{
  "id": 1,
  "image": "/media/technique_images/drip-irrigation-system/1_installation.jpg",
  "caption": "Step 1: Installation process",
  "order": 1,
  "type": "step"
}
```

### **Add Image to Technique**

```http
POST /api/techniques/{id}/add_image/
```

**Authentication:** `Bearer Token`  
**Content-Type:** `multipart/form-data`

### **Get Technique Images**

```http
GET /api/techniques/{id}/get_images/
```

**Authentication:** `Bearer Token`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "image": "/media/technique_images/step1.jpg",
    "caption": "Installation step 1",
    "order": 1,
    "type": "step"
  },
  {
    "id": 2,
    "image": "/media/technique_images/result.jpg",
    "caption": "Final result",
    "order": 2,
    "type": "result"
  }
]
```

---

## ❌ Error Handling

### **Common HTTP Status Codes**

| Status Code | Description |
|-------------|-------------|
| `200` | **OK** - Request successful |
| `201` | **Created** - Resource created successfully |
| `204` | **No Content** - Resource deleted successfully |
| `400` | **Bad Request** - Invalid request data |
| `401` | **Unauthorized** - Authentication required |
| `403` | **Forbidden** - Insufficient permissions |
| `404` | **Not Found** - Resource not found |
| `500` | **Internal Server Error** - Server error |

### **Error Response Format**

```json
{
  "status": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Error message for this field"]
  }
}
```

### **Authentication Errors**

```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid",
  "messages": [
    {
      "token_class": "AccessToken",
      "token_type": "access",
      "message": "Token is invalid or expired"
    }
  ]
}
```

### **Validation Errors**

```json
{
  "status": false,
  "message": "Registration failed",
  "errors": {
    "email": ["This field is required."],
    "password": ["This field is required."]
  }
}
```

---

## 📊 Response Formats

### **Pagination**

For list endpoints, responses include pagination metadata:

```json
{
  "count": 25,
  "next": "http://localhost:8000/api/techniques/?page=2",
  "previous": null,
  "results": [
    // ... array of objects
  ]
}
```

### **Filtering & Search**

Most list endpoints support filtering and search:

```http
GET /api/techniques/?search=irrigation&categories__id=1&impact=high
GET /api/forum-threads/?type=discussion
GET /api/users/?search=john
```

### **Ordering**

Use the `ordering` parameter to sort results:

```http
GET /api/techniques/?ordering=-created_on
GET /api/techniques/?ordering=title
GET /api/forum-threads/?ordering=-last_activity_at
```

### **Field Selection**

Some endpoints support field selection to optimize response size:

```http
GET /api/techniques/?fields=id,title,summary
```

---

## 🔧 Rate Limiting

- **Authenticated users**: 1000 requests per hour
- **Anonymous users**: 100 requests per hour
- **Login attempts**: 5 attempts per 15 minutes per IP

---

## 📝 Notes

1. **Authentication**: Most endpoints require authentication except registration, login, and some read-only forum endpoints.

2. **Permissions**: Users can only edit/delete their own content unless they have admin privileges.

3. **File Uploads**: Use `multipart/form-data` content type for file uploads.

4. **Slugs**: Forum threads use slugs in URLs instead of IDs for SEO-friendly URLs.

5. **Timestamps**: All timestamps are in ISO 8601 format with UTC timezone.

6. **Image URLs**: All image URLs are relative and should be prefixed with the base URL.

---

<div align="center">
  
  ### 🌊 *JalWiKi API - Empowering Water Conservation Through Technology* 🌊
  
  **© 2025 JalWiKi Project. All rights reserved.**
  
  *Made with ❤️ by [Avishkar Patil](mailto:itsaitsavipatil@gmail.com)*
  
</div>