# Customer Feedback Visualization - Frontend

This is the frontend application for the Customer Feedback and Sentiment Analysis platform. Built with **React**, this interface allows companies to visualize feedback data, analyze sentiment, and manage survey projects.

## 🧰 Tech Stack

- React
- Axios
- Recharts (for data visualization)
- Tailwind CSS (for styling)
- React Router

## 📦 Installation

```bash
cd frontend
npm install
```

## 🚀 Running the App

```bash
npm start
```

The app will start at: [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

- Company login details are stored in `localStorage` under the key `companyAuth`.
- Bearer tokens are attached to every API request for authentication.

## 🌐 Pages and Features

- **Login/Register**
- **Company Dashboard**
- **Survey Project Management** (create, edit, view)
- **Feedback List**
- **Sentiment Analysis Visualization**
  - Pie, Bar, Line charts
  - Average rating and sentiment trend
  - Top keywords and category breakdown
  - Export to PDF, CSV, and Image

## 📁 Folder Structure

```
components/
  └─ ui/               # UI elements (buttons, modals, etc.)
  └─ route/            # Page routing
  └─ form/             # Form components
pages/
  └─ company/          # Company dashboard and related pages
```

## ⚙️ Environment Variables

Create a `.env` file:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## 📤 Export Options

The Visualization page supports exporting charts and data as:

- 📄 PDF
- 📁 CSV
- 🖼️ Image (PNG)

---

### 📬 Feedback

Feel free to suggest improvements or report issues.


# Customer Feedback Visualization - Backend

This is the backend API for the Customer Feedback and Sentiment Analysis project. It handles authentication, survey and feedback management, and sentiment analysis using the `sentiment` npm package.

## 🧰 Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for Authentication
- `sentiment` package for text analysis

## 📦 Installation

```bash
cd backend
npm install
```

## 🚀 Running the Server

```bash
npm run dev
```

Runs the server at: [http://localhost:5000](http://localhost:5000)

## 🔐 Authentication

- JWT-based company authentication
- Protected routes via middleware (`verifyCompany`)

## 📁 API Endpoints

### Company Routes

- `POST /api/company/register`
- `POST /api/company/login`

### Survey Routes

- `GET /api/survey/list`
- `POST /api/survey/create`
- `PUT /api/survey/edit/:id`
- `DELETE /api/survey/:id`

### Feedback Routes

- `GET /api/feedback`
- `DELETE /api/feedback/:id`

### Visualization Route

- `GET /api/visualization?surveyId=...&category=...`
  - Returns average rating, sentiment distribution, top keywords, trend data, and category breakdown.

## 📂 Folder Structure

```
models/
routes/
controllers/
middlewares/
```

## 🌐 Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/feedback-platform
JWT_SECRET=your_jwt_secret_key
```

## 📊 Sentiment Analysis

- Uses the `sentiment` npm package.
- Analyzes comments and suggestions fields.
- Returns counts of positive, neutral, and negative feedback.

---

### 📬 Feedback

PRs and contributions are welcome. Please open an issue for bugs or feature requests.
