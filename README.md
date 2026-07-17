
# Security Guard Backend API Documentation

---

## Table of Contents
1. [Base URL](#base-url)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Tools Endpoints](#tools-endpoints)
4. [User Endpoints](#user-endpoints)
5. [Admin Endpoints](#admin-endpoints)
6. [Chat Endpoints](#chat-endpoints)
7. [Default Credentials](#default-admin-credentials)

---

## Base URL
All endpoints are relative to:
```
http://localhost:5000/api
```

---

## Authentication Endpoints (`/api/auth`)

### 1. Register User
- **Endpoint**: `POST /auth/register`
- **Description**: Registers a new user account
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "John Doe"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "user": {
      "_id": "669a1b2c3d4e5f67890abcd",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "User"
    }
  }
  ```

### 2. Login User
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticates a user
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "user": {
      "_id": "669a1b2c3d4e5f67890abcd",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "User"
    }
  }
  ```

### 3. Recover Password
- **Endpoint**: `POST /auth/recover`
- **Description**: Recovers a user's password (for demo purposes)
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "name": "John Doe",
    "password": "securepassword123"
  }
  ```

---

## Tools Endpoints (`/api/tools`)

### 1. Analyze Password Strength
- **Endpoint**: `POST /tools/password-analyze`
- **Description**: Analyzes password strength and provides a score
- **Request Body**:
  ```json
  {
    "password": "StrongPass123!",
    "userId": "669a1b2c3d4e5f67890abcd"
  }
  ```
- **Response**:
  ```json
  {
    "score": 5,
    "label": "STRONG",
    "checks": {
      "length": true,
      "upper": true,
      "lower": true,
      "number": true,
      "symbol": true
    }
  }
  ```

### 2. Scan URL for Phishing
- **Endpoint**: `POST /tools/phishing-scan`
- **Description**: Scans a URL for potential phishing indicators
- **Request Body**:
  ```json
  {
    "url": "https://example.com",
    "userId": "669a1b2c3d4e5f67890abcd"
  }
  ```
- **Response**:
  ```json
  {
    "url": "https://example.com",
    "status": "SAFE",
    "score": 5,
    "details": "Scan complete",
    "reasons": []
  }
  ```

### 3. Get System Stats
- **Endpoint**: `GET /tools/stats`
- **Description**: Retrieves current system-wide statistics
- **Response**:
  ```json
  {
    "totalUsers": 10,
    "loginAttempts": 50,
    "successfulLogins": 45,
    "failedLogins": 5,
    "urlsScanned": 100,
    "dangerousUrls": 5,
    "passwordsAnalyzed": 80,
    "systemStatus": "OPTIMAL"
  }
  ```

---

## User Endpoints (`/api/user`)

### 1. Get User Scan History
- **Endpoint**: `GET /user/history/:userId`
- **Description**: Retrieves all scan history for a specific user
- **Response**:
  ```json
  [
    {
      "_id": "669a1b2c3d4e5f67890abce",
      "userId": "669a1b2c3d4e5f67890abcd",
      "type": "phishing",
      "result": {
        "url": "https://example.com",
        "status": "SAFE"
      },
      "createdAt": "2026-07-17T12:00:00.000Z"
    }
  ]
  ```

### 2. Delete Single History Item
- **Endpoint**: `DELETE /user/history/:userId/:id`
- **Description**: Deletes a single scan history item

### 3. Clear All User History
- **Endpoint**: `POST /user/history/:userId/clear`
- **Description**: Clears all scan history for a user

### 4. Update User Profile
- **Endpoint**: `PUT /user/profile/:id`
- **Description**: Updates a user's profile information
- **Request Body**:
  ```json
  {
    "email": "new@example.com",
    "name": "Jane Doe",
    "password": "newpassword123",
    "profilePicture": "data:image/jpeg;base64,..."
  }
  ```

---

## Admin Endpoints (`/api/admin`)

### Users
1. **Get All Users**: `GET /admin/users`
2. **Create User**: `POST /admin/users`
3. **Update User**: `PUT /admin/users/:id`
4. **Delete User**: `DELETE /admin/users/:id` (cannot delete main admin account)

### Activity Logs
1. **Get All Activity Logs**: `GET /admin/logs`
2. **Delete Log Entry**: `DELETE /admin/logs/:id`
3. **Clear All Activity Logs**: `POST /admin/logs/clear`

### Phishing Reports
1. **Get All Phishing Reports**: `GET /admin/phishing-reports`
2. **Delete Report**: `DELETE /admin/phishing-reports/:id`
3. **Clear All Reports**: `POST /admin/phishing-reports/clear`

### Password Stats
1. **Get All Password Stats**: `GET /admin/password-stats`
2. **Delete Stat Entry**: `DELETE /admin/password-stats/:id`
3. **Clear All Password Stats**: `POST /admin/password-stats/clear`

### System Settings
1. **Update System Status**: `PUT /admin/settings`
   ```json
   {
     "systemStatus": "WARNING"
   }
   ```
2. **Reset All System Stats**: `POST /admin/stats/reset`

---

## Chat Endpoints (`/api/chat`)

### 1. Send Message
- **Endpoint**: `POST /chat/send`
- **Description**: Sends a chat message between users
- **Request Body**:
  ```json
  {
    "senderId": "669a1b2c3d4e5f67890abcd",
    "receiverId": "669a1b2c3d4e5f67890abce",
    "senderName": "John Doe",
    "receiverName": "Admin",
    "content": "Hello, I need help!"
  }
  ```

### 2. Get Conversation
- **Endpoint**: `GET /chat/:user1/:user2`
- **Description**: Retrieves all messages between two users

### 3. Get Admin Conversations
- **Endpoint**: `GET /chat/admin/:adminId`
- **Description**: Retrieves a list of all active conversations for an admin

### 4. Mark Messages as Read
- **Endpoint**: `PUT /chat/mark-read/:receiverId/:senderId`
- **Description**: Marks all messages from a sender as read

---

## Default Admin Credentials
- Email: `abdullahiabubakaryusuf170@gmail.com`
- Password: `@habu1234`

---

## How to Start the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (if it doesn't exist) and add your MongoDB URI:
   ```
   MONGO_URI=mongodb://localhost:27017/securityguard
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm run start
   ```
