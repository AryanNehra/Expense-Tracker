# 💰 Expense Tracker App

A full-stack Expense Tracker app built with **React**, **Node.js**, **Express**, and **MongoDB** to help you track your spending, visualize your habits, and stay on budget — all while keeping your data **private and secure**.

---

## 🔗 Live Demo

- 🌐 **Frontend (Vercel)**: [https://expense-tracker-beta-lemon.vercel.app](https://expense-tracker-beta-lemon.vercel.app)
- 🖥️ **Backend (Render)**: [https://expense-tracker-api-itto.onrender.com](https://expense-tracker-api-itto.onrender.com)

---

## 🔧 Tech Stack

- ⚛️ **Frontend**: React + Vite
- 🧠 **State Management**: useState, useEffect
- 🎨 **Styling**: Tailwind CSS
- 🌐 **Backend**: Node.js + Express
- 🗄️ **Database**: MongoDB + Mongoose

---

## 🔐 Security & Uploads

- 🔒 **Password Hashing**: `bcrypt` for safely hashing user passwords.
- 🛡️ **Authentication**: JWT (JSON Web Tokens) for secure session management.
- 🧊 **Encryption**: `crypto` module to encrypt sensitive expense data before storing it in the database.
- 📤 **Image Uploads**: 
  - `Multer` for handling file uploads.
  - `Cloudinary` for cloud storage and optimization.
  - `multer-storage-cloudinary` for seamless integration.

---

## 🚀 Features

- ➕ Add, edit, and delete expenses
- 📊 Pie & line charts for category and monthly insights
- 💼 Track total income, expense, and current balance
- 🔍 Filter by category/date and search expenses
- 🧾 Export expenses as CSV
- 💡 Set & monitor monthly budget
- 🧑 Profile with image upload (stored securely in Cloudinary)
- 🔐 Field-level encryption for data privacy

---

## 🧪 Environment Variables

Create a `.env` file in `/backend`:

```env
PORT=3000
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 💻 Getting Started

### 🔙 Backend Setup

```bash
cd backend
npm install
npm start
```

### 🔜 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Folder Structure

```
.
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── utils
└── frontend
    ├── src
      ├── components
      ├── pages
      └── api
```


## 📜 License

MIT © 2025 Aryan Nehra(https://github.com/AryanNehra)

---

## 🙌 Acknowledgments

- Vercel & Render for free hosting
- Cloudinary for seamless image storage
- Tailwind CSS for elegant UI
