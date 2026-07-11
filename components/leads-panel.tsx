'use client'

import { useState } from 'react'
import {
  Phone,
  Trash2,
  CheckCircle2,
  Clock,
  Building2,
  User,
  X,
} from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

export interface Lead {
  id: number
  name: string
  phone: string
  propertyId: number
  propertyTitle: string
  createdAt: string
  isRead: boolean
}

export function LeadsPanel({
  open,
  leads,
  onClose,
  onMarkAsRead,
  onDelete,
}: {
  open: boolean
  leads: Lead[]
  onClose: () => void
  onMarkAsRead: (id: number) => void
  onDelete: (id: number) => void
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'الآن'
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`
    if (diffHours < 24) return `منذ ${diffHours} ساعة`
    if (diffDays < 7) return `منذ ${diffDays} يوم`
    return date.toLocaleDateString('ar-SA')
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-lg" labelledBy="leads-title">
      <div className="p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 id="leads-title" className="text-xl font-extrabold text-foreground">
              طلبات التواصل
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {leads.length === 0
                ? 'لا توجد طلبات حالياً'
                : `${leads.length} طلب — ${leads.filter((l) => !l.isRead).length} جديد`}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-12 text-center">
              <Phone className="size-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                لا توجد طلبات تواصل بعد
              </p>
            </div>
          ) : (
            leads.map((lead) => (
              <div
                key={lead.id}
                className={`rounded-xl border p-4 transition-colors ${
                  lead.isRead
                    ? 'border-border bg-card'
                    : 'border-primary/30 bg-primary/5'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!lead.isRead && (
                        <span className="inline-block size-2 rounded-full bg-primary shrink-0" />
                      )}
                      <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                        <User className="size-3.5 shrink-0" />
                        <span className="truncate">{lead.name}</span>
                      </div>
                    </div>

                    <a
                      href={`tel:${lead.phone}`}
                      dir="ltr"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <Phone className="size-3.5" />
                      {lead.phone}
                    </a>

                    {lead.propertyTitle && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="size-3.5 shrink-0" />
                        <span className="truncate">{lead.propertyTitle}</span>
                      </div>
                    )}

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3 shrink-0" />
                      {formatDate(lead.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!lead.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMarkAsRead(lead.id)}
                        className="size-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="تم التواصل"
                      >
                        <CheckCircle2 className="size-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(lead.id)}
                      className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="حذف"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}
