import { Icon } from './Icon'

interface Props {
  subtitle: string
}

export function Header({ subtitle }: Props) {
  return (
    <header className="app-header">
      <span className="app-header__icon">
        <Icon name="local_laundry_service" />
      </span>
      <div className="app-header__text">
        <h1>Lavanderia - Santa Monica</h1>
        <div className="app-header__subtitle">{subtitle}</div>
      </div>
    </header>
  )
}
