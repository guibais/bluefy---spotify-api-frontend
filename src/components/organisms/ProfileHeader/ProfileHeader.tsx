import type { ReactNode } from 'react'
import { Image } from '@/components/atoms/Image/Image'

export type ProfileStat = { label: string; value: string }

export type ProfileHeaderProps = {
  name: string
  imageUrl?: string
  subtitle?: string
  stats?: ProfileStat[]
  rightSlot?: ReactNode
  titleExtraLeft?: ReactNode
  layout?: 'desktop' | 'mobile'
}

export function ProfileHeader({ name, imageUrl, subtitle, stats = [], rightSlot, titleExtraLeft, layout = 'desktop' }: ProfileHeaderProps) {
  if (layout === 'mobile') {
    return (
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16">
          <Image src={imageUrl} alt={name} className="w-16 h-16 rounded-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-xl font-bold text-purplefy-white truncate">{name}</h1>
            {rightSlot}
          </div>
          {subtitle && <p className="text-purplefy-light-gray text-sm truncate">{subtitle}</p>}
          {stats.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-3 text-[11px] text-purplefy-light-gray">
              {stats.map((s) => (
                <div key={s.label}>
                  <span className="block text-[10px] uppercase tracking-wide">{s.label}</span>
                  <span className="text-spotify-white">{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-6 mb-10">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24">
          <Image src={imageUrl} alt={name} className="w-24 h-24 rounded-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-purplefy-white">{name}</h1>
            {titleExtraLeft}
          </div>
          {subtitle && <p className="text-purplefy-light-gray">{subtitle}</p>}
          {stats.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-purplefy-light-gray">
              {stats.map((s) => (
                <div key={s.label}>
                  <span className="block text-xs uppercase tracking-wide">{s.label}</span>
                  <span className="text-purplefy-white">{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {rightSlot}
    </div>
  )
}
