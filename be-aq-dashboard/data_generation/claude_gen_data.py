import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Set random seed for reproducibility
np.random.seed(42)

# Generate timestamps for 3 months with 10-minute intervals
start_date = datetime(2024, 8, 1, 0, 0, 0)
end_date = start_date + timedelta(days=90)
timestamps = pd.date_range(start=start_date, end=end_date, freq='10min')

data = []

for ts in timestamps:
    hour = ts.hour
    
    # Temperature (°F): varies by time of day, 59-95°F range
    temp_base = 77 + 14.4 * np.sin((hour - 6) * np.pi / 12)  # Peak at 2 PM
    temp = temp_base + np.random.normal(0, 3.6)
    temp = np.clip(temp, 59, 95)
    
    # Humidity (%): inversely related to temp, 30-80% range
    hum_base = 60 - 15 * np.sin((hour - 6) * np.pi / 12)
    hum = hum_base + np.random.normal(0, 5)
    hum = np.clip(hum, 30, 80)
    
    # Battery SOC (%): charges during day (6 AM - 6 PM), drains at night
    # Simulate realistic solar charging curve
    if 6 <= hour <= 18:  # Daytime
        # Solar charging rate depends on sun intensity
        sun_intensity = np.sin((hour - 6) * np.pi / 12)
        charge_rate = 3 * sun_intensity  # Up to 3% per 10 min at peak
        batt_change = charge_rate + np.random.normal(0, 0.5)
    else:  # Nighttime
        # Constant drain
        batt_change = -0.8 + np.random.normal(0, 0.2)
    
    # Get previous battery level or start at 70%
    prev_batt = data[-1]['batt_soc'] if data else 70.0
    batt_soc = prev_batt + batt_change
    batt_soc = np.clip(batt_soc, 20, 100)  # Never below 20%, max 100%
    
    # Battery temperature (°F): follows ambient temp but slightly warmer
    batt_temp = temp + 3.6 + np.random.normal(0, 1.8)
    batt_temp = np.clip(batt_temp, 59, 104)
    
    # PM2.5 (μg/m³): higher during rush hours (7-9 AM, 5-7 PM), 5-50 range
    if (7 <= hour <= 9) or (17 <= hour <= 19):
        pm25_base = 30
    else:
        pm25_base = 15
    pm25 = pm25_base + np.random.normal(0, 8)
    pm25 = np.clip(pm25, 5, 50)
    
    # PM10 (μg/m³): typically 1.5-2x PM2.5, 10-80 range
    pm10 = pm25 * 1.7 + np.random.normal(0, 5)
    pm10 = np.clip(pm10, 10, 80)
    
    # NO2 working electrode (mV): higher during traffic hours, 200-400 range
    if (7 <= hour <= 9) or (17 <= hour <= 19):
        no2_base = 320
    else:
        no2_base = 250
    no2_we = no2_base + np.random.normal(0, 30)
    no2_we = np.clip(no2_we, 200, 400)
    
    # OX working electrode (mV): ozone, peaks in afternoon, 250-450 range
    ox_base = 300 + 80 * np.sin((hour - 6) * np.pi / 12)
    ox_we = ox_base + np.random.normal(0, 25)
    ox_we = np.clip(ox_we, 250, 450)
    
    data.append({
        'timestamp': ts,
        'temp': round(temp, 2),
        'hum': round(hum, 2),
        'batt_soc': round(batt_soc, 2),
        'batt_temp': round(batt_temp, 2),
        'pm2.5': round(pm25, 2),
        'pm10': round(pm10, 2),
        'no2_we': round(no2_we, 2),
        'ox_we': round(ox_we, 2)
    })

# Create DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv('sensor_data_3_3months.csv', index=False)

print(f"Generated {len(df)} rows of sensor data")
print(f"\nData summary:")
print(df.describe())
print(f"\nFirst few rows:")
print(df.head(10))
print(f"\nSaved to: sensor_data_3months.csv")