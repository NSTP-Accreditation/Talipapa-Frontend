import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  ariaLabel,
}) => {
  const elRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  if (!elRef.current) {
    elRef.current = document.createElement('div');
  }

  useEffect(() => {
    const node = elRef.current!;
    document.body.appendChild(node);
    return () => {
      try {
        document.body.removeChild(node);
      } catch (e) {
        // ignore
      }
    };
  }, []);

  // Focus trap + ESC handling
  useEffect(() => {
    if (!isOpen) return;
    const el = dialogRef.current as HTMLElement | null;
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const nodes = el
      ? (Array.from(el.querySelectorAll(focusableSelector)) as HTMLElement[])
      : [];
    const prevActive = document.activeElement as HTMLElement | null;
    // Prefer focusing the first input/textarea/select so the close button doesn't steal initial focus
    if (nodes.length) {
      const preferred =
        nodes.find((n) =>
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(n.tagName)
        ) || nodes[0];
      preferred.focus();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab') {
        if (nodes.length === 0) {
          e.preventDefault();
          return;
        }
        const idx = nodes.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey) {
          if (idx === 0) {
            nodes[nodes.length - 1].focus();
            e.preventDefault();
          }
        } else {
          if (idx === nodes.length - 1) {
            nodes[0].focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prevActive?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[1005] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={
        ariaLabel ?? (typeof title === 'string' ? (title as string) : undefined)
      }
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col ${className}`}
      >
        {title && (
          <div className="relative p-4 sm:p-8 bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white overflow-hidden">
            {/* decorative blobs */}
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32" />
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                {/* allow callers to supply icon + title markup as the `title` prop */}
                <div className="text-lg sm:text-xl font-bold leading-tight">
                  {title}
                </div>
              </div>

              {/* Internal close button positioned visually in header. Kept outside the title flow to avoid becoming the first focusable element. */}
              <button
                type="button"
                aria-label="Close dialog"
                onClick={onClose}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-1 sm:ring-2 ring-white/30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
        <div className="p-6 lg:p-8 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );

  return createPortal(modal, elRef.current);
};

export default Modal;
