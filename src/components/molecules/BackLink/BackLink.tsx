import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

type Props = {
  to: string
  label: string
}

export function BackLink({ to, label }: Props) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 text-purplefy-light-gray hover:text-purplefy-white transition-colors mb-6">
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Link>
  )
}
