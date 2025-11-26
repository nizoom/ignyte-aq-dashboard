from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

class CSVMetaData(BaseModel):
    sensor_id: str
    file_name: str
    
# metadata for aggregated dummy data csv
class AggMetaData(CSVMetaData):
    neighborhood_name: str
    neighborhood_bounds: List[float]


# metadata for individual sensor dummy data csv
class IndMetaData(CSVMetaData):
    address: str
    coords: List[float]
    name: str
    altitude: int

class SensorRecord(BaseModel):
    timestamp: datetime
    temp: float
    hum: float
    state_of_charge: float
    pm2_5: float
    pm10: float
    no2: float
    o3: float 



