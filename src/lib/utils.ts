import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Checks if a color is "light" based on its hex value.
 * @param color The hex color string (e.g., "#RRGGBB").
 * @returns True if the color is considered light, false otherwise.
 */
export function isColorLight(color: string): boolean {
  if (!color.startsWith('#')) {
    return true; // Default to light if format is unexpected
  }
  
  // Convert hex to RGB
  const hex = color.slice(1);
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Threshold can be adjusted, but 0.75 is a good starting point for light backgrounds.
  return luminance > 0.75;
}

    