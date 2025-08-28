
// src/components/candle-card-loader.tsx
"use client";

import { useState, useEffect } from 'react';
import type { Candle } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import CandleCard from './candle-card';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import NextImage from 'next/image';

interface CandleCardLoaderProps {
  candle: Candle;
}

const CandleCardSkeleton = () => (
    <Card className="flex flex-col overflow-hidden shadow-lg bg-card h-full">
        <Skeleton className="aspect-[4/3] w-full" />
        <CardContent className="p-6 flex-grow space-y-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <div className="flex flex-wrap gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <div className="flex flex-wrap gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>
            </div>
        </CardContent>
        <CardFooter className="p-6 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-2/5" />
        </CardFooter>
    </Card>
);

export default function CandleCardLoader({ candle }: CandleCardLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const primaryImageUrl = candle.imageUrls?.[0] || '/placeholder.png';

  useEffect(() => {
    // This effect preloads the image.
    // The `Image` component from Next.js is used here because it's optimized for this.
    // We render it hidden (`display: 'none'`) so it doesn't affect layout.
    const img = new window.Image();
    img.src = primaryImageUrl;
    img.onload = () => setIsLoaded(true);
    // As a fallback for broken images, we'll still show the card.
    img.onerror = () => setIsLoaded(true);
  }, [primaryImageUrl]);


  if (!isLoaded) {
    return <CandleCardSkeleton />;
  }

  return (
      <CandleCard
          candle={candle}
          // The onImageLoad prop is no longer needed here as we handle loading state in this component.
          // The component will just fade in via CSS animation if needed, or you can add a class.
          className="animate-fadeIn"
      />
  );
}
