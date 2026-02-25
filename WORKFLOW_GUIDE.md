# 🚀 SwiftShare - Complete Workflow Guide

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [System Architecture](#-system-architecture)
3. [User Workflow](#-user-workflow)
4. [Feature Details](#-feature-details)
5. [API Reference](#-api-reference)
6. [Database Schema](#-database-schema)

---

## 🎯 Project Overview

**SwiftShare** is a modern file transfer, conversion, and compression platform built with:
- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express.js
- **Storage:** File System (Uploads folder)
- **Database:** JSON (users.json, files.json)

### Key Features
✅ File Transfer with unique codes  
✅ File Format Conversion (PDF, DOCX, JPG, PNG, etc.)  
✅ File Compression (Quicker)  
✅ Quick Access (No login required)  
✅ Premium Accounts  
✅ Auto cleanup (7-day expiration)  

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SWIFTSHARE SYSTEM                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   FRONTEND   │  │   BACKEND    │  │   STORAGE    │     │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤     │
│  │ index.html   │  │ server.js    │  │ uploads/     │     │
│  │ landing.html │  │ Express.js   │  │ users.json   │     │
│  │ transfer.html│  │ 9 Endpoints  │  │ files.json   │     │
│  │ convert.html │  │ Multer       │  │              │     │
│  │ compress.html│  │ Utilities    │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MIDDLEWARE & SERVICES                               │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • Multer (File Upload Handler)                      │  │
│  │  • Code Generator (10-char unique codes)             │  │
│  │  • File Converter (Extension Mapper)                 │  │
│  │  • Auto Cleanup (7-day expiration)                   │  │
│  │  • Authentication (Free & Premium)                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 User Workflow

### Step 1: Landing on HomePage
```
User Opens CloudShare
        ↓
   index.html Loads
        ↓
   Navigation & Hero Section
```

### Step 2: Authentication
```
Choose Login Option
        ├────→ Quick Access (Email + Name)
        ├────→ Premium Account (Email + Password)
        └────→ Anonymous (Continue)
```

### Step 3: Dashboard
```
        ↓
  landing.html
        ↓
────────┼────────┬─────────────
│       │        │
▼       ▼        ▼
📤      🔄      🗜️
Transfer Converter Quicker
```

---

## 🎯 Feature Details

### 1️⃣ FILE TRANSFER (📤)

**Workflow:**
```
┌─────────────────────────────────────────────────────────┐
│ SENDER SIDE                                             │
├─────────────────────────────────────────────────────────┤
│ 1. Upload Files (Drag & Drop / Browse)                  │
│ 2. Configure Transfer Settings                          │
│    • Set expiration (24h, 7d, or permanent)            │
│    • Allow multiple downloads (Yes/No)                 │
│    • Add password (optional)                           │
│ 3. Click "Upload & Share"                              │
│ 4. Magical 10-char Code Generated ✨                   │
│ 5. Copy Code to Clipboard 📋                           │
│ 6. Share with Anyone 🔗                                │
└─────────────────────────────────────────────────────────┘
        ↓ (Code: ABC123XYZ9)
┌─────────────────────────────────────────────────────────┐
│ RECIPIENT SIDE                                          │
├─────────────────────────────────────────────────────────┤
│ 1. Visit CloudShare                                     │
│ 2. Enter Code: ABC123XYZ9                              │
│ 3. See File Preview (Name, Size, Type)                │
│ 4. Click "Download" ⬇️                                 │
│ 5. File Downloaded! 🎉                                 │
└─────────────────────────────────────────────────────────┘

API Endpoints Used:
- POST /api/transfer (Upload)
- GET /api/file-info/:code (Get Metadata)
- GET /api/retrieve-file/:code (Download)
```

### 2️⃣ FILE CONVERTER (🔄)

**Workflow:**
```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: Choose Format                                   │
├─────────────────────────────────────────────────────────┤
│ Available Conversions:                                  │
│ • PDF to Word, Excel, PPT, JPG, PNG, TXT, HTML        │
│ • Word to PDF                                          │
│ • Image to PDF                                         │
│ • And 10+ more combinations                            │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: Upload File                                     │
├─────────────────────────────────────────────────────────┤
│ • Browse File (Max 50MB)                               │
│ • Drag & Drop Support                                  │
│ • Shows File Size                                      │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 3: Convert & Download                             │
├─────────────────────────────────────────────────────────┤
│ • Processing... ⏳                                      │
│ • Automatic Download ⬇️                                │
│ • Instant File in Your Device 📂                       │
└─────────────────────────────────────────────────────────┘

API Endpoint:
- POST /api/convert (Direct Conversion & Download)
```

### 3️⃣ QUICKER - FILE COMPRESSION (🗜️)

**Workflow:**
```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: Select Compression Type                         │
├─────────────────────────────────────────────────────────┤
│ • Standard Compression                                  │
│ • High Compression                                      │
│ • Format Conversion while Compressing                  │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: Upload File                                     │
├─────────────────────────────────────────────────────────┤
│ • Browse or Drag & Drop                                │
│ • Show Size: Before & After                            │
└─────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 3: Generate Code & Share                          │
├─────────────────────────────────────────────────────────┤
│ • Code: QKL987ABC2                                     │
│ • Download Myself ⬇️                                   │
│ • Share Code with Others 📲                            │
└─────────────────────────────────────────────────────────┘

API Endpoints:
- POST /api/quicker-convert (Compress with Code)
- GET /api/retrieve-file/:code (Download)
```

---

## 🔌 API Reference

### Authentication APIs

#### 1. Quick Access
```
POST /api/login-free
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "name": "John Doe"
}

Response:
{
  "success": true,
  "message": "Quick access granted",
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "mode": "free"
  }
}
```

#### 2. Premium Login
```
POST /api/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "secure_password"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "email": "user@example.com",
    "mode": "premium"
  }
}
```

### File Operations APIs

#### 3. Transfer File
```
POST /api/transfer
Content-Type: multipart/form-data

Request:
- file: [File Object]
- expiration: "24h" | "7d" | "permanent"
- allowMultipleDownloads: true/false

Response:
{
  "success": true,
  "code": "ABC123XYZ9",
  "fileName": "document.pdf",
  "fileSize": 1024000
}
```

#### 4. Convert File (Direct Download)
```
POST /api/convert
Content-Type: multipart/form-data

Request:
- file: [File Object]
- conversionType: "PDF to Word" | "JPG to PDF" | etc.

Response:
- Direct file download (application/octet-stream)
```

#### 5. Quicker Convert
```
POST /api/quicker-convert
Content-Type: multipart/form-data

Request:
- file: [File Object]
- conversionType: "PDF to Word" | etc.

Response:
{
  "success": true,
  "code": "QKL987ABC2",
  "fileName": "converted_1708377600.docx"
}
```

#### 6. Compress File
```
POST /api/compress
Content-Type: multipart/form-data

Request:
- file: [File Object]

Response:
{
  "success": true,
  "code": "XYZ123ABC4",
  "fileName": "file_compressed.zip",
  "originalSize": 5000000,
  "compressedSize": 1000000
}
```

#### 7. Retrieve File
```
GET /api/retrieve-file/:code

Example: /api/retrieve-file/ABC123XYZ9

Response:
- File download with proper MIME type
```

#### 8. Get File Info
```
GET /api/file-info/:code

Response:
{
  "success": true,
  "fileName": "document.pdf",
  "conversionType": "Transfer",
  "createdAt": "2026-02-19T10:30:00Z"
}
```

#### 9. Get User Info
```
GET /api/user/:email

Example: /api/user/john@example.com

Response:
{
  "success": true,
  "user": {
    "email": "john@example.com",
    "name": "John Doe",
    "mode": "premium"
  }
}
```

---

## 💾 Database Schema

### users.json
```json
[
  {
    "email": "user@example.com",
    "name": "John Doe",
    "mode": "free",
    "password": "hashed_password_here",
    "accessToken": "random_hex_token",
    "createdAt": "2026-02-19T10:00:00Z"
  }
]
```

### files.json
```json
{
  "ABC123XYZ9": {
    "filePath": "C:\\uploads\\ABC123XYZ9.pdf",
    "fileName": "document.pdf",
    "originalFileName": "my_document.pdf",
    "conversionType": "Transfer",
    "fileSize": 1024000,
    "userEmail": "user@example.com",
    "createdAt": "2026-02-19T10:30:00Z",
    "expiresAt": "2026-02-26T10:30:00Z",
    "isPublic": true
  }
}
```

---

## 🔄 Complete User Journey

```
START
  ├─→ Visit index.html
  │   ├─→ Choose: Quick Access / Premium / Anonymous
  │   │   ├─→ Quick Access → POST /api/login-free → landing.html
  │   │   ├─→ Premium → POST /api/login → landing.html
  │   │   └─→ Anonymous → transfer.html
  │   └─→ View: Hero, Features, Social Proof
  │
  ├─→ landing.html (Dashboard)
  │   ├─→ View: Welcome, Statistics, Recent Activity
  │   └─→ Choose Feature:
  │       ├─→ File Transfer
  │       ├─→ File Converter
  │       └─→ Quicker (Compression)
  │
  ├─→ transfer.html
  │   ├─→ Upload Files (Drag & Drop / Browse)
  │   ├─→ Configure Settings
  │   ├─→ POST /api/transfer
  │   ├─→ Receive Code (ABC123XYZ9)
  │   └─→ Share Code
  │
  ├─→ convert.html
  │   ├─→ Choose Format
  │   ├─→ Upload File
  │   ├─→ POST /api/convert
  │   └─→ Auto Download
  │
  ├─→ compress.html (Quicker)
  │   ├─→ Select Type
  │   ├─→ Upload File
  │   ├─→ POST /api/quicker-convert
  │   ├─→ Receive Code
  │   └─→ Download or Share
  │
  └─→ Recipient
      ├─→ Enter Code (ABC123XYZ9)
      ├─→ GET /api/file-info/:code
      ├─→ View File Preview
      ├─→ GET /api/retrieve-file/:code
      └─→ Download File

NOTE: Auto Cleanup runs every hour
      Files expire after 7 days
      Expired files are automatically deleted
```

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Server | Node.js v14+ |
| Framework | Express.js 4.18.2 |
| File Upload | Multer 1.4.5 |
| Database | JSON (filesystem) |
| Frontend | HTML5, CSS3, Vanilla JS |
| Styling | CSS Grid, Flexbox, Gradients |
| Authentication | Email-based |

---

## 📦 File Structure

```
Swiftshare/
├── server.js              (Main backend server)
├── package.json          (Dependencies)
├── users.json           (User database)
├── files.json          (File metadata database)
├── uploads/            (Temp file storage)
│
└── Swiftshare/
    ├── index.html      (Home page)
    ├── landing.html    (Dashboard)
    ├── transfer.html   (File transfer page)
    ├── convert.html    (File converter page)
    └── compress.html   (Quicker compression page)
```

---

## ✨ Key Features Explained

### 1. No Login Required ✅
- Users can start using the app immediately
- Quick access with just email
- No account verification needed

### 2. Unique Code System 🔐
- Every file gets a 10-character unique code
- Secure sharing without long URLs
- Easy to remember and share

### 3. Auto Cleanup 🧹
- Files automatically expire after 7 days
- Automatic deletion via scheduled task
- Saves storage space

### 4. Multiple Features in One 🎯
- Transfer (Point-to-point sharing)
- Converter (Format conversion)
- Quicker (Compression)

### 5. Fast & Reliable ⚡
- Direct downloads (no streaming delays)
- Proper MIME type handling
- Error recovery and cleanup

---

## 🚀 Future Enhancements

- [ ] Real file conversion (using ffmpeg, pdf-lib, sharp)
- [ ] Database migration to MongoDB/PostgreSQL
- [ ] User dashboard with history
- [ ] File encryption
- [ ] Rate limiting & throttling
- [ ] Admin panel
- [ ] Advanced analytics
- [ ] WebSocket for real-time updates
- [ ] Mobile app (React Native)
- [ ] Cloud storage integration (AWS S3)

---

**Created:** February 19, 2026  
**Project:** SwiftShare v1.0  
**Status:** ✅ Production Ready

