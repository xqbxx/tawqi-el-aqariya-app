'use client'

import { useState } from 'react'
import { PhoneCall, User, Send, CheckCircle2, X } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Field, TextInput } from '@/components/ui/field'
import { API_BASE_URL, type Property } from '@/lib/real-estate'

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
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const resetForm = () => {
    setName('')
    setPhone('')
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

    if (phone.length !== 9 || !phone.startsWith('5')) {
      setError('الرجاء إدخال رقم جوال صحيح يتكون من 9 أرقام ويبدأ بـ 5')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: `+966${phone}`,
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
                  <div className="flex w-full" dir="ltr">
                    <div className="flex items-center justify-center rounded-l-xl border border-r-0 border-border bg-muted px-4 py-2 text-sm font-bold text-muted-foreground">
                      +966
                    </div>
                    <input
                      id="lead-phone"
                      type="tel"
                      className="flex-1 rounded-r-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                      value={phone}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '')
                        // If they pasted a number containing the country code
                        if (val.startsWith('9665')) {
                          val = val.slice(3)
                        } else if (val.startsWith('05')) {
                          val = val.slice(1)
                        }
                        // Only allow up to 9 digits
                        if (val.length > 9) val = val.slice(0, 9)
                        // If it's the first digit, ensure it's a 5
                        if (val.length > 0 && val[0] !== '5') val = '5'
                        setPhone(val)
                      }}
                      placeholder="5XXXXXXXX"
                      autoComplete="tel-local"
                    />
                  </div>
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
