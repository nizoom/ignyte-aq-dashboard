import type { AirQualityResponse, BatteryData } from "./types";

// takes all sensor data and returns only battery relavent info
export const filterDataForBatteryDiag = (
  data: AirQualityResponse
): BatteryData => {
  const records = data.dataset.records;
  let latestRecord = records[0];

  const batteryRecords = records.map((record) => {
    const currentLatest: Date = latestRecord.timestamp;
    // is after
    if (record.timestamp > currentLatest) {
      latestRecord = record;
    }
    const data = {
      timestamp: record.timestamp,
      batt_soc: record.batt_soc,
      batt_temp: record.batt_temp,
    };
    return data;
  });

  return { records: batteryRecords, latest_record: latestRecord };
};
