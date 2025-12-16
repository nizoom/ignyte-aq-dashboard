from datetime import datetime
# from models.sensor import SensorReading, SensorHistory, DailyAQI
import os
from typing import List, Optional
from models.models import AQICalcData, AQIStats, AirQualityResponse, AirQualityRecord, AirQualityStats, AirQualityDataset, BatteryData, BatteryRecord
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

def determine_interval(time_range: str) -> tuple[str, str | None]:
    """Determine aggregation interval and pandas resample rule."""
    interval_map = {
        "Day": ("hourly", "1H"),      # Changed from ("10min", None) to aggregate to hourly
        "Week": ("6H", "6H"),
        "Month": ("1D", "1D"),
        "3 month": ("3D", "3D"),   
    }
    return interval_map.get(time_range, ("30min", "30T"))

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
    
    # Get daily AQI
    aqi_stats = getAQI(time_range_df, start_dt)

    if time_range_df.empty:
        raise ValueError(f"No data found for sensor {sensor_id} in the specified range")
    
    # AGGREGATE DATA - now always aggregates (removed the None check)
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
    
    # Only drop rows where air quality data is missing
    time_range_df = time_range_df.dropna(subset=['pm2.5', 'pm10'])
    
    # Convert to records (rename pm2.5 to pm2_5 for Pydantic)
    time_range_df = time_range_df.rename(columns={'pm2.5': 'pm2_5'})
    records = [AirQualityRecord(**row) for row in time_range_df.to_dict('records')]
    
    # Calculate statistics
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
        interval=interval,
        records=records
    )
    
    print('printing dataset')
   
    # Return response
    return AirQualityResponse(
        dataset=dataset,
        stats=stats,
        AQIStats=aqi_stats
    )

def retrieve_battery_data(sensor_id: str, start_dt: str) -> BatteryData:
    """
    Retrieve battery data for 3 days starting from start_dt, aggregated in 2-hour chunks.
    """
    # Load file
    parent_folder = "agg" if sensor_id.startswith("agg") else "ind"
    file_path = os.path.join(f'data/{parent_folder}', f'{sensor_id}')
    df = pd.read_csv(file_path)
    
    # Parse timestamp
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Parse start date and calculate end date (3 days later)
    start_date = pd.to_datetime(start_dt)
    end_date = start_date + pd.Timedelta(days=3)
    
    # Filter to 3-day range
    df_filtered = df[(df['timestamp'] >= start_date) & (df['timestamp'] <= end_date)]
    
    if df_filtered.empty:
        raise ValueError(f"No battery data found for sensor {sensor_id} in specified range")
    
    # Resample to 2-hour chunks
    df_resampled = df_filtered.set_index('timestamp').resample('2H').agg({
        'batt_soc': 'mean',
        'batt_temp': 'mean',
    }).reset_index()
    
    # Remove NaN rows
    df_resampled = df_resampled.dropna()
    
    # Convert to records
    records = [BatteryRecord(**row) for row in df_resampled.to_dict('records')]
    
    if not records:
        raise ValueError(f"No valid battery data after resampling")
    
    # Find latest record by comparing timestamps
    latest_record = records[0]
    for record in records:
        if record.timestamp > latest_record.timestamp:
            latest_record = record
    
    # Return battery data
    return BatteryData(
        records=records,
        latest_record=latest_record
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


