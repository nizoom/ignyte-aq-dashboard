from fastapi import APIRouter
from models.models import SensorReading, SensorHistory


from services.sensor_service import (
    get_latest_sensor_reading,
    get_sensor_history,
)

router = APIRouter()



@router.get("/{sensor_id}", response_model=SensorReading)
def latest(sensor_id: str):
    return get_latest_sensor_reading(sensor_id)

@router.get("/{sensor_id}/history", response_model=SensorHistory)
def history(sensor_id: str):
    return get_sensor_history(sensor_id)