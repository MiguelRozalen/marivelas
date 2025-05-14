// src/components/candle-card.tsx
"use client";

import Image from 'next/image';
import type { Candle } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AVAILABLE_CANDLE_COLORS, type CandleColorOption } from '@/config/candle-options';
import { useState, useContext, useMemo } from 'react';
import { CartContext } from '@/context/cart-context';
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, CheckCircle } from 'lucide-react';

interface CandleCardProps {
  candle: Candle;
}

export default function CandleCard({ candle }: CandleCardProps) {
  const [selectedColor, setSelectedColor] = useState<CandleColorOption>(AVAILABLE_CANDLE_COLORS[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (quantity < 1) {
      toast({
        title: "Cantidad Inválida",
        description: "Por favor, introduce una cantidad válida.",
        variant: "destructive",
      });
      return;
    }
    addToCart(candle, selectedColor, quantity);
    toast({
      title: "¡Añadido al carrito!",
      description: `${candle.name} (Color: ${selectedColor.name}, Cantidad: ${quantity}) ha sido añadido a tu carrito.`,
      action: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  };

  const totalPriceForItem = useMemo(() => {
    return (candle.price * quantity);
  }, [candle.price, quantity]);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card animate-fadeIn">
      <CardHeader className="p-0">
        <div className="aspect-[4/3] relative w-full">
          <Image
            src={candle.imageUrl}
            alt={candle.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={candle.dataAiHint}
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
            className="flex flex-wrap gap-2" // Reduced gap for smaller items
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
                  className="h-6 w-6 rounded-full border-2 border-transparent cursor-pointer transition-all
                             flex items-center justify-center
                             peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-ring peer-data-[state=checked]:ring-offset-2 
                             peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1"
                  style={{ backgroundColor: colorOpt.hexColor }}
                  title={colorOpt.name}
                >
                  {selectedColor.value === colorOpt.value && (
                     <CheckCircle className={`h-4 w-4 ${colorOpt.value === 'blanco' || colorOpt.hexColor === '#FFFFFF' || colorOpt.hexColor === '#f5e7c4' ? 'text-black' : 'text-white'}`} />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="mt-4">
          <Label htmlFor={`${candle.id}-quantity`} className="text-sm font-medium text-muted-foreground mb-2 block">Cantidad:</Label>
          <Input
            id={`${candle.id}-quantity`}
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setQuantity(val >= 1 ? val : 1);
            }}
            className="w-20"
          />
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-2xl font-bold text-primary">${totalPriceForItem.toFixed(2)}</p>
        <Button onClick={handleAddToCart} variant="default" className="w-full sm:w-auto">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
}

// Simple fade-in animation for tailwind.config.js if needed
// keyframes: {
//   fadeIn: {
//     '0%': { opacity: '0' },
//     '100%': { opacity: '1' },
//   },
// },
// animation: {
//   fadeIn: 'fadeIn 0.5s ease-out forwards',
// },
// Add 'animate-fadeIn' to the Card's className.
// For now, using a transition on opacity when items are added to the list in candle-list.tsx
// The `animate-fadeIn` class here is a placeholder for a potential global animation.
// Tailwind's `animate-in` with `fade-in` from `tailwindcss-animate` might cover this by default on new elements.
// The card already has `transition-shadow`. We can rely on list transitions for load-in.
