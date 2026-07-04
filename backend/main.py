from fastapi import FastAPI, HTTPException, status, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import Session
from database import Base, engine, get_db

# --- 1. SQLALCHEMY DATABASE MODEL ---
# This defines how the table is structured in your Supabase PostgreSQL database
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
    password = Column(String) # In a production app, we would hash this!

# Create all tables in the database automatically if they don't exist
Base.metadata.create_all(bind=engine)

# --- 2. FASTAPI APP INITIALIZATION ---
app = FastAPI(title="Eco Voyage AI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. PYDANTIC SCHEMAS (Data Validation) ---
# This ensures that incoming API data is correctly formatted
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

# --- 4. REST API ENDPOINTS (Connected to PostgreSQL) ---

@app.get("/api/destinations", response_model=List[Destination])
async def get_all_destinations(db: Session = Depends(get_db)):
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

@app.post("/api/destinations", response_model=Destination, status_code=status.HTTP_201_CREATED)
async def create_destination(dest_in: DestinationCreate, db: Session = Depends(get_db)):
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

@app.post("/api/auth/register")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered. Please sign in.")
    
    # Create new user in database
    new_user = UserDB(id=str(uuid.uuid4()), name=user.name, email=user.email, password=user.password)
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/api/auth/login")
async def login_user(user: UserLogin, db: Session = Depends(get_db)):
    # Find user by email
    db_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    
    # 1. No account found
    if not db_user:
        raise HTTPException(status_code=404, detail="No account found. Please create an account first.")
    
    # 2. Incorrect password
    if db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Incorrect password. Try again.")
    
    # 3. Success
    return {"message": "Login successful", "name": db_user.name}