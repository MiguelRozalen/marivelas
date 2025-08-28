// src/config/candle-options.ts
import catalogData from '@/config/catalog.json';

export interface CandleColorOption {
  name: string; // User-friendly name, e.g., "Rojo Clásico"
  value: string; // Unique value for forms/params, e.g., "rojo"
  hexColor: string; // Hex color code for display, e.g., "#dc2626"
}

export interface CandleScentOption {
  name: string;
  value: string;
  hexColor: string;
}

export const AVAILABLE_CANDLE_COLORS: CandleColorOption[] = catalogData.availableColors;
export const AVAILABLE_CANDLE_SCENTS: CandleScentOption[] = catalogData.availableScents;
