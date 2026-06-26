"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        className={`bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center ${className}`}
      >
        <p className="text-xs text-muted-foreground">No image</p>
      </div>
    );
  }

  return (
    <div className={`relative group overflow-hidden ${className}`}>
      <img
        src={images[current]}
        alt={`${alt} ${current + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading="lazy"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrent((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              )
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              setCurrent((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
              )
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === current ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
