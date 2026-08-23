import { Icon } from './Icon'

export type Tab = 'agendar' | 'minhas' | 'ajuda'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'agendar', label: 'Agendar', icon: 'calendar_month' },
  { id: 'minhas', label: 'Minhas reservas', icon: 'list_alt' },
  { id: 'ajuda', label: 'Ajuda', icon: 'help' },
]

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`bottom-nav__btn ${active === tab.id ? 'bottom-nav__btn--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="bottom-nav__icon">
            <Icon name={tab.icon} />
          </span>
          <span className="bottom-nav__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
