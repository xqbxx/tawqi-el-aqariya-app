'use client'

import { useState } from 'react'
import { LogIn, LogOut, Plus, Menu, X, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar({
  mode,
  isAdmin,
  onLoginClick,
  onLogout,
  onAddProperty,
  onLeadsClick,
  unreadLeadsCount = 0,
}: {
  mode: 'public' | 'admin'
  isAdmin?: boolean
  onLoginClick?: () => void
  onLogout?: () => void
  onAddProperty?: () => void
  onLeadsClick?: () => void
  unreadLeadsCount?: number
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-3 px-4 sm:h-28 sm:px-6">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="شعار توقيع العقارية"
            className="h-20 w-auto sm:h-24"
          />
          <div className="leading-tight">
            <p className="text-base font-bold sm:text-lg">توقيع العقارية</p>
            <p className="hidden text-xs text-primary-foreground/70 sm:block">
              Tawqi&apos; El-Aqariya
            </p>
          </div>
        </div>

        {mode === 'admin' && (
          <>
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <>
                  <Button
                    onClick={onAddProperty}
                    size="lg"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  >
                    <Plus className="size-4 ml-1.5" />
                    <span>إضافة عقار</span>
                  </Button>
                  <Button
                    onClick={onLeadsClick}
                    variant="outline"
                    size="icon"
                    className="relative border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    <Bell className="size-5" />
                    {unreadLeadsCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadLeadsCount > 9 ? '9+' : unreadLeadsCount}
                      </span>
                    )}
                  </Button>
                </>
              )}
              {isAdmin ? (
                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <LogOut className="size-4 ml-1.5" />
                  <span>تسجيل الخروج</span>
                </Button>
              ) : (
                <Button
                  onClick={onLoginClick}
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <LogIn className="size-4 ml-1.5" />
                  <span>تسجيل الدخول</span>
                </Button>
              )}
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground border border-transparent"
              >
                {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {mode === 'admin' && isMenuOpen && (
        <div className="border-t border-primary-foreground/10 bg-primary px-4 py-4 shadow-inner md:hidden">
          <div className="flex flex-col gap-3">
            {isAdmin && (
              <>
                <Button
                  onClick={() => {
                    onAddProperty?.()
                    setIsMenuOpen(false)
                  }}
                  size="lg"
                  className="w-full justify-start bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <Plus className="size-4 ml-2" />
                  إضافة عقار
                </Button>
                <Button
                  onClick={() => {
                    onLeadsClick?.()
                    setIsMenuOpen(false)
                  }}
                  variant="outline"
                  size="lg"
                  className="w-full justify-start border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Bell className="size-4 ml-2" />
                  طلبات التواصل
                  {unreadLeadsCount > 0 && (
                    <span className="mr-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {unreadLeadsCount}
                    </span>
                  )}
                </Button>
              </>
            )}
            {isAdmin ? (
              <Button
                onClick={() => {
                  onLogout?.()
                  setIsMenuOpen(false)
                }}
                variant="outline"
                size="lg"
                className="w-full justify-start border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <LogOut className="size-4 ml-2" />
                تسجيل الخروج
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onLoginClick?.()
                  setIsMenuOpen(false)
                }}
                variant="outline"
                size="lg"
                className="w-full justify-start border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <LogIn className="size-4 ml-2" />
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
