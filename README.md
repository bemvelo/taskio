# Taskio
A full-stack to-do application built with FastAPI and React (TypeScript), featuring JWT authentication and a clean minimalist UI.
---
# To run the project in the terminal :

.\taskio.bat

Then open http://localhost:5173

---

## Tech Stack

**Backend** — Python 3, FastAPI, JWT, bcrypt, Uvicorn  
**Frontend** — React, TypeScript, Vite, Axios, React Router

---

## Features

- User registration and login with secure password hashing
- JWT token-based authentication
- Protected dashboard route
- Request and error logging to `app.log`
- Clean, responsive UI — slate and amber design

---

## Getting Started

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create a new account |
| POST | `/login` | Login and receive a token |
| GET | `/protected` | Access protected route |

---

## Project Structure
