import pandas as pd
import numpy as np
from models.models import AQICalcData



# | Symbol     | Meaning                                                            |
# | ---------- | ------------------------------------------------------------------ |
# | **C**      | *Your measured pollutant concentration* (e.g., 18 µg/m³ for PM₂.₅) |
# | **C_low**  | The lower concentration breakpoint for the range your C falls in   |
# | **C_high** | The upper concentration breakpoint                                 |
# | **I_low**  | The lower AQI of that range (e.g., 51)                             |
# | **I_high** | The upper AQI (e.g., 100)    

# AQI = (I_high – I_low)/(C_high – C_low) × (C – C_low) + I_low

def calc_aqi(AQICalcData: AQICalcData) -> dict:
    """
    Calculate AQI for each pollutant and return the worst (highest) AQI.
    
    Returns dict with individual AQIs and overall AQI
    """
    breakpoints_df = get_aqi_breakpoints()

    # Cross-sensitivity correction for O3
    # O3 sensor (ox_we) also detects NO2, so subtract NO2 contribution
   # --- Convert raw electrode signals (mV) → approximate ppb ---

#    REDO DUMMY DATA SO YOU DONT NEED TO CORRECT FOR O3 WEIRDNESS
    O3_mv_to_ppb = 0.30
    NO2_mv_to_ppb = 0.20

    ox_ppb = AQICalcData.avg_ox * O3_mv_to_ppb if AQICalcData.avg_ox is not None else None
    no2_ppb = AQICalcData.avg_no2 * NO2_mv_to_ppb if AQICalcData.avg_no2 is not None else None

    # --- Apply cross-sensitivity correction ---
    k = 0.4  # cross-sensitivity factor (dimensionless)
    if ox_ppb is not None and no2_ppb is not None:
        avg_o3_ppb = ox_ppb - (k * no2_ppb)
        avg_o3_ppb = max(avg_o3_ppb, 0)
    else:
        avg_o3_ppb = None

    # --- Convert ppb → ppm for AQI table ---
    avg_o3_ppm = avg_o3_ppb / 1000.0 if avg_o3_ppb is not None else None

    
    pollutants = {
        'PM2.5': AQICalcData.avg_pm2_5,
        'PM10': AQICalcData.avg_pm10,
        'NO2': AQICalcData.avg_no2,
        'O3': avg_o3_ppm,  # Now in ppm
    }
    
    aqi_results = {}
    
    for pollutant_name, concentration in pollutants.items():
        if concentration is None or pd.isna(concentration):
            continue
            
        # Filter to this pollutant's breakpoints
        pollutant_breakpoints = breakpoints_df[
            breakpoints_df['pollutant'] == pollutant_name
        ]
        
        # Find the row where concentration falls in range
        matching_row = pollutant_breakpoints[
            (pollutant_breakpoints['conc_low'] <= concentration) & 
            (pollutant_breakpoints['conc_high'] >= concentration)
        ]
        
        if matching_row.empty:
            # Concentration is above highest breakpoint
            if concentration > pollutant_breakpoints['conc_high'].max():
                # Use the highest range (Hazardous)
                matching_row = pollutant_breakpoints[
                    pollutant_breakpoints['AQI_category'] == 'Hazardous'
                ]
            else:
                # Concentration below minimum (shouldn't happen with 0 start)
                continue
        
        # Extract breakpoint values
        row = matching_row.iloc[0]
        C = concentration
        C_low = row['conc_low']
        C_high = row['conc_high']
        I_low = row['AQI_low']
        I_high = row['AQI_high']
        
        # Calculate AQI using the formula
        # AQI = (I_high – I_low)/(C_high – C_low) × (C – C_low) + I_low
        aqi = ((I_high - I_low) / (C_high - C_low)) * (C - C_low) + I_low
        
        aqi_results[pollutant_name] = {
            'aqi': round(aqi),
            'concentration': C,
            'category': row['AQI_category']
        }
    
    # Overall AQI is the WORST (highest) individual pollutant AQI
    if aqi_results:
        worst_pollutant = max(aqi_results.items(), key=lambda x: x[1]['aqi'])
        overall_aqi = worst_pollutant[1]['aqi']
        dominant_pollutant = worst_pollutant[0]
    else:
        overall_aqi = None
        dominant_pollutant = None
    
    return {
        'overall_aqi': overall_aqi,
        'dominant_pollutant': dominant_pollutant,
        'individual_aqis': aqi_results
    }

