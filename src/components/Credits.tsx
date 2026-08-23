import matheusPhoto from '../assets/matheus-benites.png'
import { ArrowOutwardIcon } from './icons/ArrowOutwardIcon'

export function Credits() {
  return (
    <div className="credits-card">
      <img className="credits-card__avatar" src={matheusPhoto} alt="Matheus Benites" />
      <div className="credits-card__text">
        <div className="credits-card__label">Desenvolvido por</div>
        <a
          className="credits-card__name"
          href="https://www.linkedin.com/in/matheus-benites/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Matheus Benites</span>
          <span className="credits-card__link-icon">
            <ArrowOutwardIcon />
          </span>
        </a>
      </div>
    </div>
  )
}
