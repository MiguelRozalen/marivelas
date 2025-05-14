// src/components/candle-list.tsx
"use client";

import type { Candle } from '@/types';
import CandleCard from './candle-card';
import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchCandles } from '@/lib/actions';
import { getCandlePageSize } from '@/config/pagination'; // Updated import
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CandleListProps {
  initialCandles: Candle[];
  totalCandles: number;
}

const CandleSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[250px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-10 w-2/5" />
    </div>
  </div>
);


export default function CandleList({ initialCandles, totalCandles }: CandleListProps) {
  const [candles, setCandles] = useState<Candle[]>(initialCandles);
  const [offset, setOffset] = useState(initialCandles.length);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialCandles.length < totalCandles);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const PAGE_SIZE = getCandlePageSize(); // Get page size from the config

  const loadMoreCandles = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newCandles = await fetchCandles(offset);
      if (newCandles.length > 0) {
        setCandles(prevCandles => [...prevCandles, ...newCandles]);
        setOffset(prevOffset => prevOffset + newCandles.length);
        setHasMore((offset + newCandles.length) < totalCandles);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch more candles:", error);
      // Optionally, set an error state and display a message to the user
    } finally {
      setIsLoading(false);
    }
  }, [offset, isLoading, hasMore, totalCandles]); // PAGE_SIZE removed as it's constant from getCandlePageSize scope

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreCandles();
        }
      },
      { threshold: 1.0 } // Trigger when loader is fully visible
    );

    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [loadMoreCandles]);
  
  // Initial check in case initialCandles already cover totalCandles
  useEffect(() => {
    setHasMore(candles.length < totalCandles);
  }, [candles.length, totalCandles]);


  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {candles.map(candle => (
          <CandleCard key={candle.id} candle={candle} />
        ))}
        {isLoading && Array.from({ length: PAGE_SIZE / 2 || 3 }).map((_, index) => <CandleSkeleton key={`skeleton-${index}`} />)}
      </div>
      <div ref={loaderRef} className="flex justify-center items-center py-8">
        {hasMore && !isLoading && (
           <button 
            onClick={loadMoreCandles} 
            className="text-primary hover:underline"
            aria-live="polite"
            aria-busy="false"
          >
            Cargar más velas...
          </button>
        )}
        {isLoading && (
          <div className="flex items-center text-muted-foreground" aria-live="polite" aria-busy="true">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Cargando más velas...
          </div>
        )}
        {!hasMore && candles.length > 0 && (
          <p className="text-muted-foreground">Has llegado al final de nuestro catálogo.</p>
        )}
         {candles.length === 0 && !isLoading && (
          <p className="text-muted-foreground text-center col-span-full">No hay velas disponibles en este momento.</p>
        )}
      </div>
    </>
  );
}
