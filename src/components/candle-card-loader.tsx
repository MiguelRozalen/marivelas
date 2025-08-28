
"use client";

import { useState } from 'react';
import type { Candle } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import CandleCard from './candle-card';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface CandleCardLoaderProps {
  candle: Candle;
}

const CandleCardSkeleton = () => (
    <Card className="flex flex-col overflow-hidden shadow-lg bg-card h-full">
        <Skeleton className="h-[300px] w-full" />
        <CardContent className="p-6 flex-grow space-y-6">
            <Skeleton className="h-6 w-3/4" />
            
            {/* Skeleton for Color Selector */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <div className="flex flex-wrap gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>
            </div>

            {/* Skeleton for Scent Selector */}
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

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="relative">
      {!isLoaded && (
        <div className="w-full">
          <CandleCardSkeleton />
        </div>
      )}
      <div className={isLoaded ? 'animate-fadeIn' : 'opacity-0'}>
        <CandleCard
            candle={candle}
            onImageLoad={handleImageLoad}
        />
      </div>
    </div>
  );
}
