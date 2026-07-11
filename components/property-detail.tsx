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
  Share2,
  PhoneCall,
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
  DEFAULT_WHATSAPP,
  type Property,
} from '@/lib/real-estate'

export function PropertyDetail({
  property,
  isAdmin,
  onClose,
  onContactRequest,
}: {
  property: Property | null
  isAdmin: boolean
  onClose: () => void
  onContactRequest?: (property: Property) => void
}) {
  if (!property) return null

  const handleShare = async () => {
    const dealText = property.dealType === 'sale' ? 'للبيع' : 'للإيجار'
    const shareText = `${property.title} - ${dealText} - ${formatPrice(property.price)} ريال | توقيع العقارية`
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : ''

    if (navigator.share) {
      try {
        await navigator.share({ title: property.title, text: shareText, url: shareUrl })
      } catch {
        // User cancelled share — do nothing
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        alert('تم نسخ رابط العقار!')
      } catch {
        // Fallback for older browsers
        alert('لم يتمكن من النسخ. انسخ الرابط يدوياً.')
      }
    }
  }

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
        <div className="mt-6 flex flex-col gap-3 sm:flex-row w-full">
          {!isAdmin && (
            <div className="flex flex-1 flex-col sm:flex-row gap-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button
                  size="lg"
                  className="h-14 w-full bg-[#25D366] text-white hover:bg-[#25D366]/90 text-base font-bold"
                >
                  <MessageCircle className="size-5 ml-2" />
                  تواصل عبر واتساب
                </Button>
              </a>
              {onContactRequest && (
                <div className="flex-1">
                  <Button
                    size="lg"
                    onClick={() => onContactRequest(property)}
                    className="h-14 w-full text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <PhoneCall className="size-5 ml-2" />
                    اطلب تفاصيل أكثر
                  </Button>
                </div>
              )}
            </div>
          )}
          <div className={`flex flex-col sm:flex-row gap-3 ${isAdmin ? 'w-full' : 'sm:w-auto'}`}>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:w-auto"
            >
              <Button size="lg" variant="outline" className="h-14 w-full text-base font-semibold">
                <MapIcon className="size-5 ml-2" />
                عرض الموقع
              </Button>
            </a>
            <Button
              size="lg"
              variant="outline"
              onClick={handleShare}
              className="h-14 flex-1 sm:w-auto text-base font-semibold"
            >
              <Share2 className="size-5 ml-2" />
              مشاركة
            </Button>
          </div>
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
