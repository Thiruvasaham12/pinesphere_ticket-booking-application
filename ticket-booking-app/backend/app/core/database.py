import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 🔹 Use environment variable or fallback to localhost
DATABASE_URL = os.environ.get(
    "DATABASE_URL", 
    "postgresql://postgres:tejakanaga191919%40@localhost:5432/ticketdb"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
