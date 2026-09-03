'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { SearchX, AlertTriangle, ShieldCheck } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { FilterBar, EMPTY_FILTERS, type Filters } from '@/components/filter-bar'
import { PropertyCard } from '@/components/property-card'
import { PropertyDetail } from '@/components/property-detail'
import { AddPropertyDialog } from '@/components/add-property-dialog'
import { ContactRequestDialog } from '@/components/contact-request-dialog'
import { LeadsPanel, type Lead } from '@/components/leads-panel'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Field, TextInput } from '@/components/ui/field'
import { HubConnectionBuilder, HubConnectionState, LogLevel, type HubConnection } from '@microsoft/signalr'
import { STANDARD_SIZES, getNeighborhoodValuesForCity, type Property, API_BASE_URL } from '@/lib/real-estate'

// Helper to check if a JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function RealEstateApp({ mode }: { mode: 'public' | 'admin' }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMoreProperties, setHasMoreProperties] = useState(false)
  const [page, setPage] = useState(1)
  const [fetchError, setFetchError] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    fetchProperties()

    // Initialize SignalR connection with Auto-Reconnect
    const connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/property`)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Retry immediately, then 2s, 5s, 10s, 30s...
      .configureLogging(LogLevel.Warning)
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
      fetchProperties(true)
    })

    connection.start().catch(err => console.error('SignalR connection error: ', err))

    // Polling fallback: in case SignalR misses events (common on IIS/shared hosting),
    // re-sync with server every 30 seconds silently in the background.
    const pollInterval = setInterval(() => {
      if (connection.state !== HubConnectionState.Connected) {
        console.log('SignalR not connected, polling properties...')
        fetchProperties(true)
      }
    }, 30000)

    return () => {
      connection.stop()
      clearInterval(pollInterval)
    }
  }, [])

  const fetchProperties = async (isBackground = false, pageNum = 1) => {
    try {
      if (!isBackground && pageNum === 1) setIsLoading(true)
      setFetchError(false)
      const res = await fetch(`${API_BASE_URL}/api/properties?page=${pageNum}&limit=12`, {
        cache: 'no-store'
      })
      if (res.ok) {
        const responseData = await res.json()
        const items = responseData.data || []
        
        if (pageNum === 1) {
          setProperties(items)
        } else {
          setProperties(prev => {
            // Filter out duplicates just in case
            const existingIds = new Set(prev.map(p => p.id))
            const newItems = items.filter((p: Property) => !existingIds.has(p.id))
            return [...prev, ...newItems]
          })
        }
        
        setHasMoreProperties(items.length === 12)
      } else {
        setFetchError(true)
      }
    } catch (err) {
      console.error('Failed to fetch properties', err)
      setFetchError(true)
    } finally {
      if (!isBackground && pageNum === 1) setIsLoading(false)
    }
  }
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [selected, setSelected] = useState<Property | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null)
  const [contactProperty, setContactProperty] = useState<Property | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [showLeads, setShowLeads] = useState(false)

  const selectProperty = useCallback(async (property: Property) => {
    // If images are already loaded (e.g. from SignalR update), show directly
    if (property.images && property.images.length > 0) {
      setSelected(property)
      return
    }
    // Otherwise fetch full details including images
    setIsLoadingDetail(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/properties/${property.id}`, {
        cache: 'no-store'
      })
      if (res.ok) {
        const fullProperty = await res.json()
        setSelected(fullProperty)
      } else {
        // Fallback: show without images
        setSelected(property)
      }
    } catch {
      setSelected(property)
    } finally {
      setIsLoadingDetail(false)
    }
  }, [])

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      // City filter: show only properties in neighborhoods belonging to selected city
      if (filters.city && !filters.region) {
        const cityNeighborhoods = getNeighborhoodValuesForCity(filters.city)
        if (!cityNeighborhoods.includes(p.region)) return false
      }
      if (filters.region && p.region !== filters.region) return false
      if (filters.dealType && p.dealType !== filters.dealType) return false
      if (filters.category && p.category !== filters.category) return false
      if (filters.size) {
        if (filters.size === 'other') {
          if (!p.isCustomSize && STANDARD_SIZES.includes(p.size)) return false
        } else if (p.size !== Number(filters.size)) {
          return false
        }
      }
      return true
    })
  }, [properties, filters])

  // Auto-logout helper for 401 responses
  const handleAuthError = useCallback(() => {
    localStorage.removeItem('adminToken')
    setIsAdmin(false)
    setDeleteError('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.')
  }, [])

  useEffect(() => {
    if (mode === 'admin') {
      const token = localStorage.getItem('adminToken')
      if (token) {
        if (isTokenExpired(token)) {
          // Token expired, clean up
          localStorage.removeItem('adminToken')
        } else {
          setIsAdmin(true)
          fetchLeads(token)
        }
      }
    }
  }, [mode])

  const fetchLeads = async (token?: string) => {
    const t = token || localStorage.getItem('adminToken')
    if (!t) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/leads?page=1&limit=100`, {
        headers: { 'Authorization': `Bearer ${t}` },
        cache: 'no-store'
      })
      if (res.ok) {
        const responseData = await res.json()
        setLeads(responseData.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch leads', err)
    }
  }

  const handleMarkLeadAsRead = async (id: number) => {
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`${API_BASE_URL}/api/leads/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, isRead: true } : l))
      }
    } catch (err) {
      console.error('Failed to mark lead as read', err)
    }
  }

  const handleDeleteLead = async (id: number) => {
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`${API_BASE_URL}/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete lead', err)
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername.trim(), password: loginPassword })
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('adminToken', data.token)
        setLoginError('')
        setIsAdmin(true)
        fetchLeads(data.token)
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
    const idToDelete = propertyToDelete.id
    const deletedProperty = propertyToDelete

    // Check token before attempting
    if (!token || isTokenExpired(token)) {
      setPropertyToDelete(null)
      handleAuthError()
      return
    }

    // 1. OPTIMISTIC UPDATE: Remove from UI immediately before server response
    setPropertyToDelete(null)
    setDeleteError('')
    setProperties((prev) => prev.filter((p) => p.id !== idToDelete))
    if (selected?.id === idToDelete) {
      setSelected(null)
    }

    // 2. Send DELETE request to server in the background
    try {
      const res = await fetch(`${API_BASE_URL}/api/properties/${idToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) {
        if (res.status === 404) {
          // Already deleted on the server, treat as success (do nothing, optimistic update stands)
        } else {
          // Server failed: rollback the optimistic update
          setProperties((prev) => [deletedProperty, ...prev])
          if (res.status === 401) {
            handleAuthError()
          } else {
            setDeleteError('فشل حذف العقار. يرجى المحاولة مرة أخرى.')
          }
        }
      }
      // On success: SignalR will notify other connected devices automatically
    } catch (err) {
      // Network error: rollback the optimistic update
      console.error('Delete request failed, rolling back...', err)
      setProperties((prev) => [deletedProperty, ...prev])
      setDeleteError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.')
    }
  }

  const handleAddProperty = async (newProp: Property) => {
    const token = localStorage.getItem('adminToken')
    try {
      const formData = new FormData()
      formData.append('title', newProp.title)
      formData.append('description', newProp.description)
      formData.append('price', String(newProp.price))
      formData.append('region', newProp.region)
      if (newProp.customRegion) formData.append('customRegion', newProp.customRegion)
      formData.append('category', newProp.category)
      formData.append('dealType', newProp.dealType)
      formData.append('size', String(newProp.size))
      formData.append('isCustomSize', String(newProp.isCustomSize))
      formData.append('streetWidth', String(newProp.streetWidth))
      formData.append('direction', newProp.direction)
      formData.append('plotNumber', newProp.plotNumber)
      formData.append('googleMapsUrl', newProp.googleMapsUrl)
      formData.append('ownerName', newProp.ownerName)
      if (newProp.ownerPhone) formData.append('ownerPhone', newProp.ownerPhone)
      if (newProp.guardPhone) formData.append('guardPhone', newProp.guardPhone)

      if (newProp.images && newProp.images.length > 0) {
        for (let i = 0; i < newProp.images.length; i++) {
          const img = newProp.images[i]
          if (typeof img === 'string' && img.startsWith('data:image/')) {
            // Convert base64 to Blob
            const response = await fetch(img)
            const blob = await response.blob()
            formData.append('images', blob, `image_${i}.webp`)
          } else {
            // We can't really send plain URLs in the same field if the backend expects IFormFile
            // For now, new properties will always have base64 from the Add dialog
          }
        }
      }

      const res = await fetch(`${API_BASE_URL}/api/properties`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
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
        onLeadsClick={() => { fetchLeads(); setShowLeads(true) }}
        unreadLeadsCount={leads.filter(l => !l.isRead).length}
      />

      {/* Hero */}
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="text-2xl font-extrabold text-foreground text-balance sm:text-3xl">
            اعثر على عقارك المثالي مع <span className="text-gold">ماضي الثقة</span> العقارية
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            تصفّح مجموعة مختارة من الأراضي، الشاليهات، الاستراحات، الأحواش والغرف
            في أفضل أحياء الرياض والخرج.
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
            {deleteError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertTriangle className="size-4 shrink-0" />
                <span>{deleteError}</span>
                <button onClick={() => setDeleteError('')} className="mr-auto text-destructive/60 hover:text-destructive">✕</button>
              </div>
            )}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : fetchError ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 px-4 text-center">
                <AlertTriangle className="size-12 text-destructive mb-4" />
                <h3 className="text-lg font-bold text-foreground">فشل الاتصال بالخادم</h3>
                <p className="mt-1 mb-6 text-sm text-muted-foreground">
                  يبدو أن الخادم في وضع السكون أو يوجد مشكلة في الاتصال. يرجى المحاولة مرة أخرى.
                </p>
                <Button onClick={() => fetchProperties()} variant="outline">إعادة المحاولة</Button>
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
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {filtered.map((p) => (
                    <PropertyCard
                      key={p.id}
                      property={p}
                      isAdmin={effectiveIsAdmin}
                      onClick={() => selectProperty(p)}
                      onDelete={() => setPropertyToDelete(p)}
                    />
                  ))}
                </div>
                {hasMoreProperties && !filters.city && !filters.region && !filters.category && !filters.dealType && !filters.size && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const nextPage = page + 1
                        setPage(nextPage)
                        fetchProperties(false, nextPage)
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'جاري التحميل...' : 'عرض المزيد'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-primary">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 text-center sm:px-6">
          <p className="text-lg font-bold text-primary-foreground">
            <span className="text-gold">ماضي الثقة</span> العقارية
          </p>
          <p className="text-sm text-primary-foreground/60">
            الرياض · الخرج
          </p>
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} جميع الحقوق محفوظة — ماضي الثقة العقارية
          </p>
        </div>
      </footer>

      {/* Loading overlay for property detail fetch */}
      {isLoadingDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm font-medium text-muted-foreground">جاري تحميل التفاصيل...</p>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <PropertyDetail
        property={selected}
        isAdmin={effectiveIsAdmin}
        onClose={() => setSelected(null)}
        onContactRequest={(p) => { setSelected(null); setContactProperty(p) }}
      />
      <ContactRequestDialog
        open={!!contactProperty}
        property={contactProperty}
        onClose={() => setContactProperty(null)}
      />
      {mode === 'admin' && (
        <LeadsPanel
          open={showLeads}
          leads={leads}
          onClose={() => setShowLeads(false)}
          onMarkAsRead={handleMarkLeadAsRead}
          onDelete={handleDeleteLead}
        />
      )}
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
