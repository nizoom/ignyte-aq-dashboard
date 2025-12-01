from typing import Literal, Optional
from fastapi import APIRouter, HTTPException
from services.sensor_service import check_for_real_sensor

router = APIRouter()

# Test route - NO dependencies, NO response models
@router.get("/test")
def test():
    print("✅ TEST ROUTE HIT")
    return {"status": "success", "message": "Test route working"}

# Simple sensor route - minimal dependencies
@router.get("/{sensor_id}")
def get_sensor_data(
    sensor_id: str,
    time_range: Literal["day", "week", "month", "3 month"] = "day",
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    print(f"✅ SENSOR ROUTE HIT")
    print(f"   sensor_id: {sensor_id}")
    print(f"   time_range: {time_range}")
    print(f"   start_date: {start_date}")
    print(f"   end_date: {end_date}")
    check_for_real_sensor(sensor_id)
    
    # Return mock data for now
    return {
        "sensor_id": sensor_id,
        "time_range": time_range,
        "start_date": start_date,
        "end_date": end_date,
        "dataset": {
            "timestamps": ["2024-01-01T00:00:00"],
            "pm25": [12.5],
            "pm10": [25.0]
        }
    }