
// src/lib/actions.ts
"use server";

import type { Candle } from "@/types"; 
import { PAGE_SIZE } from "@/config/pagination";
import catalogData from '@/config/catalog.json';
// SELLER_EMAIL is not used here anymore for submitContactForm but might be used elsewhere. Keeping for now.
// import { SELLER_EMAIL } from "@/config/constants"; 


// submitContactForm and ContactFormState are removed as the form is no longer submitted this way.
// The client handles the process after seeing the AlertDialog.

const ALL_CANDLES_DATA: Candle[] = catalogData.candles;

export async function fetchCandles(currentOffset: number): Promise<Candle[]> {
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  const newCandles = ALL_CANDLES_DATA.slice(currentOffset, currentOffset + PAGE_SIZE);
  return newCandles;
}

export async function getTotalCandlesCount(): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return ALL_CANDLES_DATA.length;
}
