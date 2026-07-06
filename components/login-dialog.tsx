'use client'

import { useState } from 'react'
import { LogIn, ShieldCheck } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Field, TextInput } from '@/components/ui/field'
import { ADMIN_CREDENTIALS } from '@/lib/real-estate'

export function LoginDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      username.trim() === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setError('')
      setUsername('')
      setPassword('')
      onSuccess()
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة')
    }
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-md" labelledBy="login-title">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="size-7" />
          </div>
          <h2 id="login-title" className="mt-3 text-xl font-extrabold text-foreground">
            دخول المشرف
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            الرجاء إدخال بيانات الدخول للوصول إلى لوحة الإدارة
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Field label="اسم المستخدم" htmlFor="username">
            <TextInput
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
          </Field>
          <Field label="كلمة المرور" htmlFor="password">
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-1 h-12 w-full">
            <LogIn className="size-5" />
            تسجيل الدخول
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            بيانات تجريبية: admin / admin123
          </p>
        </div>
      </form>
    </Modal>
  )
}
