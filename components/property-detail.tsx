'use client'

import {
  MapPin,
  Maximize,
  Compass,
  Ruler,
  Hash,
  Tag,
  MessageCircle,
  Map as MapIcon,
  User,
  Phone,
  Shield,
  Lock,
} from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { ImageCarousel } from '@/components/image-carousel'
import {
  categoryLabel,
  findDirection,
  formatPrice,
  formatSize,
  regionLabel,
  type Property,
} from '@/lib/real-estate'

export function PropertyDetail({
  property,
  isAdmin,
  onClose,
}: {
  property: Property | null
  isAdmin: boolean
  onClose: () => void
}) {
  if (!property) return null

  const dealAr = property.dealType === 'sale' ? 'للبيع' : 'للإيجار'
  const mapsUrl = property.googleMapsUrl
  const whatsappMessage = encodeURIComponent(
    `مرحباً، أنا مهتم بالعقار: ${property.title} (رقم ${property.plotNumber}) المعروض ${dealAr} في ${regionLabel(
      property,
    )}. هل مازال متاحاً؟`,
  )
  const whatsappUrl = `https://wa.me/${DEFAULT_WHATSAPP}?text=${whatsappMessage}`

  return (
    <Modal open={!!property} onClose={onClose} className="max-w-2xl" labelledBy="detail-title">
      <div className="p-5 sm:p-6">
        <ImageCarousel images={property.images} alt={property.title} />

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
            {dealAr}
          </span>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            {categoryLabel(property)}
          </span>
        </div>

        <h2 id="detail-title" className="mt-3 text-2xl font-extrabold text-foreground text-balance">
          {property.title}
        </h2>

        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-2xl font-extrabold text-primary">
            {formatPrice(property.price)}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            ريال{property.dealType === 'rent' ? ' / شهرياً' : ''}
          </span>
        </div>

        <p className="mt-4 leading-relaxed text-muted-foreground">{property.description}</p>

        {/* Specs */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Spec icon={MapPin} label="المنطقة" value={regionLabel(property)} />
          <Spec icon={Maximize} label="المساحة" value={`${formatSize(property.size)} م`} />
          <Spec icon={Tag} label="التصنيف" value={categoryLabel(property)} />
          <Spec icon={Ruler} label="عرض الشارع" value={`${property.streetWidth} م`} />
          <Spec
            icon={Compass}
            label="الاتجاه"
            value={findDirection(property.direction)?.ar ?? property.direction}
          />
          {isAdmin && <Spec icon={Hash} label="رقم القطعة" value={property.plotNumber} />}
        </div>

        {/* Restricted admin section */}
        {isAdmin && (
          <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Lock className="size-4" />
              <h3 className="text-sm font-bold">معلومات خاصة (للمشرف فقط)</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Spec icon={User} label="اسم المالك" value={property.ownerName} />
              <Spec icon={Phone} label="جوال المالك" value={property.ownerPhone} dir="ltr" />
              <Spec icon={Shield} label="جوال الحارس" value={property.guardPhone} dir="ltr" />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {!isAdmin && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button
                size="lg"
                className="h-12 w-full bg-[#25D366] text-white hover:bg-[#25D366]/90"
              >
                <MessageCircle className="size-5" />
                تواصل عبر واتساب
              </Button>
            </a>
          )}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={isAdmin ? 'flex-1' : 'sm:w-auto'}
          >
            <Button size="lg" variant="outline" className="h-12 w-full">
              <MapIcon className="size-5" />
              عرض الموقع على الخريطة
            </Button>
          </a>
        </div>

      </div>
    </Modal>
  )
}

function Spec({
  icon: Icon,
  label,
  value,
  dir,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  dir?: 'ltr' | 'rtl'
}) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="text-sm font-bold text-foreground" dir={dir}>
        {value}
      </p>
    </div>
  )
}
