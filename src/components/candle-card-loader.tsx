
"use client";

import { useState } from 'react';
import type { Candle } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import CandleCard from './candle-card';

interface CandleCardLoaderProps {
  candle: Candle;
}

const CandleCardSkeleton = () => (
    <div className="flex flex-col space-y-3">
        <Skeleton className="h-[250px] w-full rounded-lg" />
        <div className="space-y-2 p-6 pt-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center pt-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-10 w-2/5" />
            </div>
        </div>
    </div>
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
      <CandleCard
        candle={candle}
        onImageLoad={handleImageLoad}
        className={isLoaded ? 'animate-fadeIn' : 'opacity-0'}
      />
    </div>
  );
}
