from typing import Literal, Optional
from fastapi import APIRouter, HTTPException
from services.sensor_service import check_for_real_sensor, retrieve_data_in_range

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
    time_range: Literal["Day", "Week", "Month", "3 month"] = "day",
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    # print(f"✅ SENSOR ROUTE HIT")
    # print(f"   sensor_id: {sensor_id}")
    # print(f"   time_range: {time_range}")
    # print(f"   start_date: {start_date}")
    # print(f"   end_date: {end_date}")
    real_sensor = check_for_real_sensor(sensor_id)
    if real_sensor:
        data = retrieve_data_in_range(time_range=time_range, sensor_id=sensor_id, start_date=start_date, end_date=end_date)
        print(data)
        return data
    else:
        raise HTTPException(
            status_code=404,
            detail=f'Sensor with ID {sensor_id} not found'
        )
    # Return mock data for now
  
    