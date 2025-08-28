// src/components/image-zoom.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import NextImage from 'next/image';
import { X } from 'lucide-react';
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";

interface ImageZoomProps {
  imageUrl: string | null;
  altText: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ImageZoom({ imageUrl, altText, open, onOpenChange }: ImageZoomProps) {
    const [isLoading, setIsLoading] = useState(true);

    if (!imageUrl) return null;
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="bg-black/80" />
                <DialogContent 
                    className="max-w-[90vw] max-h-[90vh] w-auto h-auto bg-transparent border-none shadow-none flex items-center justify-center p-0"
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <div className="relative w-full h-full max-w-full max-h-full">
                        {isLoading && (
                            <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
                        )}
                        <NextImage
                            src={imageUrl}
                            alt={altText}
                            width={1200}
                            height={1200}
                            onLoad={() => setIsLoading(false)}
                            className={`object-contain w-auto h-auto max-w-[90vw] max-h-[90vh] rounded-lg transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
