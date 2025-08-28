// src/components/image-zoom.tsx
"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import ImageCarousel from './image-carousel';

interface ImageZoomProps {
  imageUrls: string[] | null;
  startIndex: number;
  altText: string;
  dataAiHint?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ImageZoom({ imageUrls, startIndex, altText, dataAiHint, open, onOpenChange }: ImageZoomProps) {
    
    if (!imageUrls || imageUrls.length === 0) return null;
    
    // We need a unique key to force remounting the carousel, so it starts at the correct index.
    const carouselKey = `${altText}-zoom-${startIndex}-${imageUrls.join('-')}`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="max-w-[90vw] max-h-[90vh] w-auto h-auto bg-transparent border-none shadow-none flex items-center justify-center p-0"
            >
                <div className="w-[80vw] h-[80vh]">
                     <ImageCarousel
                        key={carouselKey}
                        imageUrls={imageUrls}
                        altText={altText}
                        dataAiHint={dataAiHint}
                        aspectRatio="aspect-video"
                        placeholderDimensions="1200x800"
                        initialIndex={startIndex}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
