from fastapi import APIRouter
from models.models import AggMetaData, IndMetaData
from typing import Dict, List
from services.location_service import sensor_locations

router = APIRouter()




@router.get('/', response_model=Dict[str, List[AggMetaData | IndMetaData]])
def get_spatial_informattion():
    locations_dict = sensor_locations()
    return locations_dict


