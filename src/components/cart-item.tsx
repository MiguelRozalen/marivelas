
// src/components/cart-item.tsx
"use client";

import type { CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle, MinusCircle } from 'lucide-react'; // Changed XCircle to Trash2
import { useContext } from 'react';
import { CartContext } from '@/context/cart-context';
import Link from 'next/link';
import ImageCarousel from './image-carousel'; 

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useContext(CartContext);

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b bg-card rounded-lg shadow mb-4 gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative h-24 w-24 rounded-md overflow-hidden bg-muted/50">
          <ImageCarousel
            imageUrls={item.candle.imageUrls}
            altText={item.candle.name}
            dataAiHint={item.candle.dataAiHint}
            aspectRatio="aspect-square" 
            placeholderDimensions="96x96"
          />
        </div>
        <div className="flex-grow">
          <Link href={`/#catalog`} passHref> 
            <h3 className="text-lg font-semibold text-card-foreground hover:text-primary">{item.candle.name}</h3>
          </Link>
          <div className="flex items-center my-1">
            <span className="text-sm text-muted-foreground mr-2">Color:</span>
            <span 
              className="h-5 w-5 rounded-full border" 
              style={{ backgroundColor: item.color.hexColor }}
              title={item.color.name}
            ></span>
            <span className="ml-2 text-sm text-muted-foreground">{item.color.name}</span>
          </div>
          <div className="flex items-center my-1">
            <span className="text-sm text-muted-foreground mr-2">Aroma:</span>
            <span 
              className="h-5 w-5 rounded-full border" 
              style={{ backgroundColor: item.scent.hexColor }}
              title={item.scent.name}
            ></span>
            <span className="ml-2 text-sm text-muted-foreground">{item.scent.name}</span>
          </div>
          <p className="text-sm text-muted-foreground">Precio unitario: €{item.candle.price.toFixed(2)}</p>
        </div>
      </div>

      {/* Action controls: Quantity, Price, Remove button */}
      <div className="flex flex-row items-center justify-between w-full mt-4 sm:mt-0 sm:w-auto sm:justify-end sm:gap-6 gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Reducir cantidad">
            <MinusCircle className="h-5 w-5" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                    handleQuantityChange(val);
                }
            }}
            min="1"
            className="w-12 sm:w-16 text-center"
            aria-label={`Cantidad para ${item.candle.name}`}
          />
          <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.quantity + 1)} aria-label="Aumentar cantidad">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-lg font-semibold text-primary text-center sm:min-w-[80px]">
          €{(item.candle.price * item.quantity).toFixed(2)}
        </p>

        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80" aria-label="Eliminar artículo">
          <Trash2 className="h-5 w-5" /> {/* Changed icon to Trash2 and size */}
        </Button>
      </div>
    </div>
  );
}
