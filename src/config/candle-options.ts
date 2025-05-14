// src/config/candle-options.ts
export interface CandleColorOption {
  name: string; // User-friendly name, e.g., "Rojo Clásico"
  value: string; // Unique value for forms/params, e.g., "rojo"
  hexColor: string; // Hex color code for display, e.g., "#dc2626"
}

export const AVAILABLE_CANDLE_COLORS: CandleColorOption[] = [
  { name: 'Rojo Pastel', value: 'rojo', hexColor: '#fecaca' }, // red-200
  { name: 'Azul Cielo', value: 'azul', hexColor: '#bfdbfe' }, // blue-200
  { name: 'Verde Menta', value: 'verde', hexColor: '#bbf7d0' }, // green-200
  { name: 'Rosa Bebé', value: 'rosa', hexColor: '#fbcfe8' }, // pink-200
  { name: 'Beige Arena', value: 'beige', hexColor: '#f5e7c4' }, // Custom beige
  { name: 'Marrón Claro', value: 'marron', hexColor: '#E5D8CF' }, // Light muted brown/beige
  { name: 'Blanco Nieve', value: 'blanco', hexColor: '#FFFFFF' },
  { name: 'Negro Ónix', value: 'negro', hexColor: '#1f2937' }, // gray-800 (softer than pure black)
];
