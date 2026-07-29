# KucingAbu Personal Hub 🚀

A modern, dynamic, and aesthetic personal portfolio hub built with a focus on premium UI/UX (Glassmorphism & Micro-animations) and a robust backend. This project features a fully functional custom Admin Panel to manage all aspects of the portfolio directly from the web interface.

## 🌟 Key Features

- **Dynamic Bento Grid UI**: A modern and responsive home layout showcasing the user's profile, gaming stats, and tech stack.
- **Media Gallery**: Showcase AI Arts, Cosplay, and Traditional Arts with masonry-style viewing, smart search bar, category dropdowns, and pagination.
- **Gaming Profile Hub**: Track and display in-game User IDs (UID) and nicknames for various games (e.g., Genshin Impact, Honkai Star Rail, Zenless Zone Zero).
- **Secure Vault**: An encrypted notepad within the Admin Panel for storing sensitive credentials.
- **Modular Admin Panel**: A clean, React-based manager to seamlessly Add, Edit, and Delete data. Includes a native **Dashboard Analytics** for real-time tracking. Image uploads are handled automatically via Cloudinary.

## 🔥 Recent Updates (Progress)
- **Admin Dashboard Analytics**: Added a lightning-fast dashboard to monitor total galleries, games, vaults, and category distributions.
- **Gallery Enhancements**: Upgraded the gallery with 4-column grids, pagination, and real-time search functionality.
- **Code Cleanup**: Completely refactored the frontend (fixed code smells) and removed heavy legacy features (e.g., AudioPlayer) to prioritize a minimalist, ultra-fast UI.

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) (Custom Glassmorphism themes)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Routing**: React Router DOM

### Backend
- **Engine**: [Golang](https://go.dev/)
- **Framework**: [Fiber Web Framework](https://gofiber.io/)
- **ORM**: [GORM](https://gorm.io/)
- **Database**: MySQL 
- **Security**: JWT Authentication & Bcrypt Password Hashing
- **Cloud Storage**: [Cloudinary](https://cloudinary.com/) (For direct Image & Audio file hosting)

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- Go (v1.20+ recommended)
- MySQL Database
- Cloudinary Account (for Cloud Storage)

### 1. Backend Setup (Golang)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   go mod tidy
   ```
3. Create a `.env` file in the `backend` folder and configure the following variables:
   ```env
   DB_USER=your_mysql_username
   DB_PASS=your_mysql_password
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=your_database_name

   JWT_SECRET=your_super_secret_jwt_key
   
   CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
   ```
4. Run the server. GORM will automatically migrate and create the necessary tables.
   ```bash
   go run main.go
   ```
   *The backend will typically run on `http://localhost:8080`.*

### 2. Frontend Setup (React)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The frontend will typically run on `http://localhost:5173`.*

---

## 📂 Project Structure

```text
📦 WebPribadi
 ┣ 📂 backend
 ┃ ┣ 📂 handlers     # API endpoint logic (CRUD)
 ┃ ┣ 📂 middleware   # JWT Auth & CORS handling
 ┃ ┣ 📂 models       # Database schema (GORM)
 ┃ ┣ 📂 routes       # API Route definitions
 ┃ ┣ 📂 services     # Cloudinary upload integration
 ┃ ┣ 📜 main.go      # Backend Entry Point
 ┃ ┗ 📜 .env         # Environment variables (Ignored in Git)
 ┃
 ┗ 📂 frontend
   ┣ 📂 public
   ┣ 📂 src
   ┃ ┣ 📂 components # Reusable UI pieces (Navbar, Footer, dsb)
   ┃ ┣ 📂 pages      # Main views (Home, Gallery, Admin)
   ┃ ┃ ┗ 📂 admin    # Modular Admin Manager components
   ┃ ┣ 📂 services   # Axios/Fetch API wrapper (api.js)
   ┃ ┣ 📜 App.jsx    # React Routing & Layout
   ┃ ┗ 📜 index.css  # Global Tailwind styles
```

---

## 🛡️ License
Designed and developed for personal use. All Rights Reserved.