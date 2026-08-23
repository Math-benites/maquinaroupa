import { useState } from 'react'
import { Icon } from './Icon'

const STORAGE_KEY = 'lavanderia:regras-dismissed'

export function RulesCard() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1')

  if (dismissed) return null

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setDismissed(true)
  }

  return (
    <div className="rules-banner">
      <span className="rules-banner__icon">
        <Icon name="verified" />
      </span>
      <div className="rules-banner__text">
        <div className="rules-banner__title">Regras rápidas</div>
        <ul className="rules-banner__list">
          <li>Sem cadastro ou senha</li>
          <li>Cancele pelo mesmo celular, se precisar</li>
        </ul>
      </div>
      <button type="button" className="rules-banner__close" onClick={handleDismiss} aria-label="Fechar aviso">
        <Icon name="close" />
      </button>
    </div>
  )
}
