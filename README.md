# Scalable Voting Website

A real-time, role-based voting platform built with AWS cloud support, Redis, WebSocket, and scalable backend architecture.

## 🚧 Project Status
This project is currently under development.

I am actively building and improving this system with features like candidate registration, OTP verification, real-time admin updates, scalable deployment, and cloud integration.

---

## 📌 Overview

This project is designed as a **scalable online voting platform** where:

- **Candidates and Voters** can register using OTP verification
- **Admins** can approve or reject candidates
- **Voters** can log in and vote securely
- **Real-time updates** are reflected in all dashboard
- The backend is designed to support **multi-server deployment and autoscaling**

---

## ✨ Features

### Authentication & Access
- Role-based login system
- Candidate and Voter registration with OTP verification
- Voter login using OTP
- Secure JWT-based authentication

### Candidate Management
- Candidate registration with photo upload
- Candidate data stored with approval status
- Admin approval / rejection flow
- Rejected candidate photo deletion from AWS S3

### Real-Time Functionality
- Live candidate approval/rejection updates
- Real-time admin dashboard updates using WebSocket
- Distributed event handling with Redis Pub/Sub

### Cloud & Scalability
- AWS EC2 for backend deployment
- AWS S3 for candidate image storage
- Redis for OTP/session/event handling
- Designed for autoscaling and distributed backend support

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB / MongoDB Atlas
- Redis
- Socket.IO
- JWT Authentication
- Multer
- AWS SDK

### Cloud Services
- AWS EC2
- AWS S3
- Redis (external/shared instance)

### Frontend
- HTML
- CSS
- JavaScript

---

## ☁️ System Design / Architecture

### Main Flow
1. Candidate registers with photo, email, and details
2. Backend uploads photo to AWS S3
3. OTP is generated and stored temporarily in Redis
4. After OTP verification, candidate is stored in database with `pending` status
5. Admin dashboard receives real-time update for new pending candidate
6. Admin can approve or reject candidate
7. Approval/rejection is reflected instantly using WebSocket + Redis
8. Approved candidates become visible in the voting system
9. Then voter can vote by logging in
10. Each voter can vote to only one candidate
11. And logout funtionality also enabled 

---

