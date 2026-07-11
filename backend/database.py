import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Force Python to read the .env file right now to grab the correct pooler URL
load_dotenv()

# Get the database connection URL from the .env file
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Create the SQLAlchemy engine (The core connection)
# Added pool_pre_ping=True to prevent Supabase connection drops!
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)

# Create a SessionLocal class for database sessions
# Each time we get a request, we create a new session using this class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our database models (UserDB, DestinationDB)
Base = declarative_base()

# Dependency function to get a database session for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()