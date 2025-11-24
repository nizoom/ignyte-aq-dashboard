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
    name: str
