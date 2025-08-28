
// src/components/candle-card.tsx
"use client";

import type { Candle } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { AVAILABLE_CANDLE_COLORS, AVAILABLE_CANDLE_SCENTS, type CandleColorOption, type CandleScentOption } from '@/config/candle-options';
import { useState, useContext } from 'react';
import { CartContext } from '@/context/cart-context';
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, CheckCircle } from 'lucide-react';
import ImageCarousel from './image-carousel';
import ImageZoom from './image-zoom';
import { cn, isColorLight } from '@/lib/utils';
import { TooltipProvider } from "@/components/ui/tooltip";
import OptionSelector from './option-selector';

interface CandleCardProps {
  candle: Candle;
  onImageLoad?: () => void;
  className?: string;
}

export default function CandleCard({ candle, onImageLoad, className }: CandleCardProps) {
  const [selectedColor, setSelectedColor] = useState<CandleColorOption>(AVAILABLE_CANDLE_COLORS[0]);
  const [selectedScent, setSelectedScent] = useState<CandleScentOption>(AVAILABLE_CANDLE_SCENTS[0]);
  const [zoomStartIndex, setZoomStartIndex] = useState<number>(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(candle, selectedColor, selectedScent); 
    toast({
      title: "¡Añadido al carrito!",
      description: `${candle.name} (Color: ${selectedColor.name}, Aroma: ${selectedScent.name}) ha sido añadido a tu carrito.`,
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

  // Determine text color based on contrast
  const colorNameStyle = !isColorLight(selectedColor.hexColor) ? { color: selectedColor.hexColor } : {};
  const scentNameStyle = !isColorLight(selectedScent.hexColor) ? { color: selectedScent.hexColor } : {};

  return (
    <TooltipProvider>
      <ImageZoom 
        imageUrls={candle.imageUrls}
        startIndex={zoomStartIndex}
        altText={`Zoom de ${candle.name}`}
        dataAiHint={candle.dataAiHint}
        open={isZoomOpen}
        onOpenChange={handleZoomClose}
      />
      <Card className={cn("flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card h-full", className)}>
        <CardHeader className="p-0 relative">
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
        <div className="p-5 flex flex-col flex-grow">
          <CardTitle className="text-xl font-semibold text-card-foreground">{candle.name}</CardTitle>
          <CardContent className="p-0 pt-3 flex flex-col flex-grow">
            <div className="space-y-4 flex-grow">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-muted-foreground whitespace-nowrap w-[50px]">
                  Color:
                </Label>
                <OptionSelector
                    options={AVAILABLE_CANDLE_COLORS}
                    selectedOption={selectedColor}
                    onSelectOption={setSelectedColor}
                    optionType="color"
                    uniqueIdPrefix={`${candle.id}-color`}
                />
                <span className="text-xs font-medium italic ml-2" style={colorNameStyle}>{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-muted-foreground whitespace-nowrap w-[50px]">
                  Aroma:
                </Label>
                 <OptionSelector
                    options={AVAILABLE_CANDLE_SCENTS}
                    selectedOption={selectedScent}
                    onSelectOption={setSelectedScent}
                    optionType="scent"
                    uniqueIdPrefix={`${candle.id}-scent`}
                />
                <span className="text-xs font-medium italic ml-2" style={scentNameStyle}>{selectedScent.name}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-2xl font-bold text-primary">€{candle.price.toFixed(2)}</p>
              <Button onClick={handleAddToCart} variant="default" className="w-full sm:w-auto">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Comprar
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </TooltipProvider>
  );
}
