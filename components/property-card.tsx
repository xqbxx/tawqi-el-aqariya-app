'use client'

import { MapPin, Maximize, Lock, Trash2 } from 'lucide-react'
import {
  categoryLabel,
  formatPrice,
  formatSize,
  regionLabel,
  type Property,
} from '@/lib/real-estate'

export function PropertyCard({
  property,
  isAdmin,
  onClick,
  onDelete,
}: {
  property: Property
  isAdmin: boolean
  onClick: () => void
  onDelete?: () => void
}) {
  const dealAr = property.dealType === 'sale' ? 'للبيع' : 'للإيجار'

  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      tabIndex={0}
      role="button"
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card text-right shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.images[0] || '/placeholder.svg'}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow">
          {dealAr}
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground shadow">
          {categoryLabel(property)}
        </span>
        {isAdmin && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-foreground/80 px-2.5 py-1 text-xs font-medium text-background">
            <Lock className="size-3" />
            قطعة {property.plotNumber}
          </span>
        )}
        {isAdmin && onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="absolute bottom-3 right-3 z-10 flex items-center justify-center rounded-full bg-destructive/90 p-1.5 text-destructive-foreground shadow transition-colors hover:bg-destructive"
            aria-label="حذف"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-1 text-base font-bold text-foreground">{property.title}</h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-4 text-primary" />
            {regionLabel(property)}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="size-4 text-primary" />
            {formatSize(property.size)} م
          </span>
        </div>

        <div className="mt-auto flex items-baseline gap-1.5 border-t border-border pt-3">
          <span className="text-xl font-extrabold text-primary">
            {formatPrice(property.price)}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            ريال{property.dealType === 'rent' ? ' / شهرياً' : ''}
          </span>
        </div>
      </div>
    </article>
  )
}
