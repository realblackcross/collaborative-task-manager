# 🧩 Collaborative Task Manager

A full-stack **Collaborative Task Management Web Application** that allows users to create, assign, track, and manage tasks in real time with authentication, role-based actions, and live updates.

🔗 **Live App (Frontend)**:
[https://collaborative-task-manager-nu.vercel.app](https://collaborative-task-manager-nu.vercel.app)

🔗 **Backend API**:
[https://collaborative-task-manager-phxp.onrender.com](https://collaborative-task-manager-phxp.onrender.com)

---

## 📌 Project Overview

The **Collaborative Task Manager** is designed to help teams or individuals manage tasks efficiently by:

* Creating tasks with priorities and due dates
* Assigning tasks to other registered users
* Tracking task status (Pending / Completed)
* Viewing who assigned and who is assigned
* Managing tasks securely with authentication
* Supporting real-time updates using WebSockets

This project demonstrates **real-world full-stack development**, including frontend, backend, database design, authentication, deployment, and debugging production issues like CORS.

---

## 🚀 Features

### 🔐 Authentication

* User Registration
* User Login
* JWT-based authentication
* Password hashing using bcrypt

### ✅ Task Management

* Create tasks
* Assign tasks to other users
* Mark tasks as completed
* Delete tasks (creator-only)
* View tasks assigned **to you** or **by you**

### 👥 Collaboration

* Assigned user can see assigned tasks
* Shows:

  * **Assigned To**
  * **Assigned By**

### ⚡ Real-Time Support

* Socket.IO integrated
* Emits events on:

  * Task creation
  * Task assignment
  * Task updates
  * Task deletion

### 🌐 Deployment Ready

* Backend deployed on **Render**
* Frontend deployed on **Vercel**
* PostgreSQL database using **Prisma ORM**

---

## 🛠️ Tech Stack & Usage

### **Frontend**

| Technology             | Usage                   |
| ---------------------- | ----------------------- |
| React + TypeScript     | UI & component logic    |
| Vite                   | Fast build & dev server |
| Inline CSS (JS styles) | Responsive styling      |
| Fetch API              | API communication       |
| Socket.IO Client       | Real-time updates       |

---

### **Backend**

| Technology            | Usage                 |
| --------------------- | --------------------- |
| Node.js               | Runtime               |
| Express.js            | REST API              |
| TypeScript            | Type safety           |
| Prisma ORM            | Database access       |
| PostgreSQL            | Relational database   |
| JWT                   | Authentication        |
| bcrypt                | Password hashing      |
| Socket.IO             | Real-time events      |
| Nodemailer (optional) | Email notifications   |
| CORS                  | Cross-origin security |

---

### **Database**

* PostgreSQL
* Prisma schema with relations:

  * `User`
  * `Task`
* Relations:

  * One user → many created tasks
  * One user → many assigned tasks

---

## 📂 Project Structure

```
collaborative-task-manager/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   ├── pages/
│   │   └── api/
│   ├── package.json
│   └── vite.config.ts
```

---

## ⚙️ Local Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/realblackcross/collaborative-task-manager.git
cd collaborative-task-manager
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

#### Create `.env` file

```env
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
JWT_SECRET=your_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

#### Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev
```

#### Run Backend

```bash
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🌍 Production Deployment

### Backend (Render)

* Build command:

```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

* Start command:

```bash
npm run start
```

* CORS configured to allow:

```ts
http://localhost:5173
https://collaborative-task-manager-nu.vercel.app
```

---

### Frontend (Vercel)

* Framework: **Vite + React**
* API base URL updated to:

```
https://collaborative-task-manager-phxp.onrender.com
```

---

## 📸 Screenshots

Example:

```md
![Login Page](screenshots/login.png)
```

---

## 🧠 Key Learnings

* Handling **CORS issues in production**
* JWT authentication best practices
* Prisma relations & migrations
* Real-time architecture using Socket.IO
* State synchronization between backend & frontend
* Deployment debugging on Render & Vercel

---

## 🔮 Future Improvements

* Proper email verification & password reset
* Notifications panel
* Role-based permissions
* Task comments
* Drag & drop task board
* Pagination & search

---

## 👨‍💻 Author

**Akarsh Tyagi**
Computer Science Engineering (2021–2025)
Full-Stack Developer | React | Node.js | Prisma | PostgreSQL

 
