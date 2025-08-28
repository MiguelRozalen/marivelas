
// src/components/candle-card.tsx
"use client";

import type { Candle } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AVAILABLE_CANDLE_COLORS, type CandleColorOption } from '@/config/candle-options';
import { useState, useContext } from 'react';
import { CartContext } from '@/context/cart-context';
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, CheckCircle } from 'lucide-react';
import ImageCarousel from './image-carousel';
import ImageZoom from './image-zoom';
import { cn } from '@/lib/utils';

interface CandleCardProps {
  candle: Candle;
  onImageLoad?: () => void;
  className?: string;
}

export default function CandleCard({ candle, onImageLoad, className }: CandleCardProps) {
  const [selectedColor, setSelectedColor] = useState<CandleColorOption>(AVAILABLE_CANDLE_COLORS[0]);
  const [zoomStartIndex, setZoomStartIndex] = useState<number>(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(candle, selectedColor); 
    toast({
      title: "¡Añadido al carrito!",
      description: `${candle.name} (Color: ${selectedColor.name}) ha sido añadido a tu carrito.`,
      action: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  };

  const handleImageClick = (index: number) => {
    setZoomStartIndex(index);
    setIsZoomOpen(true);
  };
  
  const handleZoomClose = () => {
    setIsZoomOpen(false);
  }

  return (
    <>
      <ImageZoom 
        imageUrls={candle.imageUrls}
        startIndex={zoomStartIndex}
        altText={`Zoom de ${candle.name}`}
        dataAiHint={candle.dataAiHint}
        open={isZoomOpen}
        onOpenChange={handleZoomClose}
      />
      <Card className={cn("flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card", className)}>
        <CardHeader className="p-0">
          <ImageCarousel
            imageUrls={candle.imageUrls}
            altText={candle.name}
            dataAiHint={candle.dataAiHint}
            aspectRatio="aspect-[4/3]"
            placeholderDimensions="400x300"
            onImageClick={handleImageClick}
            onImageLoad={onImageLoad}
          />
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
    </>
  );
}
