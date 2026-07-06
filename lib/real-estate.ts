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
  id: string
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

// ---- Mock data ----
export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p1',
    title: 'أرض سكنية في العفجة',
    images: ['/properties/land-1.png', '/properties/yard-1.png'],
    category: 'lands',
    region: 'al-afiqah',
    dealType: 'sale',
    price: 1250000,
    size: 10000,
    isCustomSize: false,
    streetWidth: 20,
    direction: 'north',
    plotNumber: 'A-142',
    description:
      'أرض سكنية مسورة على شارعين، موقع مميز قريب من الخدمات، صك إلكتروني جاهز للإفراغ الفوري.',
    googleMapsUrl: 'https://maps.app.goo.gl/placeholder1',
    ownerName: 'عبدالله المطيري',
    ownerPhone: '966500000001',
    guardPhone: '966500000011',
  },
  {
    id: 'p2',
    title: 'شاليه فاخر بمسبح',
    images: ['/properties/chalet-1.png', '/properties/chalet-2.png'],
    category: 'chalets',
    region: 'al-rahmaniya',
    dealType: 'rent',
    price: 1500,
    size: 5000,
    isCustomSize: false,
    streetWidth: 15,
    direction: 'west',
    plotNumber: 'C-07',
    description:
      'شاليه فخم يحتوي على مسبح خاص، جلسات خارجية، ومسطحات خضراء. مناسب للعائلات والمناسبات.',
    googleMapsUrl: 'https://maps.app.goo.gl/placeholder2',
    ownerName: 'سعد القحطاني',
    ownerPhone: '966500000002',
    guardPhone: '966500000012',
  },
  {
    id: 'p3',
    title: 'استراحة بمجلس خارجي',
    images: ['/properties/resthouse-1.png', '/properties/chalet-1.png'],
    category: 'rest-houses',
    region: 'najdiya',
    dealType: 'rent',
    price: 2200,
    size: 15000,
    isCustomSize: false,
    streetWidth: 25,
    direction: 'south-east',
    plotNumber: 'R-33',
    description:
      'استراحة واسعة تحتوي على مجلس رجال ومطبخ مجهز وحديقة كبيرة مع إضاءات ليلية.',
    googleMapsUrl: 'https://maps.app.goo.gl/placeholder3',
    ownerName: 'فيصل العتيبي',
    ownerPhone: '966500000003',
    guardPhone: '966500000013',
  },
  {
    id: 'p4',
    title: 'حوش تجاري مسور',
    images: ['/properties/yard-1.png', '/properties/land-1.png'],
    category: 'yards',
    region: 'al-nakheel',
    dealType: 'sale',
    price: 850000,
    size: 20000,
    isCustomSize: false,
    streetWidth: 30,
    direction: 'east',
    plotNumber: 'Y-88',
    description:
      'حوش مسور بالكامل مع بوابة حديدية، مناسب للتخزين أو المشاريع التجارية.',
    googleMapsUrl: 'https://maps.app.goo.gl/placeholder4',
    ownerName: 'ناصر الدوسري',
    ownerPhone: '966500000004',
    guardPhone: '966500000014',
  },
  {
    id: 'p5',
    title: 'غرفة مفروشة للإيجار',
    images: ['/properties/room-1.png'],
    category: 'rooms',
    region: 'al-rahmaniya',
    dealType: 'rent',
    price: 900,
    size: 12500,
    isCustomSize: true,
    streetWidth: 12,
    direction: 'north-west',
    plotNumber: 'RM-15',
    description:
      'غرفة مفروشة نظيفة مع دورة مياه خاصة وتكييف، قريبة من المواصلات والخدمات.',
    googleMapsUrl: 'https://maps.app.goo.gl/placeholder5',
    ownerName: 'ماجد الشمري',
    ownerPhone: '966500000005',
    guardPhone: '966500000015',
  },
  {
    id: 'p6',
    title: 'أرض زراعية كبيرة',
    images: ['/properties/land-1.png', '/properties/resthouse-1.png'],
    category: 'lands',
    region: 'najdiya',
    dealType: 'sale',
    price: 3100000,
    size: 25000,
    isCustomSize: false,
    streetWidth: 40,
    direction: 'south',
    plotNumber: 'A-201',
    description:
      'أرض زراعية واسعة مع بئر ماء، صالحة للاستثمار الزراعي أو التقسيم.',
    googleMapsUrl: 'https://maps.app.goo.gl/placeholder6',
    ownerName: 'تركي الحربي',
    ownerPhone: '966500000006',
    guardPhone: '966500000016',
  },
  {
    id: 'p7',
    title: 'شاليه اقتصادي',
    images: ['/properties/chalet-2.png', '/properties/chalet-1.png'],
    category: 'chalets',
    region: 'al-afiqah',
    dealType: 'rent',
    price: 800,
    size: 7500,
    isCustomSize: true,
    streetWidth: 15,
    direction: 'west',
    plotNumber: 'C-19',
    description:
      'شاليه بمساحة مخصصة غير قياسية، يحتوي على مسبح صغير وجلسة خارجية، أسعار مناسبة.',
    googleMapsUrl: 'https://maps.app.goo.gl/placeholder7',
    ownerName: 'خالد السبيعي',
    ownerPhone: '966500000007',
    guardPhone: '966500000017',
  },
  {
    id: 'p8',
    title: 'استراحة عائلية',
    images: ['/properties/resthouse-1.png', '/properties/yard-1.png'],
    category: 'rest-houses',
    region: 'al-nakheel',
    dealType: 'sale',
    price: 1750000,
    size: 5000,
    isCustomSize: false,
    streetWidth: 20,
    direction: 'north-east',
    plotNumber: 'R-45',
    description:
      'استراحة عائلية مع قسم داخلي وخارجي، مسطحات خضراء وألعاب أطفال.',
    googleMapsUrl: 'https://maps.app.goo.gl/placeholder8',
    ownerName: 'بندر الرشيدي',
    ownerPhone: '966500000008',
    guardPhone: '966500000018',
  },
]

// Placeholder admin credentials (frontend-only demo)
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
}

// Placeholder public contact WhatsApp number (fallback)
export const DEFAULT_WHATSAPP = '966500000000'
