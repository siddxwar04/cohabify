import { X } from 'lucide-react'

export default function Modal({ title, subtitle, onClose, children, wide }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="animate-scale-in bg-cream border border-linen rounded-[28px] shadow-lift w-full p-6 md:p-8"
        style={{ maxWidth: wide ? 560 : 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-3xl text-espresso leading-none">{title}</h2>
            {subtitle && <p className="text-sm text-stone mt-2">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-linen bg-paper flex items-center justify-center text-stone hover:text-espresso"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
