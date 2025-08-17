type TabItem = {
  id: string
  label: string
}

type TabsProps = {
  items: TabItem[]
  activeId: string
  onChange: (id: string) => void
  variant?: 'underline' | 'block'
}

export function Tabs({ items, activeId, onChange, variant = 'underline' }: TabsProps) {
  if (variant === 'block') {
    return (
      <div role="tablist" className="flex items-center justify-between border-b border-purplefy-medium-gray/60">
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={activeId === item.id}
            onClick={() => onChange(item.id)}
            className={`relative flex-1 py-3 text-sm font-semibold text-center transition-colors ${
              activeId === item.id ? 'text-white' : 'text-purplefy-light-gray'
            }`}
          >
            {item.label}
            {activeId === item.id && (
              <span className="pointer-events-none absolute left-0 bottom-0 h-0.5 w-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.5)]" />
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <nav className="flex gap-8" role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          role="tab"
          aria-selected={activeId === item.id}
          onClick={() => onChange(item.id)}
          className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
            activeId === item.id
              ? 'border-purplefy-primary text-purplefy-primary'
              : 'border-transparent text-purplefy-light-gray hover:text-purplefy-white'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
