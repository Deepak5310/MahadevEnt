import { useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { useAuthStore } from '../stores/useAuthStore'
import type { User } from '../types'

/**
 * Dev-only mock user for bypassing auth during development.
 * This block is tree-shaken by Vite in production builds.
 */
const DEV_ADMIN: User = {
  id:          'dev-admin-001',
  name:        'Dev Admin',
  email:       'admin@mahadev.com',
  role:        'admin',
  department:  'Management',
  designation: 'Administrator',
}

const DEV_EMPLOYEE: User = {
  id:          'dev-emp-001',
  name:        'Dev Employee',
  email:       'employee@mahadev.com',
  role:        'employee',
  department:  'Operations',
  designation: 'Field Officer',
}

/**
 * LoginPage — Placeholder.
 *
 * Full login form with validation will be implemented in Step 4.
 * During development, use the bypass buttons below to test protected routes.
 */
export default function LoginPage() {
  const login    = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  function handleLogin(user: User) {
    login(user)
    void navigate('/dashboard', { replace: true })
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        gap: 'var(--space-6)',
        padding: 'var(--space-8)',
        background: 'var(--color-bg-base)',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Building2 size={24} color="#fff" />
        </div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
          Mahadev Enterprise
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          Office Management System
        </p>
      </div>

      {/* Login form placeholder */}
      <div
        style={{
          width: '100%',
          maxWidth: '24rem',
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            padding: 'var(--space-4)',
            background: 'var(--color-bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--color-border)',
          }}
        >
          Login form coming in Step 4.
          <br />
          Use the dev shortcuts below.
        </p>

        {/* Dev bypass — only rendered in development mode */}
        {import.meta.env.DEV && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              DEV MODE — Quick Login
            </p>
            <button
              type="button"
              onClick={() => handleLogin(DEV_ADMIN)}
              style={{
                padding: 'var(--space-3)',
                background: 'var(--color-primary-600)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'inherit',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-medium)',
                cursor: 'pointer',
              }}
            >
              Login as Admin
            </button>
            <button
              type="button"
              onClick={() => handleLogin(DEV_EMPLOYEE)}
              style={{
                padding: 'var(--space-3)',
                background: 'var(--color-bg-elevated)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'inherit',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-medium)',
                cursor: 'pointer',
              }}
            >
              Login as Employee
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
