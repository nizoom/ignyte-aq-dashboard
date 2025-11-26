#  dummy spatial data for map 

from typing import List
from models.models import IndMetaData, AggMetaData

# locations for ind sensors 
ind_spatial_data: List[IndMetaData] = [
      IndMetaData(
        sensor_id='ind_1',
        file_name='ind_1.csv',
        address='370 Jay St Brooklyn, NY 11201',
        coords=[-73.987435, 40.692744],
        name="370 Jay St",
        altitude=50  # Add this
    ),
    IndMetaData(
        sensor_id='ind_2',
        file_name='ind_2.csv',
        address='205 Smith St, NY 11201',
        coords=[-73.991340, 40.684879],
        name="205 Smith St",
        altitude=100  # Add this
    ),
    IndMetaData(
        sensor_id='ind_3',
        file_name='ind_3.csv',
        address='5 MetroTech Center, NY 11201',
        coords=[-73.985634, 40.694459],
        name="5 MetroTech",
        altitude=10  # Add this
    ),
] 

agg_spatial_data: List[AggMetaData] = [
    AggMetaData(
        sensor_id='agg_1',
        file_name='agg_1.csv',
        neighborhood_name='Financial District',
        neighborhood_bounds=[-74.015, 40.700, -73.995, 40.720]),
    AggMetaData(
        sensor_id='agg_2',
        file_name='agg_2.csv',
        neighborhood_name='Fort Greene',
        neighborhood_bounds=[-73.985, 40.682, -73.950, 40.705]),
    AggMetaData(
        sensor_id='agg_3',
        file_name='agg_3.csv',
        neighborhood_name='Williamsburg',
        neighborhood_bounds=[-73.975, 40.700, -73.937, 40.735]),
]