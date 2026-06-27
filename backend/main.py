from fastapi import FastAPI, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid

# Initialize FastAPI App
app = FastAPI(
    title="Eco Voyage AI API",
    description="Backend API for Eco Voyage AI Travel Recommendations",
    version="1.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing)
# This allows your Next.js frontend (port 3000) to communicate with this FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Allow requests from your Next.js app
    allow_credentials=True,
    allow_methods=["*"], # Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"], # Allow all headers
)

# --- DATA MODELS ---
# Using Pydantic to validate incoming and outgoing data
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

# --- IN-MEMORY DATABASE ---
# For Week 4, we use a simple list. We will replace this with PostgreSQL in Week 5.
destinations_db: List[Destination] = [
    Destination(
        id=str(uuid.uuid4()),
        name="Kerala Backwaters",
        location="Kerala, India",
        eco_score=95,
        description="Sustainable houseboats and nature walks.",
        image_url="kerala.jpg"
    ),
    Destination(
        id=str(uuid.uuid4()),
        name="Spiti Valley",
        location="Himachal Pradesh, India",
        eco_score=90,
        description="Eco-friendly homestays in the high Himalayas.",
        image_url="spiti.jpg"
    )
]

# --- REST API ENDPOINTS ---

# 1. GET List: Retrieve all destinations
@app.get("/api/destinations", response_model=List[Destination], status_code=status.HTTP_200_OK)
async def get_all_destinations():
    return destinations_db

# 2. GET Search: Search destinations by name or location (Must be before /{id} to avoid path conflict)
@app.get("/api/destinations/search", response_model=List[Destination], status_code=status.HTTP_200_OK)
async def search_destinations(q: str = Query(..., description="Search query for name or location")):
    results = [
        dest for dest in destinations_db 
        if q.lower() in dest.name.lower() or q.lower() in dest.location.lower()
    ]
    if not results:
        raise HTTPException(status_code=404, detail="No destinations found matching your search.")
    return results

# 3. GET Single: Retrieve a specific destination by ID
@app.get("/api/destinations/{dest_id}", response_model=Destination, status_code=status.HTTP_200_OK)
async def get_destination(dest_id: str):
    for dest in destinations_db:
        if dest.id == dest_id:
            return dest
    raise HTTPException(status_code=404, detail="Destination not found")

# 4. POST Create: Add a new eco-destination
@app.post("/api/destinations", response_model=Destination, status_code=status.HTTP_201_CREATED)
async def create_destination(dest_in: DestinationCreate):
    new_dest = Destination(id=str(uuid.uuid4()), **dest_in.dict())
    destinations_db.append(new_dest)
    return new_dest

# 5. PUT Update: Modify an existing destination
@app.put("/api/destinations/{dest_id}", response_model=Destination, status_code=status.HTTP_200_OK)
async def update_destination(dest_id: str, dest_update: DestinationCreate):
    for index, dest in enumerate(destinations_db):
        if dest.id == dest_id:
            updated_dest = Destination(id=dest_id, **dest_update.dict())
            destinations_db[index] = updated_dest
            return updated_dest
    raise HTTPException(status_code=404, detail="Destination not found")

# 6. DELETE: Remove a destination
@app.delete("/api/destinations/{dest_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_destination(dest_id: str):
    for index, dest in enumerate(destinations_db):
        if dest.id == dest_id:
            destinations_db.pop(index)
            return
    raise HTTPException(status_code=404, detail="Destination not found")