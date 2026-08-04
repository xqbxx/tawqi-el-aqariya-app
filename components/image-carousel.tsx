'use client'

import Image from 'next/image'

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
        <Image
          src={safeImages[index] || '/placeholder.svg'}
          alt={`${alt} - صورة ${index + 1}`}
          fill
          className="object-cover"
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
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`عرض الصورة ${i + 1}`}
                  className={cn(
                    'h-1.5 transition-all rounded-full',
                    i === index ? 'w-4 bg-primary' : 'w-1.5 bg-background/70 hover:bg-background',
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
              <Image src={src || '/placeholder.svg'} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
