'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Lock, Plus, Trash2, UploadCloud, MapPin } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Field, Select, TextArea, TextInput } from '@/components/ui/field'
import {
  CATEGORIES,
  DEAL_TYPES,
  DIRECTIONS,
  REGIONS,
  STANDARD_SIZES,
  formatSize,
  type DealType,
  type Property,
} from '@/lib/real-estate'
import { cn } from '@/lib/utils'

let idCounter = 1000

export function AddPropertyDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (p: Property) => void
}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('lands')
  const [region, setRegion] = useState('al-afiqah')
  const [customRegion, setCustomRegion] = useState('')
  const [dealType, setDealType] = useState<DealType>('sale')
  const [price, setPrice] = useState('')
  const [size, setSize] = useState('5000')
  const [customSize, setCustomSize] = useState('')
  const [streetWidth, setStreetWidth] = useState('')
  const [direction, setDirection] = useState('north')
  const [plotNumber, setPlotNumber] = useState('')
  const [description, setDescription] = useState('')
  const [googleMapsUrl, setGoogleMapsUrl] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('+966')
  const [guardPhone, setGuardPhone] = useState('+966')
  const [images, setImages] = useState<string[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع.')
      return
    }
    setIsDetectingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setGoogleMapsUrl(`https://www.google.com/maps?q=${latitude},${longitude}`)
        setIsDetectingLocation(false)
        setError('')
      },
      (err) => {
        setError('تعذر الحصول على الموقع. يرجى التأكد من إعطاء الصلاحيات.')
        setIsDetectingLocation(false)
      }
    )
  }

  const isOtherRegion = region === 'other'
  const isOtherSize = size === 'other'

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const urls = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => URL.createObjectURL(f))
    setImages((prev) => [...prev, ...urls])
  }

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    let val = e.target.value
    // Allow only digits and plus sign
    val = val.replace(/[^\d+]/g, '')
    // Must start with +966
    if (!val.startsWith('+966')) {
      val = '+966'
    }
    // Limit to 13 characters (+966 and 9 digits)
    if (val.length > 13) {
      val = val.slice(0, 13)
    }
    setter(val)
  }

  const reset = () => {
    setTitle('')
    setCategory('lands')
    setRegion('al-afiqah')
    setCustomRegion('')
    setDealType('sale')
    setPrice('')
    setSize('5000')
    setCustomSize('')
    setStreetWidth('')
    setDirection('north')
    setPlotNumber('')
    setDescription('')
    setGoogleMapsUrl('')
    setOwnerName('')
    setOwnerPhone('+966')
    setGuardPhone('+966')
    setImages([])
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return setError('الرجاء إدخال عنوان العقار')
    if (!price) return setError('الرجاء إدخال السعر')
    if (isOtherRegion && !customRegion.trim())
      return setError('الرجاء إدخال اسم المنطقة المخصصة')
    if (isOtherSize && !customSize)
      return setError('الرجاء إدخال المساحة المخصصة')

    if (ownerPhone !== '+966' && ownerPhone.length !== 13)
      return setError('رقم جوال المالك يجب أن يكون بصيغة +966 متبوعاً بـ 9 أرقام')

    if (guardPhone !== '+966' && guardPhone.length !== 13)
      return setError('رقم جوال الحارس يجب أن يكون بصيغة +966 متبوعاً بـ 9 أرقام')

    const finalSize = isOtherSize ? Number(customSize) : Number(size)

    const property: Property = {
      id: 0,
      title: title.trim(),
      images: images.length ? images : ['/placeholder.svg?height=400&width=600'],
      category,
      region: isOtherRegion ? 'other' : region,
      customRegion: isOtherRegion ? customRegion.trim() : undefined,
      dealType,
      price: Number(price),
      size: finalSize,
      isCustomSize: isOtherSize,
      streetWidth: Number(streetWidth) || 0,
      direction,
      plotNumber: plotNumber.trim() || '—',
      description: description.trim() || 'لا يوجد وصف.',
      googleMapsUrl: googleMapsUrl.trim() || 'https://maps.google.com',
      ownerName: ownerName.trim() || '—',
      ownerPhone: ownerPhone === '+966' ? '' : ownerPhone,
      guardPhone: guardPhone === '+966' ? '' : guardPhone,
    }

    onAdd(property)
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-3xl" labelledBy="add-title">
      <form onSubmit={handleSubmit} className="p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Plus className="size-5" />
          </div>
          <h2 id="add-title" className="text-xl font-extrabold text-foreground">
            إضافة عقار جديد
          </h2>
        </div>

        {/* Deal type toggle */}
        <div className="mb-4">
          <p className="mb-1.5 text-sm font-semibold text-foreground">نوع العرض</p>
          <div className="grid max-w-xs grid-cols-2 gap-1 rounded-xl bg-muted p-1">
            {DEAL_TYPES.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDealType(d.value)}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                  dealType === d.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {d.ar}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="عنوان العقار" htmlFor="p-title" className="sm:col-span-2">
            <TextInput
              id="p-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: أرض سكنية في العفجة"
            />
          </Field>

          <Field label="التصنيف" htmlFor="p-category">
            <Select id="p-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.ar}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="المنطقة" htmlFor="p-region">
            <Select id="p-region" value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.ar}
                </option>
              ))}
              <option value="other">أخرى</option>
            </Select>
          </Field>

          {/* Dynamic custom region */}
          {isOtherRegion && (
            <Field label="اسم المنطقة المخصصة" htmlFor="p-custom-region" className="sm:col-span-2">
              <TextInput
                id="p-custom-region"
                value={customRegion}
                onChange={(e) => setCustomRegion(e.target.value)}
                placeholder="اكتب اسم المنطقة"
              />
            </Field>
          )}

          <Field label="المساحة (م)" htmlFor="p-size">
            <Select id="p-size" value={size} onChange={(e) => setSize(e.target.value)}>
              {STANDARD_SIZES.map((s) => (
                <option key={s} value={String(s)}>
                  {formatSize(s)} م
                </option>
              ))}
              <option value="other">أخرى</option>
            </Select>
          </Field>

          {/* Dynamic custom size */}
          {isOtherSize && (
            <Field label="المساحة المخصصة (م)" htmlFor="p-custom-size">
              <TextInput
                id="p-custom-size"
                type="number"
                min="0"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                placeholder="أدخل المساحة بالأمتار المربعة"
              />
            </Field>
          )}

          <Field label={`السعر (ريال)${dealType === 'rent' ? ' / شهرياً' : ''}`} htmlFor="p-price">
            <TextInput
              id="p-price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
            />
          </Field>

          <Field label="عرض الشارع (م)" htmlFor="p-street">
            <TextInput
              id="p-street"
              type="number"
              min="0"
              value={streetWidth}
              onChange={(e) => setStreetWidth(e.target.value)}
              placeholder="20"
            />
          </Field>

          <Field label="الاتجاه" htmlFor="p-direction">
            <Select
              id="p-direction"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            >
              {DIRECTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.ar}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="رقم القطعة" htmlFor="p-plot">
            <TextInput
              id="p-plot"
              value={plotNumber}
              onChange={(e) => setPlotNumber(e.target.value)}
              placeholder="A-142"
            />
          </Field>

          <Field label="رابط موقع جوجل ماب" htmlFor="p-gmaps" className="sm:col-span-2">
            <div className="flex flex-col gap-2 sm:flex-row">
              <TextInput
                id="p-gmaps"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                dir="ltr"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
                className="whitespace-nowrap h-10"
              >
                <MapPin className="size-4 ml-2" />
                {isDetectingLocation ? 'جاري التحديد...' : 'تحديد موقعي'}
              </Button>
            </div>
          </Field>

          <Field label="الوصف" htmlFor="p-desc" className="sm:col-span-2">
            <TextArea
              id="p-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب وصفاً تفصيلياً للعقار..."
            />
          </Field>
        </div>

        {/* Image dropzone */}
        <div className="mt-5">
          <p className="mb-1.5 text-sm font-semibold text-foreground">الصور</p>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click()
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              addFiles(e.dataTransfer.files)
            }}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors',
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-border bg-muted/40 hover:border-primary/50',
            )}
          >
            <UploadCloud className="size-8 text-primary" />
            <p className="text-sm font-medium text-foreground">
              اسحب الصور هنا أو اضغط للرفع
            </p>
            <p className="text-xs text-muted-foreground">يمكنك رفع أكثر من صورة</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {images.map((src, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src || '/placeholder.svg'} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="حذف الصورة"
                    className="absolute left-1 top-1 flex size-7 items-center justify-center rounded-full bg-foreground/70 text-background opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                aria-label="إضافة المزيد"
              >
                <ImagePlus className="size-6" />
              </button>
            </div>
          )}
        </div>

        {/* Restricted section */}
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Lock className="size-4" />
            <h3 className="text-sm font-bold">معلومات خاصة (تظهر للمشرف فقط)</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="اسم المالك" htmlFor="p-owner">
              <TextInput
                id="p-owner"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="الاسم"
              />
            </Field>
            <Field label="جوال المالك" htmlFor="p-owner-phone">
              <TextInput
                id="p-owner-phone"
                value={ownerPhone}
                onChange={(e) => handlePhoneChange(e, setOwnerPhone)}
                placeholder="+9665xxxxxxxx"
                dir="ltr"
              />
            </Field>
            <Field label="جوال الحارس" htmlFor="p-guard-phone">
              <TextInput
                id="p-guard-phone"
                value={guardPhone}
                onChange={(e) => handlePhoneChange(e, setGuardPhone)}
                placeholder="+9665xxxxxxxx"
                dir="ltr"
              />
            </Field>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" size="lg" className="h-11" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit" size="lg" className="h-11">
            <Plus className="size-5" />
            نشر العقار
          </Button>
        </div>
      </form>
    </Modal>
  )
}
