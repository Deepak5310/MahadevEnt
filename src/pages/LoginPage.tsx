import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/useAuthStore'
import { Button, Input } from '../components/ui'

// ── Zod schema ─────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

/**
 * LoginPage — Modern Glassmorphism Login Interface.
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

  // Redirect if already authenticated
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
        position:        'relative',
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
        minHeight:       '100dvh',
        width:           '100%',
        padding:         'var(--space-6)',
        backgroundColor: '#0b0f19',
        overflow:        'hidden',
      }}
    >
      {/* Dynamic Background Glow Orbs */}
      <div
        style={{
          position:     'absolute',
          top:          '-10%',
          left:         '15%',
          width:        '450px',
          height:       '450px',
          borderRadius: '50%',
          background:   'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0) 70%)',
          filter:       'blur(60px)',
          pointerEvents:'none',
        }}
      />
      <div
        style={{
          position:     'absolute',
          bottom:       '-10%',
          right:        '15%',
          width:        '450px',
          height:       '450px',
          borderRadius: '50%',
          background:   'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0) 70%)',
          filter:       'blur(60px)',
          pointerEvents:'none',
        }}
      />

      {/* Main Container */}
      <div
        style={{
          position:  'relative',
          zIndex:    1,
          width:     '100%',
          maxWidth:  '26.5rem',
          display:   'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Brand Logo & Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
          <div
            style={{
              width:          '3.75rem',
              height:         '3.75rem',
              borderRadius:   'var(--radius-2xl)',
              background:     'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      '0 12px 30px -4px rgba(99, 102, 241, 0.45)',
              border:         '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <Building2 size={28} color="#ffffff" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontSize:      'var(--text-2xl)',
                fontWeight:    'var(--weight-bold)',
                color:         '#f8fafc',
                letterSpacing: '-0.02em',
                marginBottom:  '0.25rem',
              }}
            >
              Mahadev Enterprise
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: '#94a3b8', fontWeight: 'var(--weight-regular)' }}>
              Office Management Portal
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            width:           '100%',
            backgroundColor: 'rgba(30, 41, 59, 0.75)',
            backdropFilter:  'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border:          '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius:    'var(--radius-2xl)',
            padding:         'var(--space-8)',
            boxShadow:       '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)', color: '#f8fafc', marginBottom: '0.35rem' }}>
              Sign in to your account
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: '#94a3b8', lineHeight: '1.4' }}>
              Welcome back! Please enter your administrator provided credentials.
            </p>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div
              role="alert"
              style={{
                marginBottom:    'var(--space-5)',
                padding:         'var(--space-3) var(--space-4)',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border:          '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius:    'var(--radius-lg)',
                fontSize:        'var(--text-sm)',
                color:           '#fca5a5',
                display:         'flex',
                alignItems:      'flex-start',
                gap:             'var(--space-3)',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#f87171' }} />
              <div style={{ flex: 1 }}>{serverError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@mahadev.com"
              autoComplete="email"
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              required
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              leftIcon={<Lock size={18} />}
              error={errors.password?.message}
              required
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={isSubmitting}
              style={{
                marginTop:       'var(--space-2)',
                height:          '2.875rem',
                borderRadius:    'var(--radius-lg)',
                fontSize:        'var(--text-sm)',
                fontWeight:      'var(--weight-semibold)',
                background:      'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                boxShadow:       '0 4px 14px 0 rgba(99, 102, 241, 0.4)',
                border:          'none',
              }}
            >
              Sign In
            </Button>
          </form>

          {/* Card Footer Info */}
          <div
            style={{
              marginTop:       'var(--space-6)',
              paddingTop:      'var(--space-4)',
              borderTop:       '1px solid rgba(255, 255, 255, 0.06)',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              gap:             'var(--space-2)',
              fontSize:        'var(--text-xs)',
              color:           '#64748b',
            }}
          >
            <ShieldCheck size={14} color="#6366f1" />
            <span>Secure Enterprise Portal</span>
          </div>
        </div>
      </div>
    </div>
  )
}
