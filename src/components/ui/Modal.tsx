import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
  isOpen:     boolean
  onClose:    () => void
  title?:     string
  children:   ReactNode
  footer?:    ReactNode
  size?:      ModalSize
  className?: string
}

/**
 * Modal — Accessible dialog using the native <dialog> element.
 *
 * - Closes on Escape key (native browser behaviour)
 * - Closes on backdrop click
 * - Traps focus inside (native browser behaviour)
 * - Blurred backdrop via ::backdrop CSS
 *
 * Usage:
 *   <Modal isOpen={open} onClose={() => setOpen(false)} title="Edit Employee">
 *     <p>Modal content</p>
 *   </Modal>
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size      = 'md',
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Open / close the native dialog
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (isOpen && !el.open) el.showModal()
    if (!isOpen && el.open) el.close()
  }, [isOpen])

  // Sync Escape key close with parent state
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const onCancel = (e: Event) => {
      e.preventDefault()
      onClose()
    }
    el.addEventListener('cancel', onCancel)
    return () => el.removeEventListener('cancel', onCancel)
  }, [onClose])

  // Close when clicking the backdrop (outside modal-content)
  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className={cn('modal', `modal--${size}`, className)}
      onClick={handleBackdropClick}
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="modal-header">
            <h2 id="modal-title" className="modal-title">{title}</h2>
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="modal-body">{children}</div>

        {/* Footer */}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </dialog>
  )
}
