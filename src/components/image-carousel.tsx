
"use client";

import NextImage from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ImageCarouselProps {
  imageUrls: string[];
  altText: string;
  dataAiHint?: string;
  aspectRatio?: "aspect-video" | "aspect-square" | "aspect-[4/3]" | "aspect-[3/4]" | "aspect-[16/9]";
  placeholderBaseUrl?: string;
  placeholderDimensions?: string;
  onImageClick?: (index: number) => void;
  onImageLoad?: () => void; // Callback for when the primary image loads
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
  onLoad?: () => void;
  onError?: () => void;
  objectFit?: 'cover' | 'contain';
  aspectRatio: ImageCarouselProps['aspectRatio'];
}

function CarouselImageItem({ src, altText, dataAiHint, placeholderUrl, index, onLoad, onError, objectFit = 'cover', aspectRatio }: CarouselImageItemProps) {
  const [effectiveImageUrl, setEffectiveImageUrl] = useState(src);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    setEffectiveImageUrl(src);
    setIsImageLoading(true);
  }, [src]);
  
  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsImageLoading(false);
    const imgElement = event.currentTarget;
    if (imgElement.naturalWidth === 0 && effectiveImageUrl !== placeholderUrl) {
      setEffectiveImageUrl(placeholderUrl);
    }
    onLoad?.();
  };

  const handleError = () => {
    setIsImageLoading(false);
    if (effectiveImageUrl !== placeholderUrl) {
      setEffectiveImageUrl(placeholderUrl);
    }
    onError?.();
  };
  
  return (
    <div 
      className={cn(
        "relative w-full h-full", 
        aspectRatio,
        objectFit === 'cover' ? 'bg-muted/50' : 'bg-transparent'
      )}
    >
      <NextImage
        key={`${altText}-carousel-${index}-${effectiveImageUrl}`}
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
        onLoad={handleLoad}
        onError={handleError}
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
  onImageLoad,
  initialIndex = 0,
  objectFit = 'cover',
}: ImageCarouselProps) {
  const fallbackPlaceholder = `${placeholderBaseUrl}${placeholderDimensions}.png`;

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>, index?: number) => {
    if (!onImageClick) return;

    if ((e.target as HTMLElement).closest('[data-embla-button="prev"]') || (e.target as HTMLElement).closest('[data-embla-button="next"]')) {
      return;
    }
    
    onImageClick(index ?? 0);
  };

  if (!imageUrls || imageUrls.length === 0) {
    return (
        <div 
          className={cn(
            "w-full h-full relative",
            aspectRatio,
            onImageClick && "cursor-pointer",
            objectFit === 'cover' ? 'bg-muted/50' : 'bg-transparent'
          )}
          onClick={(e) => handleContainerClick(e)}
        >
            <NextImage src={fallbackPlaceholder} alt={altText} fill className={objectFit === 'cover' ? 'object-cover' : 'object-contain'} data-ai-hint={dataAiHint} onLoad={onImageLoad}/>
        </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Carousel 
        className={cn("w-full h-full", onImageClick && "cursor-pointer")}
        opts={{
          loop: imageUrls.length > 1,
          startIndex: initialIndex,
        }}
      >
        <CarouselContent className="h-full">
          {imageUrls.map((url, index) => (
            <CarouselItem key={index} className="relative h-full w-full flex items-center justify-center" onClick={(e) => handleContainerClick(e, index)}>
               <CarouselImageItem
                src={url}
                altText={altText}
                dataAiHint={dataAiHint}
                placeholderUrl={fallbackPlaceholder}
                index={index}
                objectFit={objectFit}
                aspectRatio={aspectRatio}
                onLoad={index === 0 ? onImageLoad : undefined} // Only trigger onLoad for the first image
                onError={index === 0 ? onImageLoad : undefined} // Also trigger onLoad on error to prevent infinite loading
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {imageUrls.length > 1 && (
          <>
            <CarouselPrevious data-embla-button="prev" className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90 text-foreground" />
            <CarouselNext data-embla-button="next" className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 hover:bg-background/90 text-foreground" />
          </>
        )}
      </Carousel>
    </div>
  );
}
