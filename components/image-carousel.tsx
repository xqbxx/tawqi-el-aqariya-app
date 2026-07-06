'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0)
  const count = images.length
  const safeImages = count > 0 ? images : ['/placeholder.svg']

  const go = (dir: number) => {
    setIndex((prev) => (prev + dir + safeImages.length) % safeImages.length)
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={safeImages[index] || '/placeholder.svg'}
          alt={`${alt} - صورة ${index + 1}`}
          className="h-full w-full object-cover"
        />
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="الصورة السابقة"
              className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow transition-colors hover:bg-background"
            >
              <ChevronRight className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="الصورة التالية"
              className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow transition-colors hover:bg-background"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {safeImages.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'size-1.5 rounded-full transition-all',
                    i === index ? 'w-4 bg-primary' : 'bg-background/70',
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`عرض الصورة ${i + 1}`}
              className={cn(
                'relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                i === index ? 'border-primary' : 'border-transparent opacity-70',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src || '/placeholder.svg'} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
