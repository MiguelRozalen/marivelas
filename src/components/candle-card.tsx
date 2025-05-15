
// src/components/candle-card.tsx
"use client";

import NextImage from 'next/image';
import type { Candle } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AVAILABLE_CANDLE_COLORS, type CandleColorOption } from '@/config/candle-options';
import { useState, useContext, useEffect } from 'react';
import { CartContext } from '@/context/cart-context';
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CandleCardProps {
  candle: Candle;
}

const PLACEHOLDER_IMAGE_URL = "https://placehold.co/400x300.png";

export default function CandleCard({ candle }: CandleCardProps) {
  const [selectedColor, setSelectedColor] = useState<CandleColorOption>(AVAILABLE_CANDLE_COLORS[0]);
  const { addToCart } = useContext(CartContext);
  const { toast } = useToast();

  const [effectiveImageUrl, setEffectiveImageUrl] = useState(candle.imageUrl);
  const [imageKey, setImageKey] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    setEffectiveImageUrl(candle.imageUrl);
    setIsImageLoading(true); // Start loading when candle.imageUrl changes
    setImageKey(prev => prev + 1);
  }, [candle.imageUrl]);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsImageLoading(false);
    const imgElement = event.currentTarget;
    // Check naturalWidth to confirm if the image loaded successfully
    if (imgElement.naturalWidth === 0 && effectiveImageUrl !== PLACEHOLDER_IMAGE_URL) {
      setEffectiveImageUrl(PLACEHOLDER_IMAGE_URL);
      setImageKey(prevKey => prevKey + 1); // Force re-render with placeholder
    }
  };
  
  const handleImageError = () => { // Fallback for other types of errors
    setIsImageLoading(false);
    if (effectiveImageUrl !== PLACEHOLDER_IMAGE_URL) {
      setEffectiveImageUrl(PLACEHOLDER_IMAGE_URL);
      setImageKey(prevKey => prevKey + 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(candle, selectedColor); 
    toast({
      title: "¡Añadido al carrito!",
      description: `${candle.name} (Color: ${selectedColor.name}) ha sido añadido a tu carrito.`,
      action: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card animate-fadeIn">
      <CardHeader className="p-0">
        <div className="aspect-[4/3] relative w-full bg-muted/50">
          {isImageLoading && (
            <Skeleton className="absolute inset-0 h-full w-full rounded-t-lg" />
          )}
          <NextImage
            key={`${candle.id}-${imageKey}`}
            src={effectiveImageUrl}
            alt={candle.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              "object-cover rounded-t-lg",
              isImageLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500 ease-in-out"
            )}
            data-ai-hint={candle.dataAiHint}
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={false}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl font-semibold mb-2 text-card-foreground">{candle.name}</CardTitle>
        {candle.description && <CardDescription className="text-muted-foreground mb-4 text-sm">{candle.description}</CardDescription>}
        
        <div className="mt-4">
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">Selecciona un color:</Label>
          <RadioGroup
            value={selectedColor.value}
            onValueChange={(value) => {
              const color = AVAILABLE_CANDLE_COLORS.find(c => c.value === value);
              if (color) setSelectedColor(color);
            }}
            className="flex flex-wrap gap-3"
            aria-label={`Opciones de color para ${candle.name}`}
          >
            {AVAILABLE_CANDLE_COLORS.map((colorOpt: CandleColorOption) => (
              <div key={colorOpt.value} className="flex items-center">
                <RadioGroupItem 
                  value={colorOpt.value} 
                  id={`${candle.id}-${colorOpt.value}`} 
                  className="sr-only peer"
                  aria-label={colorOpt.name}
                />
                <Label 
                  htmlFor={`${candle.id}-${colorOpt.value}`} 
                  className="h-5 w-5 rounded-full border-2 border-transparent cursor-pointer transition-all
                             peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-ring peer-data-[state=checked]:ring-offset-2 
                             peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1"
                  style={{ backgroundColor: colorOpt.hexColor }}
                  title={colorOpt.name}
                >
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-2xl font-bold text-primary">€{candle.price.toFixed(2)}</p>
        <Button onClick={handleAddToCart} variant="default" className="w-full sm:w-auto">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
}
