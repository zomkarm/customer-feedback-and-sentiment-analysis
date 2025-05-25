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


## 📊 Analyst & Analytics API

These APIs are accessible **only to authenticated Analysts**. Analysts must log in to retrieve a JWT token, which must be included in the `Authorization` header for all protected requests.

---

### 🔐 Analyst Authentication

#### `POST /api/analyst/login`

Authenticate an analyst and receive a JWT token for accessing protected analytics routes.

- **Request Body**:
```json
{
  "email": "analyst@example.com",
  "password": "yourpassword"
}
```

- **Response**:
```json
{
  "token": "your_jwt_token_here"
}
```

- **Usage**: Use this token in the `Authorization` header for all analytics API requests:
```
Authorization: Bearer your_jwt_token_here
```

---

### 📥 `GET /api/analytics/feedbacks`

Fetch detailed feedback data, including associated company and survey information.

- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`

- **Query Parameters** _(optional)_:
  - `companyId`: Filter by company
  - `surveyId`: Filter by survey project
  - `category`: Filter by feedback category
  - `startDate`: ISO date string
  - `endDate`: ISO date string
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

- **Response Example**:
```json
{
  "feedbacks": [
    {
      "companyName": "TechCorp",
      "surveyTitle": "Website Feedback",
      "location": "New York, USA",
      "name": "John Doe",
      "email": "john@example.com",
      "category": "Website",
      "rating": 4,
      "comment": "Great UI!",
      "suggestion": "Add dark mode",
      "recommend": true,
      "submittedAt": "2025-05-24T10:34:00Z"
    }
  ],
  "totalPages": 3,
  "currentPage": 1
}
```

---

### 📈 `GET /api/analytics/summary`

Get summarized feedback insights such as average rating, sentiment breakdown, and category-wise feedback count.

- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`

- **Query Parameters** _(optional)_:
  - `companyId`
  - `surveyId`
  - `startDate`
  - `endDate`

- **Response Example**:
```json
{
  "averageRating": 4.2,
  "totalFeedbacks": 250,
  "sentimentBreakdown": {
    "positive": 160,
    "neutral": 60,
    "negative": 30
  },
  "categorySummary": {
    "Website": 120,
    "Product": 50,
    "Customer Support": 80
  }
}
```

---

### 📤 `GET /api/analytics/export`

Export feedback data in CSV format for offline analysis or use in external tools.

- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`

- **Query Parameters** _(optional)_:
  - `companyId`
  - `surveyId`
  - `startDate`
  - `endDate`

- **Response**:
  - A downloadable `.csv` file containing feedback details including:
    - `Company Name`, `Survey Title`, `User Name`, `Email`, `Category`, `Rating`, `Comment`, `Suggestion`, `Recommend`, `Location`, `Submitted Date`

---

### 🔐 Access Control Notes

- All `/api/analytics/...` routes are protected.
- Only users with valid Analyst credentials can access them.
- You must use the JWT token obtained from `/api/analyst/login` in the `Authorization` header as:
```
Au
