# Coach Speech - Walkthrough

## Overview
We have successfully built the **FastAPI Backend** and the **Next.js Web Frontend** for the **Coach Speech** application. The codebase is organized directly in the root directory under `backend` and `frontend`.

## Features Delivered
### Backend (FastAPI)
1. **Authentication API**: Endpoints for User Registration `/auth/register` and Login `/auth/login` using JWT tokens.
2. **Situation Generation API**: Implemented the OpenAI API connectivity. The endpoint `/situations/` securely takes context inputs and generates a professional coach response with variations.
3. **Database Setup**: PostgreSQL SQLAlchemy models defined in [models/user.py](file:///d:/Appristine/Anitgravity/CoachSpeach/backend/models/user.py) and [models/situation.py](file:///d:/Appristine/Anitgravity/CoachSpeach/backend/models/situation.py). An [init_db.py](file:///d:/Appristine/Anitgravity/CoachSpeach/backend/init_db.py) script is provided to automatically create the tables.

### Frontend (Next.js)
1. **Redux Store**: Set up global state management handling JWT tokens and fetching the user's situation history.
2. **Beautiful Design**: Used Tailwind CSS to create a premium, glassmorphic UI matching the specification.
3. **Login Page**: Responsive authentication interface.
4. **Dashboard**: Complete situation input form taking Sport Type, Age Group, Parent Behavior, Urgency, Channel, Tone, and Description to automatically generate an AI coach response via the backend API.
5. **Situation History**: A cleanly organized view of past generations.

## How to Run the Application

### 1. Setup Backend
Open a terminal in the `backend` directory:
```bash
cd backend
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate
# Install requirements
pip install -r requirements.txt
```

> [!IMPORTANT]
> You must set up a PostgreSQL database and create a `.env` file in the `backend/` directory by copying [.env.example](file:///d:/Appristine/Anitgravity/CoachSpeach/backend/.env.example).
> You must also add your `OPENAI_API_KEY` to the `.env` file.

Once configured, initialize the database and run the server:
```bash
python init_db.py
uvicorn main:app --reload
```
The API will be running at `http://localhost:8000`

### 2. Setup Frontend
Open a new terminal in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
The Web App will be available at `http://localhost:3000`.

## Validation
- Successfully tested the Next.js `create-next-app` rendering flow and Redux compilation syntax.
- Successfully verified FastAPI package imports and route dependencies matching Next.js HTTP patterns.
