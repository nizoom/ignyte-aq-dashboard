from datetime import datetime
# from models.sensor import SensorReading, SensorHistory, DailyAQI
import os
from typing import List, Optional
from models.models import AQICalcData, AQIStats, AirQualityResponse, AirQualityRecord, AirQualityStats, AirQualityDataset
import pandas as pd
from services.aqi_utils import calc_aqi
# Import AirQualityResponse from its module, or define it here if needed
# from models.sensor import AirQualityResponse

import os
from pathlib import Path

def check_for_real_sensor(sensor_id: str) -> bool:
    # Get absolute path relative to THIS file
    current_dir = Path(__file__).parent
    project_root = current_dir.parent  # Go up to project root
    
    ind_file_path = project_root / "data" / "ind"
    agg_file_path = project_root / "data" / "agg"
    
    print(f"🔍 Looking for sensor_id: {sensor_id}")
    print(f"🔍 Checking paths:")
    print(f"   - {ind_file_path}")
    print(f"   - {agg_file_path}")
    
    all_dataset_names = []
    all_dataset_names.extend(get_file_names(ind_file_path))
    all_dataset_names.extend(get_file_names(agg_file_path))
    
    print(f'📁 ALL DATASET NAMES: {all_dataset_names}')
    
    return sensor_id in all_dataset_names

def get_file_names(folder_path: Path) -> List[str]:
    file_names = []
    
    if not folder_path.exists():
        print(f"⚠️  Path does not exist: {folder_path}")
        return file_names
    
    for file_name in os.listdir(folder_path):
        full_path = folder_path / file_name
        if full_path.is_file():
            file_names.append(file_name)
    
    return file_names

def determine_interval(time_range: str) -> tuple[str, str]:
    """Determine aggregation interval and pandas resample rule."""
    interval_map = {
        "Day": ("hourly", "1H"),
        "Week": ("6H", "6H"),
        "Month": ("daily", "1D"),
        "3 month": ("weekly", "1W"),   
        # 3 DAYS
        # ADD MORE DATA PER AGG 
        # ADD POINTS
        # GAS POLLUTANT UNIT SHOULD BE DIFFERENT 
        # NO2 AND 03 IN  PPB 
        
        # RESEARCHER VIEW HAS ACCESS TO ALL SENSORS AS POINTS 
        # RESEARCHER VIEW HAS ACCESS TO EXPORT 

        # ADD AQI FORMULA
        # ADD SO2 AND CO DISCLAIMER

        # LOGIN SCREEN
        
        # MAP - SENSOR POINT DEPTH 
        
        # DEC 15 PRESENTATIONS
        # DEC 12, FRI REPORT DUE (README / DOCS)
    }
    return interval_map.get(time_range, ("hourly", "1H"))

def retrieve_data_in_range(
    sensor_id: str, 
    time_range: str, 
    start_date: Optional[str], 
    end_date: Optional[str]
) -> AirQualityResponse:
    
    # Determine aggregation based on time range
    interval, resample_rule = determine_interval(time_range)
    
    # Load file
    parent_folder = "agg" if sensor_id.startswith("agg") else "ind"
    file_path = os.path.join(f'data/{parent_folder}', f'{sensor_id}')
    df = pd.read_csv(file_path)
    
    # Parse dates
    start_dt: pd.Timestamp = pd.to_datetime(start_date)
    end_dt = pd.to_datetime(end_date)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Filter time range
    time_range_df = df[(df['timestamp'] >= start_dt) & (df['timestamp'] <= end_dt)]
    
    #get_daily_AQI
    aqi_stats = getAQI(time_range_df, start_dt)

    if time_range_df.empty:
        raise ValueError(f"No data found for sensor {sensor_id} in the specified range")
    
    # AGGREGATE DATA if needed (not for "day" view)
    if interval != "10min":
        time_range_df = time_range_df.set_index('timestamp')
        time_range_df = time_range_df.resample(resample_rule).agg({
            'temp': 'mean',
            'hum': 'mean',
            'batt_soc': 'mean',
            'batt_temp': 'mean',
            'pm2.5': 'mean',
            'pm10': 'mean',
            'no2_we': 'mean',
            'ox_we': 'mean',
        }).reset_index()
        
        # Remove any NaN rows from aggregation
        time_range_df = time_range_df.dropna()
    
    # Convert to records (rename pm2.5 to pm2_5 for Pydantic)
    time_range_df = time_range_df.rename(columns={'pm2.5': 'pm2_5'})
    records = [AirQualityRecord(**row) for row in time_range_df.to_dict('records')]
    
    # Calculate statistics (use original column name until renamed)
    stats = AirQualityStats(
        avg_pm2_5=float(time_range_df['pm2_5'].mean()),
        max_pm2_5=float(time_range_df['pm2_5'].max()),
        min_pm2_5=float(time_range_df['pm2_5'].min()),
        avg_temp=float(time_range_df['temp'].mean()),
        avg_hum=float(time_range_df['hum'].mean()),
        count=len(time_range_df)
    )
    
    # Build dataset
    dataset = AirQualityDataset(
        sensor_id=sensor_id,
        start_date=start_dt,
        end_date=end_dt,
        interval=interval,  # Tell frontend what aggregation was used
        records=records
    )
    
    print('printing dataset')
   
    # Return response
    return AirQualityResponse(
        dataset=dataset,
        stats=stats,
        AQIStats=aqi_stats
    )
    
def getAQI(pre_agg_data, start_dt) -> AQIStats:

    todays_data_pre_agg = pre_agg_data[pre_agg_data['timestamp'] == start_dt]

    calc_data = AQICalcData(
        avg_pm2_5=float(todays_data_pre_agg['pm2.5'].mean()),
        avg_pm10=float(todays_data_pre_agg['pm10'].mean()),
        avg_no2=float(todays_data_pre_agg['no2_we'].mean()),
        avg_ox=float(todays_data_pre_agg['ox_we'].mean())
    )
    
    AQI_stats = calc_aqi(calc_data)
    return AQI_stats


