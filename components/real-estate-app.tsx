'use client'

import { useMemo, useState } from 'react'
import { SearchX, AlertTriangle } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { FilterBar, EMPTY_FILTERS, type Filters } from '@/components/filter-bar'
import { PropertyCard } from '@/components/property-card'
import { PropertyDetail } from '@/components/property-detail'
import { LoginDialog } from '@/components/login-dialog'
import { AddPropertyDialog } from '@/components/add-property-dialog'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { MOCK_PROPERTIES, STANDARD_SIZES, type Property } from '@/lib/real-estate'

export function RealEstateApp() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES)
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [selected, setSelected] = useState<Property | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onLogout={() => setIsAdmin(false)}
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
            {filtered.length === 0 ? (
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
                    isAdmin={isAdmin}
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
      <PropertyDetail property={selected} isAdmin={isAdmin} onClose={() => setSelected(null)} />
      <LoginDialog
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => {
          setIsAdmin(true)
          setShowLogin(false)
        }}
      />
      <AddPropertyDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={(p) => setProperties((prev) => [p, ...prev])}
      />
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
            onClick={() => {
              if (propertyToDelete) {
                setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete.id))
                if (selected?.id === propertyToDelete.id) {
                  setSelected(null)
                }
                setPropertyToDelete(null)
              }
            }}
          >
            تأكيد الحذف
          </Button>
        </div>
      </Modal>
    </div>
  )
}
