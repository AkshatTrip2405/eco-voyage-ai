import os
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, status, Query, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import Session
from database import Base, engine, get_db

# --- WEEK 6: SECURITY IMPORTS ---
from passlib.context import CryptContext
from jose import JWTError, jwt
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials # NEW IMPORTS

# --- 1. SQLALCHEMY DATABASE MODEL ---
class DestinationDB(Base):
    __tablename__ = "destinations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    eco_score = Column(Integer)
    description = Column(String)
    image_url = Column(String)

class UserDB(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String) 

Base.metadata.create_all(bind=engine)

# --- WEEK 6: SECURITY CONFIGURATION ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-eco-voyage-key-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 
limiter = Limiter(key_func=get_remote_address)
security = HTTPBearer() # NEW: Extracts the Bearer token from the header

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

# NEW: Security Dependency to protect routes
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing token. You must be logged in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

# --- 2. FASTAPI APP INITIALIZATION ---
app = FastAPI(title="Eco Voyage AI API - Secured", version="3.0.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. PYDANTIC SCHEMAS ---
class DestinationBase(BaseModel):
    name: str
    location: str
    eco_score: int
    description: str
    image_url: Optional[str] = "https://via.placeholder.com/150"

class DestinationCreate(DestinationBase):
    pass

class Destination(DestinationBase):
    id: str
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# --- 4. REST API ENDPOINTS ---

# UPDATED: Added Depends(verify_token) to protect this route!
@app.get("/api/destinations", response_model=List[Destination])
async def get_all_destinations(db: Session = Depends(get_db), current_user: dict = Depends(verify_token)):
    return db.query(DestinationDB).all()

@app.get("/api/destinations/search", response_model=List[Destination])
async def search_destinations(q: str, db: Session = Depends(get_db)):
    results = db.query(DestinationDB).filter(
        (DestinationDB.name.ilike(f"%{q}%")) | (DestinationDB.location.ilike(f"%{q}%"))
    ).all()
    if not results:
        raise HTTPException(status_code=404, detail="No destinations found.")
    return results

@app.get("/api/destinations/{dest_id}", response_model=Destination)
async def get_destination(dest_id: str, db: Session = Depends(get_db)):
    dest = db.query(DestinationDB).filter(DestinationDB.id == dest_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return dest

# UPDATED: Protected this route too!
@app.post("/api/destinations", response_model=Destination, status_code=status.HTTP_201_CREATED)
async def create_destination(dest_in: DestinationCreate, db: Session = Depends(get_db), current_user: dict = Depends(verify_token)):
    new_dest = DestinationDB(id=str(uuid.uuid4()), **dest_in.model_dump())
    db.add(new_dest)
    db.commit()
    db.refresh(new_dest)
    return new_dest

@app.put("/api/destinations/{dest_id}", response_model=Destination)
async def update_destination(dest_id: str, dest_update: DestinationCreate, db: Session = Depends(get_db)):
    db_dest = db.query(DestinationDB).filter(DestinationDB.id == dest_id).first()
    if not db_dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    for key, value in dest_update.model_dump().items():
        setattr(db_dest, key, value)
        
    db.commit()
    db.refresh(db_dest)
    return db_dest

@app.delete("/api/destinations/{dest_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_destination(dest_id: str, db: Session = Depends(get_db)):
    db_dest = db.query(DestinationDB).filter(DestinationDB.id == dest_id).first()
    if not db_dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    db.delete(db_dest)
    db.commit()
    return None

# --- WEEK 6: SECURE AUTH ENDPOINTS ---

@app.post("/api/auth/register")
@limiter.limit("5/minute")
async def register_user(request: Request, user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered. Please sign in.")
    
    hashed_password = get_password_hash(user.password)
    
    new_user = UserDB(id=str(uuid.uuid4()), name=user.name, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    
    return {"message": "User created successfully"}

@app.post("/api/auth/login")
@limiter.limit("5/minute")
async def login_user(request: Request, user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="No account found. Please create an account first.")
    
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Incorrect password. Try again.")
    
    access_token = create_access_token(data={"sub": db_user.email, "name": db_user.name})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "message": "Login successful", 
        "name": db_user.name
    }