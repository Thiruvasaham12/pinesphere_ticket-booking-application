Ticket Booking Application
A simplified Movie & Event Ticket Booking System built using modern full-stack technologies.This project demonstrates real-world concepts like authentication, seat booking, caching, background jobs, and admin management.

Tech Stack

🔹 Backend
FastAPI — API framework

PostgreSQL — primary database

SQLAlchemy — ORM

Redis — caching & seat locking

Celery — background task processing

JWT — authentication

🔹 Frontend
React (Vite) — UI

CSS — styling

Features Implemented
 Authentication
User registration

User login using JWT

Admin login support

Event Management
Admin can add movies/events

Store event details:

Title

Location

Date & Time

Total seats

Banner URL

Ticket Booking
Users can:

View movies & events

Select show timings

Choose number of seats

Select seats visually

 Seat Locking (Redis)
Prevents double booking

Temporary seat reservation logic

 Background Jobs (Celery)
Booking confirmation task

Simulated email sending after booking

Reports (Backend Ready)
Total bookings

Event-wise bookings

User booking history

Admin Panel (Implemented)
Admin login:

Email: admin@sample.com
Password: 1234
Admin can:

Add events/movies

Provide banner URL

Control available shows

🧩 Project Structure
ticket-booking-app/

│

├── backend/

│   ├── app/

│   │   ├── api/

│   │   ├── models/

│   │   ├── schemas/

│   │   ├── services/

│   │   ├── core/

│   │   └── tasks.py

│   └── main.py

│

└── frontend/

    └── src/

        ├── components/
        
        ├── pages/
        
        └── services/
⚙️ Setup Instructions
🔹 Backend Setup
1️⃣ Start PostgreSQL
Ensure PostgreSQL is running.

2️⃣ Create Database
CREATE DATABASE ticketdb;
3️⃣ Install dependencies
pip install -r requirements.txt
4️⃣ Run FastAPI
uvicorn app.main:app --reload
API: http://127.0.0.1:8000/docs

🔹 Start Redis
redis-server
🔹 Start Celery Worker
celery -A app.core.celery_app.celery worker --pool=solo --loglevel=info
🔹 Frontend Setup
cd frontend
npm install
npm run dev
App runs at:
👉 http://localhost:5173

🔐 Authentication Flow
User registers → stored in PostgreSQL

User logs in → JWT token issued

Token used for protected routes

🔄 Booking Flow
User selects event

Seat temporarily locked in Redis

Booking saved in PostgreSQL

Celery sends confirmation task

📬 Future Enhancements
Email sending via SMTP

Payment integration

Real-time seat updates (WebSockets)

Admin analytics dashboard

Banner image upload (instead of URL)

🧠 Key Concepts Demonstrated
REST API design

JWT authentication

Redis caching & locking

Background processing with Celery

Full-stack integration

Admin vs User roles

