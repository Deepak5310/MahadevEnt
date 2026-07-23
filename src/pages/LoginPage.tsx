import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, Mail, Lock } from 'lucide-react'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/useAuthStore'
import { Button } from '../components/ui/Button'
import { Input }  from '../components/ui/Input'

// ── Zod schema ─────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

/**
 * LoginPage — Email + password login form backed by Supabase Auth.
 *
 * Admin controls all accounts — no self-registration, no forgot-password.
 * If a session already exists (e.g., back-button after login), redirects immediately.
 */
export default function LoginPage() {
  const navigate        = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isInitializing  = useAuthStore((s) => s.isInitializing)
  const [serverError, setServerError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  // Already logged in — skip the login page
  if (!isInitializing && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (data: LoginForm) => {
    setServerError('')
    const result = await authService.signIn(data.email, data.password)
    if (result.error) {
      setServerError(result.error)
      return
    }
    void navigate('/dashboard', { replace: true })
  }

  return (
    <div
      style={{
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
        minHeight:       '100dvh',
        padding:         'var(--space-6)',
        background:      'var(--color-bg-base)',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <div
          style={{
            width: '3.5rem', height: '3.5rem',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
          }}
        >
          <Building2 size={24} color="#fff" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
            Mahadev Enterprise
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            Office Management System
          </p>
        </div>
      </div>

      {/* Login card */}
      <div
        style={{
          width: '100%', maxWidth: '26rem',
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
          Sign in to your account
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
          Enter your credentials provided by the administrator.
        </p>

        {/* Server-level error */}
        {serverError && (
          <div
            role="alert"
            style={{
              marginBottom: 'var(--space-4)',
              padding: 'var(--space-3) var(--space-4)',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              color: '#f87171',
            }}
          >
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Email address"
            type="email"
            placeholder="you@mahadev.com"
            autoComplete="email"
            leftIcon={<Mail size={16} />}
            error={errors.email?.message}
            required
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            leftIcon={<Lock size={16} />}
            error={errors.password?.message}
            required
            {...register('password')}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
            style={{ marginTop: 'var(--space-2)' }}
          >
            Sign in
          </Button>
        </form>

        <p style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          Account access is managed by your administrator.
        </p>
      </div>
    </div>
  )
}