def get_aqi_breakpoints():
    rows_pm25 = [
        {
            "pollutant": "PM2.5",
            "AQI_category": "Good",
            "AQI_low": 0,
            "AQI_high": 50,
            "conc_low": 0.0,
            "conc_high": 12.0,
        },
        {
            "pollutant": "PM2.5",
            "AQI_category": "Moderate",
            "AQI_low": 51,
            "AQI_high": 100,
            "conc_low": 12.1,
            "conc_high": 35.4,
        },
        {
            "pollutant": "PM2.5",
            "AQI_category": "Unhealthy for Sensitive Groups",
            "AQI_low": 101,
            "AQI_high": 150,
            "conc_low": 35.5,
            "conc_high": 55.4,
        },
        {
            "pollutant": "PM2.5",
            "AQI_category": "Unhealthy",
            "AQI_low": 151,
            "AQI_high": 200,
            "conc_low": 55.5,
            "conc_high": 150.4,
        },
        {
            "pollutant": "PM2.5",
            "AQI_category": "Very Unhealthy",
            "AQI_low": 201,
            "AQI_high": 300,
            "conc_low": 150.5,
            "conc_high": 250.4,
        },
        {
            "pollutant": "PM2.5",
            "AQI_category": "Hazardous",
            "AQI_low": 301,
            "AQI_high": 500,
            "conc_low": 250.5,
            "conc_high": 500.4,
        },
    ]
    rows_pm10 = [
    {"pollutant": "PM10", "AQI_category": "Good", "AQI_low": 0, "AQI_high": 50, "conc_low": 0, "conc_high": 54},
    {"pollutant": "PM10", "AQI_category": "Moderate", "AQI_low": 51, "AQI_high": 100, "conc_low": 55, "conc_high": 154},
    {"pollutant": "PM10", "AQI_category": "Unhealthy for Sensitive Groups", "AQI_low": 101, "AQI_high": 150, "conc_low": 155, "conc_high": 254},
    {"pollutant": "PM10", "AQI_category": "Unhealthy", "AQI_low": 151, "AQI_high": 200, "conc_low": 255, "conc_high": 354},
    {"pollutant": "PM10", "AQI_category": "Very Unhealthy", "AQI_low": 201, "AQI_high": 300, "conc_low": 355, "conc_high": 424},
    {"pollutant": "PM10", "AQI_category": "Hazardous", "AQI_low": 301, "AQI_high": 500, "conc_low": 425, "conc_high": 604}
    ]
    
    rows_o3 = [
    {"pollutant": "O3", "AQI_category": "Good", "AQI_low": 0, "AQI_high": 50, "conc_low": 0.000, "conc_high": 0.054},
    {"pollutant": "O3", "AQI_category": "Moderate", "AQI_low": 51, "AQI_high": 100, "conc_low": 0.055, "conc_high": 0.070},
    {"pollutant": "O3", "AQI_category": "Unhealthy for Sensitive Groups", "AQI_low": 101, "AQI_high": 150, "conc_low": 0.071, "conc_high": 0.085},
    {"pollutant": "O3", "AQI_category": "Unhealthy", "AQI_low": 151, "AQI_high": 200, "conc_low": 0.086, "conc_high": 0.105},
    {"pollutant": "O3", "AQI_category": "Very Unhealthy", "AQI_low": 201, "AQI_high": 300, "conc_low": 0.106, "conc_high": 0.200},
    {"pollutant": "O3", "AQI_category": "Hazardous", "AQI_low": 301, "AQI_high": 500, "conc_low": 0.201, "conc_high": 0.604},  # high values rarely used
    ]
    rows_no2 = [
    {"pollutant": "NO2", "AQI_category": "Good", "AQI_low": 0, "AQI_high": 50, "conc_low": 0, "conc_high": 53},
    {"pollutant": "NO2", "AQI_category": "Moderate", "AQI_low": 51, "AQI_high": 100, "conc_low": 54, "conc_high": 100},
    {"pollutant": "NO2", "AQI_category": "Unhealthy for Sensitive Groups", "AQI_low": 101, "AQI_high": 150, "conc_low": 101, "conc_high": 360},
    {"pollutant": "NO2", "AQI_category": "Unhealthy", "AQI_low": 151, "AQI_high": 200, "conc_low": 361, "conc_high": 649},
    {"pollutant": "NO2", "AQI_category": "Very Unhealthy", "AQI_low": 201, "AQI_high": 300, "conc_low": 650, "conc_high": 1249},
    {"pollutant": "NO2", "AQI_category": "Hazardous", "AQI_low": 301, "AQI_high": 500, "conc_low": 1250, "conc_high": 2049},
    ]

    breakpoints_df = pd.DataFrame(rows_pm25 + rows_pm10 + rows_o3 + rows_no2)
    return breakpoints_df

