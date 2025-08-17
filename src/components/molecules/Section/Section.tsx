type Props = {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}

export function Section({ title, children, action }: Props) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-purplefy-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}
