from datetime import datetime
# from models.sensor import SensorReading, SensorHistory, DailyAQI
import os
from typing import List

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