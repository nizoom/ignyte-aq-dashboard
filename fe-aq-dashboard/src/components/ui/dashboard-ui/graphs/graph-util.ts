// utils/export_csv.ts
import type {
  AirQualityResponse,
  AirQaulityRecord,
} from "../../../../utils/types";

/**
 * Converts data to CSV format and triggers download
 */
const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format date for CSV
 */
const formatDate = (date: Date): string => {
  return date.toISOString().replace("T", " ").substring(0, 19);
};

/**
 * Export Particulate Matter data to CSV
 */
export const exportPMDataToCSV = (data: AirQualityResponse) => {
  const records = data.dataset.records;

  // CSV header
  const headers = ["Timestamp", "PM2.5 (µg/m³)", "PM10 (µg/m³)"];

  // CSV rows
  const rows = records.map((record: AirQaulityRecord) => {
    return [
      formatDate(new Date(record.timestamp)),
      record.pm2_5.toFixed(2),
      record.pm10.toFixed(2),
    ].join(",");
  });

  // Combine header and rows
  const csvContent = [headers.join(","), ...rows].join("\n");

  // Download
  const filename = `particulate_matter_${
    data.dataset.sensor_id
  }_${Date.now()}.csv`;
  downloadCSV(csvContent, filename);
};

/**
 * Export Gas Pollutants data to CSV
 */
export const exportGasDataToCSV = (data: AirQualityResponse) => {
  const records = data.dataset.records;

  // CSV header
  const headers = ["Timestamp", "NO₂ (mV)", "O₃ (mV)"];

  // CSV rows
  const rows = records.map((record: AirQaulityRecord) => {
    return [
      formatDate(new Date(record.timestamp)),
      record.no2_we.toFixed(2),
      record.ox_we.toFixed(2),
    ].join(",");
  });

  // Combine header and rows
  const csvContent = [headers.join(","), ...rows].join("\n");

  // Download
  const filename = `gas_pollutants_${data.dataset.sensor_id}_${Date.now()}.csv`;
  downloadCSV(csvContent, filename);
};

/**
 * Export all air quality data to CSV
 */
export const exportAllDataToCSV = (data: AirQualityResponse) => {
  const records = data.dataset.records;

  // CSV header
  const headers = [
    "Timestamp",
    "Temperature (°F)",
    "Humidity (%)",
    "Battery SOC (%)",
    "Battery Temp (°F)",
    "PM2.5 (µg/m³)",
    "PM10 (µg/m³)",
    "NO₂ (mV)",
    "O₃ (mV)",
  ];

  // CSV rows
  const rows = records.map((record: AirQaulityRecord) => {
    return [
      formatDate(new Date(record.timestamp)),
      record.temp.toFixed(2),
      record.hum.toFixed(2),
      record.batt_soc.toFixed(2),
      record.batt_temp.toFixed(2),
      record.pm2_5.toFixed(2),
      record.pm10.toFixed(2),
      record.no2_we.toFixed(2),
      record.ox_we.toFixed(2),
    ].join(",");
  });

  // Combine header and rows
  const csvContent = [headers.join(","), ...rows].join("\n");

  // Download
  const filename = `air_quality_data_${
    data.dataset.sensor_id
  }_${Date.now()}.csv`;
  downloadCSV(csvContent, filename);
};
