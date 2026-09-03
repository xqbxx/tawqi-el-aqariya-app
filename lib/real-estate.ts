// Domain constants, types and data for ماضي الثقة العقارية (Madi Al-Thiqa Real Estate)

export type DealType = 'sale' | 'rent'

export interface OptionItem {
  value: string
  ar: string
  en: string
}

export interface NeighborhoodItem extends OptionItem {
  city: string
}

// Cities
export const CITIES: OptionItem[] = [
  { value: 'riyadh', ar: 'الرياض', en: 'Riyadh' },
  { value: 'kharj', ar: 'الخرج', en: 'Al Kharj' },
]

// Neighborhoods by city
export const NEIGHBORHOODS: NeighborhoodItem[] = [
  // ---- الرياض ----
  { value: 'al-olaya', ar: 'العليا', en: 'Al Olaya', city: 'riyadh' },
  { value: 'al-malaz', ar: 'الملز', en: 'Al Malaz', city: 'riyadh' },
  { value: 'al-naseem', ar: 'النسيم', en: 'Al Naseem', city: 'riyadh' },
  { value: 'al-rawdah', ar: 'الروضة', en: 'Al Rawdah', city: 'riyadh' },
  { value: 'al-hamra', ar: 'الحمراء', en: 'Al Hamra', city: 'riyadh' },
  { value: 'al-yasmin', ar: 'الياسمين', en: 'Al Yasmin', city: 'riyadh' },
  { value: 'al-malqa', ar: 'الملقا', en: 'Al Malqa', city: 'riyadh' },
  { value: 'hittin', ar: 'حطين', en: 'Hittin', city: 'riyadh' },
  { value: 'al-sahafah', ar: 'الصحافة', en: 'Al Sahafah', city: 'riyadh' },
  { value: 'al-rabee', ar: 'الربيع', en: 'Al Rabee', city: 'riyadh' },
  { value: 'al-aqeeq', ar: 'العقيق', en: 'Al Aqeeq', city: 'riyadh' },
  { value: 'al-ghadeer', ar: 'الغدير', en: 'Al Ghadeer', city: 'riyadh' },
  { value: 'al-narjis', ar: 'النرجس', en: 'Al Narjis', city: 'riyadh' },
  { value: 'al-arid', ar: 'العارض', en: 'Al Arid', city: 'riyadh' },
  { value: 'al-rimal', ar: 'الرمال', en: 'Al Rimal', city: 'riyadh' },
  { value: 'al-murooj', ar: 'المروج', en: 'Al Murooj', city: 'riyadh' },
  { value: 'al-qairawan', ar: 'القيروان', en: 'Al Qairawan', city: 'riyadh' },
  { value: 'al-khuzama', ar: 'الخزامى', en: 'Al Khuzama', city: 'riyadh' },
  { value: 'al-wurood', ar: 'الورود', en: 'Al Wurood', city: 'riyadh' },
  { value: 'al-mohammadiyah', ar: 'المحمدية', en: 'Al Mohammadiyah', city: 'riyadh' },
  { value: 'al-suwaidi', ar: 'السويدي', en: 'Al Suwaidi', city: 'riyadh' },
  { value: 'al-shifa', ar: 'الشفا', en: 'Al Shifa', city: 'riyadh' },
  { value: 'al-aziziyah-r', ar: 'العزيزية', en: 'Al Aziziyah', city: 'riyadh' },
  { value: 'al-dar-al-baida', ar: 'الدار البيضاء', en: 'Al Dar Al Baida', city: 'riyadh' },
  { value: 'laban', ar: 'لبن', en: 'Laban', city: 'riyadh' },
  { value: 'dhahrat-laban', ar: 'ظهرة لبن', en: 'Dhahrat Laban', city: 'riyadh' },
  { value: 'irqah', ar: 'عرقة', en: 'Irqah', city: 'riyadh' },
  { value: 'tuwaiq', ar: 'طويق', en: 'Tuwaiq', city: 'riyadh' },
  { value: 'badr', ar: 'بدر', en: 'Badr', city: 'riyadh' },
  { value: 'al-mahdiyah', ar: 'المهدية', en: 'Al Mahdiyah', city: 'riyadh' },
  { value: 'umm-al-hamam', ar: 'أم الحمام', en: 'Umm Al Hamam', city: 'riyadh' },
  { value: 'al-falah', ar: 'الفلاح', en: 'Al Falah', city: 'riyadh' },
  { value: 'al-fayha', ar: 'الفيحاء', en: 'Al Fayha', city: 'riyadh' },
  { value: 'al-manar', ar: 'المنار', en: 'Al Manar', city: 'riyadh' },
  { value: 'al-muathar', ar: 'المعذر', en: 'Al Muathar', city: 'riyadh' },
  { value: 'al-wadi', ar: 'الوادي', en: 'Al Wadi', city: 'riyadh' },
  { value: 'al-nada', ar: 'الندى', en: 'Al Nada', city: 'riyadh' },
  { value: 'al-quds', ar: 'القدس', en: 'Al Quds', city: 'riyadh' },
  { value: 'al-hazm', ar: 'الحزم', en: 'Al Hazm', city: 'riyadh' },
  { value: 'al-izdihar', ar: 'الازدهار', en: 'Al Izdihar', city: 'riyadh' },
  { value: 'al-nahdah', ar: 'النهضة', en: 'Al Nahdah', city: 'riyadh' },
  { value: 'al-munsiyah', ar: 'المونسية', en: 'Al Munsiyah', city: 'riyadh' },
  { value: 'ishbiliyah', ar: 'اشبيلية', en: 'Ishbiliyah', city: 'riyadh' },
  { value: 'qurtubah', ar: 'قرطبة', en: 'Qurtubah', city: 'riyadh' },
  { value: 'ghirnatah', ar: 'غرناطة', en: 'Ghirnatah', city: 'riyadh' },
  { value: 'al-rawabi', ar: 'الروابي', en: 'Al Rawabi', city: 'riyadh' },
  { value: 'al-khaleej', ar: 'الخليج', en: 'Al Khaleej', city: 'riyadh' },
  { value: 'al-rayyan-r', ar: 'الريان', en: 'Al Rayyan', city: 'riyadh' },
  { value: 'al-salam-r', ar: 'السلام', en: 'Al Salam', city: 'riyadh' },
  { value: 'al-nakheel-r', ar: 'النخيل', en: 'Al Nakheel', city: 'riyadh' },
  { value: 'al-rahmaniya-r', ar: 'الرحمانية', en: 'Al Rahmaniya', city: 'riyadh' },
  { value: 'al-dirah', ar: 'الديرة', en: 'Al Dirah', city: 'riyadh' },
  { value: 'al-batha', ar: 'البطحاء', en: 'Al Batha', city: 'riyadh' },
  { value: 'al-slay', ar: 'السلي', en: 'Al Slay', city: 'riyadh' },
  { value: 'al-janadriyah', ar: 'الجنادرية', en: 'Al Janadriyah', city: 'riyadh' },
  { value: 'al-takhassusi', ar: 'التخصصي', en: 'Al Takhassusi', city: 'riyadh' },
  { value: 'al-nafal', ar: 'النفل', en: 'Al Nafal', city: 'riyadh' },
  { value: 'al-muruj', ar: 'المرسلات', en: 'Al Mursalat', city: 'riyadh' },
  { value: 'al-hamra-r', ar: 'حمراء الرياض', en: 'Hamra Riyadh', city: 'riyadh' },

  // ---- الخرج ----
  { value: 'al-afiqah', ar: 'العفجة', en: 'Al Afiqah', city: 'kharj' },
  { value: 'najdiya', ar: 'نجدية', en: 'Najdiya', city: 'kharj' },
  { value: 'al-nakheel', ar: 'النخيل السكني', en: 'Al Nakheel Residential', city: 'kharj' },
  { value: 'al-rahmaniya', ar: 'الرحمانية', en: 'Al Rahmaniya', city: 'kharj' },
  { value: 'al-khalidiyah', ar: 'الخالدية', en: 'Al Khalidiyah', city: 'kharj' },
  { value: 'al-sinaiyah', ar: 'الصناعية', en: 'Al Sinaiyah', city: 'kharj' },
  { value: 'al-safa', ar: 'الصفا', en: 'Al Safa', city: 'kharj' },
  { value: 'al-muntazah', ar: 'المنتزه', en: 'Al Muntazah', city: 'kharj' },
  { value: 'al-rashidiyah', ar: 'الراشدية', en: 'Al Rashidiyah', city: 'kharj' },
  { value: 'al-wurood-k', ar: 'الورود', en: 'Al Wurood', city: 'kharj' },
  { value: 'al-aziziyah-k', ar: 'العزيزية', en: 'Al Aziziyah', city: 'kharj' },
  { value: 'al-rayyan-k', ar: 'الريان', en: 'Al Rayyan', city: 'kharj' },
  { value: 'al-wahah', ar: 'الواحة', en: 'Al Wahah', city: 'kharj' },
  { value: 'al-faisaliyah', ar: 'الفيصلية', en: 'Al Faisaliyah', city: 'kharj' },
  { value: 'al-salam-k', ar: 'السلام', en: 'Al Salam', city: 'kharj' },
]

