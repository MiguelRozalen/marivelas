"use client";

import Image from 'next/image';
import type { Candle } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AVAILABLE_CANDLE_COLORS, type CandleColorOption } from '@/config/candle-options';
import { useState } from 'react';

interface CandleCardProps {
  candle: Candle;
}

export default function CandleCard({ candle }: CandleCardProps) {
  const [selectedColor, setSelectedColor] = useState<string>(AVAILABLE_CANDLE_COLORS[0]?.value || "");

  const inquireLink = selectedColor
    ? `/#contact?product=${encodeURIComponent(candle.name)}&color=${encodeURIComponent(selectedColor)}`
    : `/#contact?product=${encodeURIComponent(candle.name)}`;

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
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
            value={selectedColor}
            onValueChange={setSelectedColor}
            className="flex flex-wrap gap-x-4 gap-y-2"
            aria-label={`Color options for ${candle.name}`}
          >
            {AVAILABLE_CANDLE_COLORS.map((colorOpt: CandleColorOption) => (
              <div key={colorOpt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={colorOpt.value} id={`${candle.id}-${colorOpt.value}`} aria-label={colorOpt.name} />
                <Label htmlFor={`${candle.id}-${colorOpt.value}`} className="flex items-center cursor-pointer text-sm text-card-foreground">
                  <span 
                    className="mr-2 h-4 w-4 rounded-full border border-gray-300" 
                    style={{ backgroundColor: colorOpt.hexColor }}
                    aria-hidden="true"
                  ></span>
                  {colorOpt.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <p className="text-2xl font-bold text-accent-foreground" style={{color: "hsl(var(--accent))"}}>${candle.price.toFixed(2)}</p>
        <Button asChild variant="default">
          <Link href={inquireLink}>Consultar</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
