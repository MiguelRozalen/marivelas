
// src/components/candle-list.tsx
"use client";

import type { Candle } from '@/types';
import CandleCardLoader from './candle-card-loader'; // Changed from CandleCard to CandleCardLoader
import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchCandles } from '@/lib/actions';
import { getCandlePageSize } from '@/config/pagination';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CandleListProps {
  initialCandles: Candle[];
  totalCandles: number;
}

// This is now the skeleton shown when fetching the next page of candles.
const PageLoaderSkeleton = () => (
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
  const PAGE_SIZE = getCandlePageSize();

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
    } finally {
      setIsLoading(false);
    }
  }, [offset, isLoading, hasMore, totalCandles]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreCandles();
        }
      },
      { threshold: 1.0 }
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
  
  useEffect(() => {
    setHasMore(candles.length < totalCandles);
  }, [candles.length, totalCandles]);


  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {candles.map(candle => (
          <CandleCardLoader key={candle.id} candle={candle} />
        ))}
        {isLoading && Array.from({ length: PAGE_SIZE / 2 || 3 }).map((_, index) => <PageLoaderSkeleton key={`skeleton-${index}`} />)}
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
