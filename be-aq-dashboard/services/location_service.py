from models.models import AggMetaData, IndMetaData
from data.location_data import ind_spatial_data, agg_spatial_data
from typing import Dict, List

def sensor_locations() -> Dict[str, List[AggMetaData | IndMetaData]]:
    location_dict = {
        'ind_spatial_data': ind_spatial_data,
        'agg_spatial_data': agg_spatial_data
    }

    return location_dict


