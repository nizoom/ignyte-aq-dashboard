from pydantic import BaseModel, Field, computed_field
from typing import List, Dict, Literal, Optional
from datetime import datetime

class AirQualityRecord(BaseModel):
    """
    Represents a single snapshot of air quality and sensor readings.
    """
    timestamp: datetime
    temp: float = Field(..., description="Temperature in degrees Celsius.")
    hum: float = Field(..., description="Humidity in percentage.")
    batt_soc: float = Field(..., description="Battery State of Charge (%).")
    batt_temp: float = Field(..., description="Battery temperature in degrees Celsius.")
    
    # PM readings (Particulate Matter)
    pm2_5: float = Field(..., description="Concentration of Particulate Matter 2.5 (µg/m³).")
    pm10: float = Field(..., description="Concentration of Particulate Matter 10 (µg/m³).")
    
    # Electrochemical sensor readings (Working Electrode)
    no2_we: float = Field(..., description="NO2 Working Electrode reading (mV).")
    ox_we: float = Field(..., description="Oxidizing Gas Working Electrode reading (mV).")


# ----------------------------------------------------------------------
# 2. Air Quality Dataset (Equivalent to AirQualityDataset)
# ----------------------------------------------------------------------

class AirQualityDataset(BaseModel):
    """A collection of air quality records along with dataset metadata."""
    sensor_id: str
    start_date: datetime = Field(..., description="Start timestamp of the data range.")
    end_date: datetime = Field(..., description="End timestamp of the data range.")
    interval: Literal["30min", "hourly", "3H", "6H", "daily", "weekly"] = Field(
        ...,
        description="Aggregation interval of the data records."
    )
    records: List[AirQualityRecord]
    
    @computed_field
    @property
    def count(self) -> int:
        """Actual number of records in the dataset."""
        return len(self.records)

# ----------------------------------------------------------------------
# 3. Air Quality Query Parameters (Equivalent to AirQaulityQueryParams)
# ----------------------------------------------------------------------

class AirQualityQueryParams(BaseModel):
    """
    Defines the parameters for querying historical air quality data.
    Used for request body or URL parameters in a FastAPI route.
    """
    sensor_id: str
    
    # Predefined time range options
    time_range: Literal["Day", "Week", "Month", "3 month"]
    
    # Optional custom range dates (uses Optional or standard | None syntax)
    # The default value of None makes the field optional in FastAPI
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


# ----------------------------------------------------------------------
# 4. Air Quality Statistics (Equivalent to AirQualityStats)
# ----------------------------------------------------------------------

class AirQualityStats(BaseModel):
    """
    Summary statistics calculated over a dataset/time range.
    """
    avg_pm2_5: float
    max_pm2_5: float
    min_pm2_5: float
    avg_temp: float
    
    # Placeholder for other stats
    avg_hum: float
    count: int

# Resnponse object type sent to FE
class AirQualityResponse(BaseModel):
    """Complete API response with dataset and optional statistics."""
    dataset: AirQualityDataset
    stats: Optional[AirQualityStats] = Field(
        None, 
        description="Pre-calculated summary statistics (optional for performance)."
    )
# ----------------------------------------------------------------------
# 5. General Sensor Metadata (Equivalent to GeneralSensorMetaData)
# ----------------------------------------------------------------------

class GeneralSensorMetaData(BaseModel):
    """
    General, non-time-series information about a sensor.
    """
    onlineStatus: bool
    location_name: str
    filename: str
    altitude: float = Field(..., description="Altitude of the sensor in meters.")

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



