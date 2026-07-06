'use client'

import { SlidersHorizontal, X } from 'lucide-react'
import { Field, Select } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import {
  CATEGORIES,
  DEAL_TYPES,
  REGIONS,
  STANDARD_SIZES,
  formatSize,
  type DealType,
} from '@/lib/real-estate'

export interface Filters {
  region: string
  dealType: '' | DealType
  category: string
  size: string // '' | number string | 'other'
}

export const EMPTY_FILTERS: Filters = {
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
    filters.region || filters.dealType || filters.category || filters.size

  return (
    <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">تصفية النتائج</h2>
        </div>
        {hasActive ? (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <X className="size-3.5" />
            مسح الكل
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        {/* Deal type toggle */}
        <div>
          <p className="mb-1.5 text-sm font-semibold text-foreground">نوع العرض</p>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
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

        {/* Region */}
        <Field label="المنطقة" htmlFor="filter-region">
          <Select
            id="filter-region"
            value={filters.region}
            onChange={(e) => set({ region: e.target.value })}
          >
            <option value="">كل المناطق</option>
            {REGIONS.map((r) => (
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
          >
            <option value="">كل المساحات</option>
            {STANDARD_SIZES.map((s) => (
              <option key={s} value={String(s)}>
                {formatSize(s)} م
              </option>
            ))}
            <option value="other">أخرى (مساحات مخصصة)</option>
          </Select>
        </Field>

        <div className="mt-1 rounded-xl bg-accent px-3 py-2.5 text-center text-sm font-semibold text-accent-foreground">
          {formatSize(resultCount)} عقار متطابق
        </div>
      </div>
    </aside>
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
