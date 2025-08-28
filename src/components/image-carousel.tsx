
"use client";

import NextImage from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  imageUrls: string[];
  altText: string;
  dataAiHint?: string;
  aspectRatio?: "aspect-video" | "aspect-square" | "aspect-[4/3]" | "aspect-[3/4]" | "aspect-[16/9]";
  placeholderBaseUrl?: string;
  placeholderDimensions?: string;
  onImageClick?: (index: number) => void;
  initialIndex?: number;
  objectFit?: 'cover' | 'contain';
}

const DEFAULT_PLACEHOLDER_URL = "https://placehold.co/400x300.png";

interface CarouselImageItemProps {
  src: string;
  altText: string;
  dataAiHint?: string;
  placeholderUrl: string;
  index: number;
  onClick?: (index: number) => void;
  objectFit?: 'cover' | 'contain';
}

function CarouselImageItem({ src, altText, dataAiHint, placeholderUrl, index, onClick, objectFit = 'cover' }: CarouselImageItemProps) {
  const [effectiveImageUrl, setEffectiveImageUrl] = useState(src);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    setEffectiveImageUrl(src);
    setIsImageLoading(true);
    setImageKey(prev => prev + 1);
  }, [src]);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsImageLoading(false);
    const imgElement = event.currentTarget;
    if (imgElement.naturalWidth === 0 && effectiveImageUrl !== placeholderUrl) {
      setEffectiveImageUrl(placeholderUrl);
      setImageKey(prevKey => prevKey + 1);
    }
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    if (effectiveImageUrl !== placeholderUrl) {
      setEffectiveImageUrl(placeholderUrl);
      setImageKey(prevKey => prevKey + 1);
    }
  };
  
  return (
    <div 
      className={cn(
        "relative w-full h-full", 
        onClick && "cursor-pointer",
        objectFit === 'cover' && 'bg-muted/50'
      )}
      onClick={() => onClick?.(index)}
    >
      {isImageLoading && (
        <Skeleton className="absolute inset-0 h-full w-full" />
      )}
      <NextImage
        key={`${altText}-carousel-${index}-${imageKey}`}
        src={effectiveImageUrl}
        alt={`${altText} - view ${index + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          "w-full h-full",
          objectFit === 'cover' ? 'object-cover' : 'object-contain',
          isImageLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500 ease-in-out"
        )}
        data-ai-hint={dataAiHint}
        onLoad={handleImageLoad}
        onError={handleImageError}
        priority={index === 0}
      />
    </div>
  );
}


export default function ImageCarousel({ 
  imageUrls, 
  altText, 
  dataAiHint, 
  aspectRatio = "aspect-[4/3]",
  placeholderBaseUrl = "https://placehold.co/",
  placeholderDimensions = "400x300",
  onImageClick,
  initialIndex = 0,
  objectFit = 'cover',
}: ImageCarouselProps) {
  const fallbackPlaceholder = `${placeholderBaseUrl}${placeholderDimensions}.png`;

  if (!imageUrls || imageUrls.length === 0) {
    const handleClick = () => {
      if (onImageClick) onImageClick(0);
    }
    return (
        <div 
          className={cn(
            "w-full", 
            aspectRatio, 
            onImageClick && "cursor-pointer",
            objectFit === 'cover' && 'bg-muted/50'
          )}
          onClick={handleClick}
        >
            <NextImage src={fallbackPlaceholder} alt={altText} fill className={objectFit === 'cover' ? 'object-cover' : 'object-contain'} data-ai-hint={dataAiHint} />
        </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Carousel 
        className="w-full h-full"
        opts={{
          loop: true,
          startIndex: initialIndex,
        }}
      >
        <CarouselContent className="h-full">
          {imageUrls.map((url, index) => (
            <CarouselItem key={index} className={cn(aspectRatio, "relative h-full")}>
               <CarouselImageItem
                src={url}
                altText={altText}
                dataAiHint={dataAiHint}
                placeholderUrl={fallbackPlaceholder}
                index={index}
                onClick={onImageClick}
                objectFit={objectFit}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {imageUrls.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90 text-foreground" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90 text-foreground" />
          </>
        )}
      </Carousel>
    </div>
  );
}
