from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import sensors, locations


app = FastAPI(  title="Urban Air Quality API",
    version="1.0.0",
    description="Backend powering the Resident & Researcher views")


# CORS for frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(sensors.router, prefix="/sensors", tags=["Sensors"])

app.include_router(locations.router, prefix='/locations', tags=["Locations"])