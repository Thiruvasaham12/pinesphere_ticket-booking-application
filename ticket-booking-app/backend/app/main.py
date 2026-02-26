from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import booking as booking_api
from app.api import event as event_api
from app.api import notifications as notifications_api
from app.api import reports as reports_api
from app.api import show as show_api
from app.api import user as user_api

app = FastAPI()

# CORS (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(user_api.router)
app.include_router(event_api.router)
app.include_router(booking_api.router)
app.include_router(notifications_api.router)
app.include_router(show_api.router)
app.include_router(reports_api.router)


@app.get("/")
def root():
    return {"message": "Ticket Booking API is running"}
