
// src/components/cart-item.tsx
"use client";

import NextImage from 'next/image';
import type { CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XCircle, PlusCircle, MinusCircle } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { CartContext } from '@/context/cart-context';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

const PLACEHOLDER_CART_IMAGE_URL = "https://placehold.co/96x96.png";

export default function CartItem({ item }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useContext(CartContext);

  const [effectiveImageUrl, setEffectiveImageUrl] = useState(item.candle.imageUrl);
  const [imageKey, setImageKey] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    setEffectiveImageUrl(item.candle.imageUrl);
    setIsImageLoading(true);
    setImageKey(prev => prev + 1);
  }, [item.candle.imageUrl]);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsImageLoading(false);
    const imgElement = event.currentTarget;
    if (imgElement.naturalWidth === 0 && effectiveImageUrl !== PLACEHOLDER_CART_IMAGE_URL) {
      setEffectiveImageUrl(PLACEHOLDER_CART_IMAGE_URL);
      setImageKey(prevKey => prevKey + 1);
    }
  };
  
  const handleImageError = () => {
    setIsImageLoading(false);
    if (effectiveImageUrl !== PLACEHOLDER_CART_IMAGE_URL) {
      setEffectiveImageUrl(PLACEHOLDER_CART_IMAGE_URL);
      setImageKey(prevKey => prevKey + 1);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b bg-card rounded-lg shadow mb-4 gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-md overflow-hidden bg-muted/50">
          {isImageLoading && (
            <Skeleton className="absolute inset-0 h-full w-full" />
          )}
          <NextImage
            key={`${item.id}-${imageKey}`}
            src={effectiveImageUrl}
            alt={item.candle.name}
            fill
            sizes="100px"
            className={cn(
              "object-cover",
              isImageLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500 ease-in-out"
            )}
            data-ai-hint={item.candle.dataAiHint}
            onLoad={handleImageLoad}
            onError={handleImageError}
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
          <p className="text-sm text-muted-foreground">Precio unitario: €{item.candle.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
        <div className="flex items-center gap-2">
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
            className="w-16 text-center"
            aria-label={`Cantidad para ${item.candle.name}`}
          />
          <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.quantity + 1)} aria-label="Aumentar cantidad">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-lg font-semibold text-primary w-24 text-center sm:text-right">
          €{(item.candle.price * item.quantity).toFixed(2)}
        </p>

        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80" aria-label="Eliminar del carrito">
          <XCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
