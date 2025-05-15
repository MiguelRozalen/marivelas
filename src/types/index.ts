
import type { CandleColorOption } from "@/config/candle-options";

export interface Candle {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  dataAiHint: string;
  description?: string;
}

export interface CartItemType {
  id: string; // Unique ID for the cart item, e.g., candle.id + color.value
  candle: Candle;
  color: CandleColorOption;
  quantity: number;
}

export type PackagingType = "none" | "standard" | "premium";

export interface OrderCosts {
  packagingCost: number;
  shippingCost: number;
  subtotal: number;
  total: number;
}
