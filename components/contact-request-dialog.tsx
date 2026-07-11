'use client'

import { useState } from 'react'
import { PhoneCall, User, Send, CheckCircle2, X } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Field, TextInput } from '@/components/ui/field'
import type { Property } from '@/lib/real-estate'

export function ContactRequestDialog({
  open,
  property,
  onClose,
}: {
  open: boolean
  property: Property | null
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+966')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const resetForm = () => {
    setName('')
    setPhone('+966')
    setError('')
    setIsSuccess(false)
    setIsSubmitting(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('الرجاء إدخال الاسم')
      return
    }

    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length !== 12) {
      setError('الرجاء إدخال رقم جوال صحيح (مثال: +966512345678)')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('https://api.tawqielaqariya.com/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          propertyId: property?.id ?? 0,
          propertyTitle: property?.title ?? '',
        }),
      })

      if (res.ok) {
        setIsSuccess(true)
      } else {
        setError('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.')
      }
    } catch {
      setError('حدث خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!property) return null

  return (
    <Modal open={open} onClose={handleClose} className="max-w-md" labelledBy="contact-title">
      <div className="p-5 sm:p-6">
        {isSuccess ? (
          <div className="flex flex-col items-center text-center py-6">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-500/10 text-green-500 mb-4">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-xl font-extrabold text-foreground mb-2">تم إرسال طلبك بنجاح!</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              سيتم التواصل معك قريباً بخصوص العقار
              <br />
              <span className="font-bold text-foreground">&quot;{property.title}&quot;</span>
            </p>
            <Button onClick={handleClose} size="lg" className="h-12 w-full max-w-xs">
              حسناً
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <PhoneCall className="size-7" />
              </div>
              <h2 id="contact-title" className="mt-3 text-xl font-extrabold text-foreground">
                اطلب تفاصيل أكثر
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                اترك بياناتك وسنتواصل معك بخصوص &quot;{property.title}&quot;
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <Field label="الاسم" htmlFor="lead-name">
                  <TextInput
                    id="lead-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسمك الكريم"
                    autoComplete="name"
                  />
                </Field>

                <Field label="رقم الجوال" htmlFor="lead-phone">
                  <TextInput
                    id="lead-phone"
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => {
                      let val = e.target.value
                      if (!val.startsWith('+966')) val = '+966'
                      setPhone(val)
                    }}
                    placeholder="+966512345678"
                    autoComplete="tel"
                  />
                </Field>

                {error && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="mt-1 h-12 w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <Send className="size-4" />
                      إرسال الطلب
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  )
}
