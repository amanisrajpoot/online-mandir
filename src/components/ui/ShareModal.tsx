"use client"

import * as React from "react"
import { Share2, Copy, Check, MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface ShareProps {
  title: string
  subtitle?: string
  url?: string
  className?: string
  buttonVariant?: "default" | "outline" | "secondary" | "ghost"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  buttonText?: string
}

export function ShareButton({
  title,
  subtitle,
  url,
  className = "",
  buttonVariant = "outline",
  buttonSize = "sm",
  buttonText = "Share",
}: ShareProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const shareUrl = typeof window !== "undefined" ? (url || window.location.href) : (url || "https://www.vandanam.online")

  const formattedWhatsAppText = encodeURIComponent(
    `🙏 *${title}*${subtitle ? `\n📍 ${subtitle}` : ""}\n\n✨ Book your personalized Sankalp with authentic video proof from sacred temple priests.\n\n👉 ${shareUrl}`
  )

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `🙏 ${title}${subtitle ? ` - ${subtitle}` : ""}`,
          url: shareUrl,
        })
        return
      } catch (err) {
        // User canceled or fallback to modal
      }
    }
    setIsOpen(true)
  }

  const handleCopyLink = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={handleNativeShare}
        className={`flex items-center gap-1.5 transition-all ${className}`}
        aria-label="Share this sacred page"
      >
        <Share2 className="w-4 h-4 text-[var(--color-saffron-500)]" />
        {buttonText && <span>{buttonText}</span>}
      </Button>

      {/* Share Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-[var(--color-mandir-surface)] border border-[var(--color-mandir-border)] p-6 shadow-2xl space-y-5">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--color-mandir-text-muted)] hover:text-[var(--color-mandir-text)] hover:bg-[var(--color-mandir-border)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-saffron-500)]/15 text-[var(--color-saffron-500)] mb-2">
                <span>ॐ</span>
                <span>Share with Family &amp; Friends</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-mandir-text)] line-clamp-2">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-[var(--color-mandir-text-muted)] mt-0.5 line-clamp-1">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Sharing Options */}
            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${formattedWhatsAppText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-semibold text-sm transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🙏 ${title}\n📍 ${subtitle || ""}`)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 font-semibold text-sm transition-all hover:scale-[1.02]"
              >
                <svg className="w-4 h-4 fill-current text-sky-400" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>X / Twitter</span>
              </a>
            </div>

            {/* Copy Link Input */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--color-mandir-bg)] border border-[var(--color-mandir-border)]">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent px-2 text-xs text-[var(--color-mandir-text-muted)] outline-none select-all"
              />
              <Button
                size="sm"
                variant={copied ? "default" : "secondary"}
                onClick={handleCopyLink}
                className="h-8 text-xs font-semibold shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
