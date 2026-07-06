// Domain constants, types and mock data for Tawqi' El-Aqariya

export type DealType = 'sale' | 'rent'

export interface OptionItem {
  value: string
  ar: string
  en: string
}

// Regions (fixed options)
export const REGIONS: OptionItem[] = [
  { value: 'al-afiqah', ar: 'العفجة', en: 'Al-Afiqah' },
  { value: 'najdiya', ar: 'نجدية', en: 'Najdiya' },
  { value: 'al-nakheel', ar: 'النخيل السكني', en: 'Al-Bakheel Residential' },
  { value: 'al-rahmaniya', ar: 'الرحمانية', en: 'Al-Rahmaniya' },
]

// Categories (fixed options)
export const CATEGORIES: OptionItem[] = [
  { value: 'lands', ar: 'اراضي', en: 'Lands' },
  { value: 'yards', ar: 'احواش', en: 'Yards' },
  { value: 'chalets', ar: 'شاليهات', en: 'Chalets' },
  { value: 'rooms', ar: 'غرف', en: 'Rooms' },
  { value: 'rest-houses', ar: 'استراحات', en: 'Rest houses' },
]

export const DEAL_TYPES: { value: DealType; ar: string; en: string }[] = [
  { value: 'sale', ar: 'بيع', en: 'Sale' },
  { value: 'rent', ar: 'تأجير', en: 'Rent' },
]

// Standard sizes from 5,000 up to 25,000 (step 5,000)
export const STANDARD_SIZES: number[] = [5000, 10000, 15000, 20000, 25000]

export const DIRECTIONS: OptionItem[] = [
  { value: 'north', ar: 'شمالية', en: 'North' },
  { value: 'south', ar: 'جنوبية', en: 'South' },
  { value: 'east', ar: 'شرقية', en: 'East' },
  { value: 'west', ar: 'غربية', en: 'West' },
  { value: 'north-east', ar: 'شمالية شرقية', en: 'North-East' },
  { value: 'north-west', ar: 'شمالية غربية', en: 'North-West' },
  { value: 'south-east', ar: 'جنوبية شرقية', en: 'South-East' },
  { value: 'south-west', ar: 'جنوبية غربية', en: 'South-West' },
]

export interface Property {
  id: number
  title: string
  images: string[]
  category: string // category value or custom label
  region: string // region value or custom label
  customRegion?: string
  dealType: DealType
  price: number
  size: number // sqm
  isCustomSize: boolean
  streetWidth: number // meters
  direction: string // direction value
  plotNumber: string
  description: string
  // location
  googleMapsUrl: string
  // restricted (admin only)
  ownerName: string
  ownerPhone: string
  guardPhone: string
}

export function findRegion(value: string): OptionItem | undefined {
  return REGIONS.find((r) => r.value === value)
}

export function findCategory(value: string): OptionItem | undefined {
  return CATEGORIES.find((c) => c.value === value)
}

export function findDirection(value: string): OptionItem | undefined {
  return DIRECTIONS.find((d) => d.value === value)
}

export function regionLabel(p: Property): string {
  if (p.customRegion) return p.customRegion
  return findRegion(p.region)?.ar ?? p.region
}

export function categoryLabel(p: Property): string {
  return findCategory(p.category)?.ar ?? p.category
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-SA').format(price)
}

export function formatSize(size: number): string {
  return new Intl.NumberFormat('ar-SA').format(size)
}

// Removed mock data

// Placeholder public contact WhatsApp number (fallback)
export const DEFAULT_WHATSAPP = '966500000000'
