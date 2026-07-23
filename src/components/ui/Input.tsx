import { useState, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:      string
  error?:      string
  helperText?: string
  leftIcon?:   ReactNode
  /** Ref passed down for react-hook-form compatibility (React 19 style) */
  ref?: React.Ref<HTMLInputElement>
}

/**
 * Input — Text input with label, error state, and optional icon.
 *
 * For type="password", automatically adds a show/hide toggle button.
 * Accepts `ref` directly (React 19 — no forwardRef needed).
 *
 * Usage with react-hook-form:
 *   <Input label="Email" error={errors.email?.message} {...register('email')} />
 */
export function Input({
  label,
  error,
  helperText,
  leftIcon,
  type,
  className,
  required,
  ref,
  id,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType  = isPassword ? (showPassword ? 'text' : 'password') : type
  const inputId    = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="field">
      {label && (
        <label
          htmlFor={inputId}
          className={cn('field-label', required && 'field-label--required')}
        >
          {label}
        </label>
      )}

      <div className="input-wrapper">
        {leftIcon && (
          <span className="input-icon-left" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          ref={ref}
          type={inputType}
          className={cn(
            'input',
            error ? 'input--error' : undefined,
            leftIcon ? 'input--with-left' : undefined,
            isPassword ? 'input--with-right' : undefined,
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={
            error      ? `${inputId}-error`
            : helperText ? `${inputId}-helper`
            : undefined
          }
          required={required}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="input--password-toggle"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword
              ? <EyeOff size={16} aria-hidden="true" />
              : <Eye    size={16} aria-hidden="true" />
            }
          </button>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="field-helper">
          {helperText}
        </p>
      )}
    </div>
  )
}
