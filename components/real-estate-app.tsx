'use client'

import { useMemo, useState, useEffect } from 'react'
import { SearchX, AlertTriangle, ShieldCheck } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { FilterBar, EMPTY_FILTERS, type Filters } from '@/components/filter-bar'
import { PropertyCard } from '@/components/property-card'
import { PropertyDetail } from '@/components/property-detail'
import { AddPropertyDialog } from '@/components/add-property-dialog'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Field, TextInput } from '@/components/ui/field'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { STANDARD_SIZES, type Property } from '@/lib/real-estate'

export function RealEstateApp({ mode }: { mode: 'public' | 'admin' }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProperties()

    // Initialize SignalR connection with Auto-Reconnect
    const connection = new HubConnectionBuilder()
      .withUrl('https://tawqi-1.runasp.net/hubs/property')
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Retry immediately, then 2s, 5s, 10s, 30s...
      .configureLogging(LogLevel.Information)
      .build()

    connection.on('PropertyAdded', (newProp: Property) => {
      setProperties(prev => prev.some(p => p.id === newProp.id) ? prev : [newProp, ...prev])
    })

    connection.on('PropertyUpdated', (updatedProp: Property) => {
      setProperties(prev => prev.map(p => p.id === updatedProp.id ? updatedProp : p))
    })

    connection.on('PropertyDeleted', (deletedId: number) => {
      setProperties(prev => prev.filter(p => p.id !== deletedId))
      setSelected(prev => prev?.id === deletedId ? null : prev)
    })

    connection.onreconnected(() => {
      // If the connection drops and reconnects, fetch full list to catch missed events
      console.log('SignalR reconnected. Refetching properties...')
      fetchProperties()
    })

    connection.start().catch(err => console.error('SignalR connection error: ', err))

    return () => {
      connection.stop()
    }
  }, [])

  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('https://tawqi-1.runasp.net/api/properties')
      if (res.ok) {
        const data = await res.json()
        setProperties(data)
      }
    } catch (err) {
      console.error('Failed to fetch properties', err)
    } finally {
      setIsLoading(false)
    }
  }
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [selected, setSelected] = useState<Property | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null)

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (filters.region && p.region !== filters.region) return false
      if (filters.dealType && p.dealType !== filters.dealType) return false
      if (filters.category && p.category !== filters.category) return false
      if (filters.size) {
        if (filters.size === 'other') {
          // custom / non-standard sizes
          if (!p.isCustomSize && STANDARD_SIZES.includes(p.size)) return false
        } else if (p.size !== Number(filters.size)) {
          return false
        }
      }
      return true
    })
  }, [properties, filters])

  useEffect(() => {
    if (mode === 'admin') {
      const token = localStorage.getItem('adminToken')
      if (token) setIsAdmin(true)
    }
  }, [mode])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('https://tawqi-1.runasp.net/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername.trim(), password: loginPassword })
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('adminToken', data.token)
        setLoginError('')
        setIsAdmin(true)
      } else {
        setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة')
      }
    } catch (err) {
      setLoginError('حدث خطأ في الاتصال بالخادم')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAdmin(false)
  }

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`https://tawqi-1.runasp.net/api/properties/${propertyToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete.id))
        if (selected?.id === propertyToDelete.id) {
          setSelected(null)
        }
      } else {
        console.error('Failed to delete property on server')
      }
    } catch (err) {
      console.error('Delete request failed', err)
    } finally {
      setPropertyToDelete(null)
    }
  }

  const handleAddProperty = async (newProp: Property) => {
    const token = localStorage.getItem('adminToken')
    try {
      // Remove id before sending, let DB generate it
      const { id, ...propData } = newProp as any
      const res = await fetch('https://tawqi-1.runasp.net/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propData)
      })
      if (res.ok) {
        const created = await res.json()
        setProperties((prev) => [created, ...prev])
      } else {
        console.error('Failed to add property on server')
      }
    } catch (err) {
      console.error('Add request failed', err)
    }
  }

  if (mode === 'admin' && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar mode="admin" isAdmin={false} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-sm p-6">
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-5 flex flex-col items-center text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-7" />
                </div>
                <h2 className="mt-3 text-xl font-extrabold text-foreground">دخول المشرف</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  الرجاء إدخال بيانات الدخول للوصول إلى لوحة الإدارة
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Field label="اسم المستخدم" htmlFor="username">
                  <TextInput
                    id="username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="admin"
                    autoComplete="username"
                  />
                </Field>
                <Field label="كلمة المرور" htmlFor="password">
                  <TextInput
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </Field>

                {loginError && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                    {loginError}
                  </p>
                )}

                <Button type="submit" size="lg" className="mt-1 h-12 w-full">
                  تسجيل الدخول
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Force isAdmin to false in public mode to prevent any admin features from showing
  const effectiveIsAdmin = mode === 'admin' ? isAdmin : false

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        mode={mode}
        isAdmin={effectiveIsAdmin}
        onLogout={handleLogout}
        onAddProperty={() => setShowAdd(true)}
      />

      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <h1 className="text-2xl font-extrabold text-foreground text-balance sm:text-3xl">
            اعثر على عقارك المثالي مع توقيع العقارية
          </h1>
          <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
            تصفّح مجموعة مختارة من الأراضي، الشاليهات، الاستراحات، الأحواش والغرف في أفضل المناطق.
            استخدم أدوات التصفية للوصول إلى ما يناسبك بسهولة.
          </p>
        </div>
      </section>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <FilterBar filters={filters} onChange={setFilters} resultCount={filtered.length} />
          </div>

          <div>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
                <SearchX className="size-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-bold text-foreground">لا توجد عقارات مطابقة</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  جرّب تعديل خيارات التصفية للحصول على نتائج.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filtered.map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    isAdmin={effectiveIsAdmin}
                    onClick={() => setSelected(p)}
                    onDelete={() => setPropertyToDelete(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-6 text-center sm:px-6">
          <div className="flex items-center justify-center rounded-xl bg-primary px-4 py-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="شعار توقيع العقارية" className="h-10 w-auto" />
          </div>
          <p className="mt-1 text-sm font-semibold text-foreground">توقيع العقارية</p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} جميع الحقوق محفوظة
          </p>
        </div>
      </footer>

      {/* Dialogs */}
      <PropertyDetail property={selected} isAdmin={effectiveIsAdmin} onClose={() => setSelected(null)} />
      {mode === 'admin' && (
        <AddPropertyDialog
          open={showAdd}
          onClose={() => setShowAdd(false)}
          onAdd={handleAddProperty}
        />
      )}
      <Modal
        open={!!propertyToDelete}
        onClose={() => setPropertyToDelete(null)}
        className="max-w-md p-6 text-center"
      >
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-foreground">تأكيد الحذف</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          هل أنت متأكد من أنك تريد حذف "{propertyToDelete?.title}"؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => setPropertyToDelete(null)}>
            إلغاء
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteProperty}
          >
            تأكيد الحذف
          </Button>
        </div>
      </Modal>
    </div>
  )
}
