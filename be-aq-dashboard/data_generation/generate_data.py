import pandas as pd
import numpy as np
from datetime import datetime, timedelta

#Set random seed for repoducability
np.random.seed(42)

#create intervals for timestampes
start_dt = datetime(2025, 8, 1, 0, 0, 0)
end_dt = start_dt + timedelta(days=90)
timestamps = pd.date_range(start=start_dt, end = end_dt, freq='10 min')

data = []

for ts in timestamps:
    # ts
    hour = ts.hour
    # add temp 
        # base + random temp * multiplier for time day 

    # add humidity

    # add soc

    # add batt temp

    # add pm10

    # add pm2.5

    # add no2

    # add ozone

    continue
