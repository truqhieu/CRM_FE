import { Megaphone, Loader2 } from 'lucide-react'
import type { CskhAdInsights, CskhInboxConversation } from './api'

type ConversationAdBannerProps = {
  conversation: CskhInboxConversation
  adInsights?: CskhAdInsights | null
  isLoadingAdInsights?: boolean
}

/** Thẻ nguồn QC trong khung chat (giống context “trả lời quảng cáo” trên Messenger). */
export function ConversationAdBanner({
  conversation,
  adInsights,
  isLoadingAdInsights,
}: ConversationAdBannerProps) {
  const fromAd =
    conversation.fromAd ||
    conversation.referralSource === 'HEURISTIC' ||
    Boolean(conversation.adId || adInsights?.adId)

  if (!fromAd) return null

  const adId = (conversation.adId || adInsights?.adId || '').trim() || null
  const adTitle =
    conversation.adTitle?.trim() ||
    adInsights?.adName?.trim() ||
    null
  const imageUrl = adInsights?.adImageUrl?.trim() || null
  const hasIdentity = Boolean(adId || adTitle || imageUrl)

  return (
    <div className="mx-auto w-full max-w-[420px] mb-1">
      <div className="rounded-2xl border border-amber-200/80 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/90 border-b border-amber-100/80">
          <Megaphone className="w-3 h-3 text-amber-600 shrink-0" />
          <span className="text-[10px] font-bold text-amber-800 tracking-wide uppercase">
            Khách vào từ quảng cáo
          </span>
        </div>

        {isLoadingAdInsights && !hasIdentity ? (
          <div className="flex items-center justify-center gap-2 px-3 py-5 text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            <span className="text-[11px]">Đang tải thông tin quảng cáo…</span>
          </div>
        ) : hasIdentity ? (
          <div className="flex gap-3 p-3">
            {imageUrl ? (
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 block w-[72px] h-[72px] rounded-xl overflow-hidden border border-slate-100 bg-slate-50"
                title="Mở ảnh quảng cáo"
              >
                <img
                  src={imageUrl}
                  alt={adTitle || 'Ảnh quảng cáo'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </a>
            ) : (
              <div className="shrink-0 w-[72px] h-[72px] rounded-xl border border-dashed border-amber-200 bg-amber-50/60 flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-amber-400" />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-1.5 self-center">
              {adTitle && (
                <p className="text-[13px] font-semibold text-slate-800 leading-snug">{adTitle}</p>
              )}
              {adId && (
                <p className="text-[10px] text-slate-500">
                  ID:{' '}
                  <span className="font-mono text-slate-700 select-all break-all">{adId}</span>
                </p>
              )}
              {isLoadingAdInsights && !imageUrl && (
                <p className="text-[9px] text-slate-400 inline-flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Đang lấy ảnh creative…
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="px-3 py-3 space-y-1">
            <p className="text-[11px] font-medium text-slate-600">
              Chưa có ảnh / ID quảng cáo cụ thể
            </p>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Meta không gửi mã ad cho tin này (thường gặp với tin heuristic). Cần khách bấm
              Click-to-Messenger từ ad để hiện đúng creative trong hội thoại.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
