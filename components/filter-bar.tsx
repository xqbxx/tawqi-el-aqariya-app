'use client'

import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Field, Select } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import {
  CATEGORIES,
  CITIES,
  DEAL_TYPES,
  STANDARD_SIZES,
  formatSize,
  getNeighborhoodsByCity,
  type DealType,
} from '@/lib/real-estate'

export interface Filters {
  city: string
  region: string
  dealType: '' | DealType
  category: string
  size: string // '' | number string | 'other'
}

export const EMPTY_FILTERS: Filters = {
  city: '',
  region: '',
  dealType: '',
  category: '',
  size: '',
}

export function FilterBar({
  filters,
  onChange,
  resultCount,
}: {
  filters: Filters
  onChange: (f: Filters) => void
  resultCount: number
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })
  const hasActive =
    filters.city || filters.region || filters.dealType || filters.category || filters.size

  const neighborhoods = getNeighborhoodsByCity(filters.city)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 flex-1 lg:cursor-default lg:pointer-events-none"
        >
          <SlidersHorizontal className="size-5 text-accent" />
          <h2 className="text-lg font-bold text-foreground">تصفية النتائج</h2>
          <div className="lg:hidden text-muted-foreground mr-1">
            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </div>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/5 border border-primary/10 px-3 py-1.5 text-sm font-semibold text-foreground">
            {formatSize(resultCount)} عقار متطابق
          </div>
          {hasActive ? (
            <button
              type="button"
              onClick={() => onChange(EMPTY_FILTERS)}
              className="flex items-center gap-1 text-xs font-medium text-destructive hover:underline"
            >
              <X className="size-3.5" />
              مسح الكل
            </button>
          ) : null}
        </div>
      </div>

      <div className={cn("gap-4 sm:grid-cols-2 lg:grid-cols-5 items-start", isExpanded ? "grid mt-5" : "hidden lg:grid lg:mt-5")}>
        {/* Deal type toggle */}
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-foreground px-1">نوع العرض</p>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1 h-[42px]">
            <ToggleButton
              active={filters.dealType === ''}
              onClick={() => set({ dealType: '' })}
            >
              الكل
            </ToggleButton>
            {DEAL_TYPES.map((d) => (
              <ToggleButton
                key={d.value}
                active={filters.dealType === d.value}
                onClick={() => set({ dealType: d.value })}
              >
                {d.ar}
              </ToggleButton>
            ))}
          </div>
        </div>

        {/* City */}
        <Field label="المدينة" htmlFor="filter-city">
          <Select
            id="filter-city"
            value={filters.city}
            onChange={(e) => set({ city: e.target.value, region: '' })}
            className="h-[42px]"
          >
            <option value="">كل المدن</option>
            {CITIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.ar}
              </option>
            ))}
          </Select>
        </Field>

        {/* Neighborhood */}
        <Field label="الحي" htmlFor="filter-region">
          <Select
            id="filter-region"
            value={filters.region}
            onChange={(e) => set({ region: e.target.value })}
            className="h-[42px]"
          >
            <option value="">كل الأحياء</option>
            {neighborhoods.map((r) => (
              <option key={r.value} value={r.value}>
                {r.ar}
              </option>
            ))}
            <option value="other">أخرى</option>
          </Select>
        </Field>

        {/* Category */}
        <Field label="التصنيف" htmlFor="filter-category">
          <Select
            id="filter-category"
            value={filters.category}
            onChange={(e) => set({ category: e.target.value })}
            className="h-[42px]"
          >
            <option value="">كل التصنيفات</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.ar}
              </option>
            ))}
          </Select>
        </Field>

        {/* Size */}
        <Field label="المساحة (م)" htmlFor="filter-size">
          <Select
            id="filter-size"
            value={filters.size}
            onChange={(e) => set({ size: e.target.value })}
            className="h-[42px]"
          >
            <option value="">كل المساحات</option>
            {STANDARD_SIZES.map((s) => (
              <option key={s} value={String(s)}>
                {formatSize(s)} م
              </option>
            ))}
            <option value="other">أخرى</option>
          </Select>
        </Field>
      </div>
    </div>
  )
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg px-2 py-2 text-sm font-semibold transition-colors',
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

