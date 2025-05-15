# Full Stack App – React + Express.js

This is a full stack application built with:

- **Frontend:** React (Vite or CRA)
- **Backend:** Express.js (Node.js)

## 📁 Project Structure

```
/frontend    → React application
/backend     → Express.js API
```

---

## 🚀 Getting Started

### ✅ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2. Setup Frontend (React)

```bash
cd frontend
npm install      # or yarn install
```

#### Run React Dev Server

```bash
npm run dev      # or yarn dev
```

#### Build React for Production

```bash
npm run build    # or yarn build
```

#### Preview Production Build (optional)

```bash
npm run preview  # or yarn preview
```

---

### 3. Setup Backend (Express.js)

```bash
cd backend
npm install      # or yarn install
```

#### Run Express Server

```bash
npm run dev      # assuming you're using nodemon for development
```

#### Start Production Server

```bash
npm start        # or node index.js / node server.js
```

---

## 🌐 Connecting Frontend and Backend

- The React frontend can make API requests to the Express backend via `http://localhost:PORT`.
- During development, use **proxy settings** in `frontend/vite.config.js` or `package.json` (CRA) to avoid CORS issues.

> Example proxy for CRA (`frontend/package.json`):
```json
"proxy": "http://localhost:5000"
```

> Example proxy for Vite (`frontend/vite.config.js`):
```js
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

---

## 📦 Deployment Notes

- Build frontend using `npm run build` and serve the static files with Express OR deploy separately.
- Make sure to configure `.env` files for production with correct URLs and ports.

---

## 🛠 Tech Stack

- Frontend: React, Vite/CRA, JavaScript
- Backend: Node.js, Express.js, REST API
- Package Manager: npm or yarn

---

## 📝 License

This project is licensed under the MIT License.