// Backward compatibility: flat REGIONS array (all neighborhoods)
export const REGIONS: NeighborhoodItem[] = NEIGHBORHOODS

// Helper to get neighborhoods by city
export function getNeighborhoodsByCity(city: string): NeighborhoodItem[] {
  if (!city) return NEIGHBORHOODS
  return NEIGHBORHOODS.filter((n) => n.city === city)
}

// Helper to get neighborhood values for a city (for filtering)
export function getNeighborhoodValuesForCity(city: string): string[] {
  return getNeighborhoodsByCity(city).map((n) => n.value)
}

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
  category: string
  region: string
  customRegion?: string
  dealType: DealType
  price: number
  size: number
  isCustomSize: boolean
  streetWidth: number
  direction: string
  plotNumber: string
  description: string
  googleMapsUrl: string
  ownerName: string
  ownerPhone: string
  guardPhone: string
}

export function findRegion(value: string): OptionItem | undefined {
  return NEIGHBORHOODS.find((r) => r.value === value)
}

export function findNeighborhood(value: string): NeighborhoodItem | undefined {
  return NEIGHBORHOODS.find((n) => n.value === value)
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

export function cityLabel(p: Property): string {
  const neighborhood = findNeighborhood(p.region)
  if (neighborhood) {
    const city = CITIES.find((c) => c.value === neighborhood.city)
    return city?.ar ?? ''
  }
  return ''
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

// API & Contact
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.tawqielaqariya.com'
export const DEFAULT_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966507127018'
