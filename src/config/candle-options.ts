// src/config/candle-options.ts
export interface CandleColorOption {
  name: string; // User-friendly name, e.g., "Rojo Clásico"
  value: string; // Unique value for forms/params, e.g., "rojo"
  hexColor: string; // Hex color code for display, e.g., "#dc2626"
}

export const AVAILABLE_CANDLE_COLORS: CandleColorOption[] = [
  { name: 'Rojo Clásico', value: 'rojo', hexColor: '#dc2626' }, // red-600
  { name: 'Azul Océano', value: 'azul', hexColor: '#2563eb' }, // blue-600
  { name: 'Verde Bosque', value: 'verde', hexColor: '#16a34a' }, // green-600
  { name: 'Rosa Pastel', value: 'rosa', hexColor: '#fbcfe8' }, // pink-200 (Added Pink)
  { name: 'Beige Arena', value: 'beige', hexColor: '#f5e7c4' }, // Custom beige
  { name: 'Marrón Tierra', value: 'marron', hexColor: '#78350f' }, // amber-800
  { name: 'Blanco Nieve', value: 'blanco', hexColor: '#FFFFFF' },
  { name: 'Negro Ónix', value: 'negro', hexColor: '#000000' },
];
