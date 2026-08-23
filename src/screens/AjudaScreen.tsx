import { LAUNDRY_CONFIG } from '../config/laundry'
import { Credits } from '../components/Credits'

export function AjudaScreen() {
  return (
    <>
      <div className="section-title">
        <h2>Ajuda</h2>
        <div className="section-subtitle">Como funciona a lavanderia</div>
      </div>

      <div className="help-card">
        <div className="help-card__step">
          <span className="help-card__num">1</span>
          <div>
            <div className="help-card__title">Escolha um horário livre</div>
            <div className="help-card__text">Veja a agenda do dia na aba Agendar e toque em "Reservar".</div>
          </div>
        </div>
        <div className="help-card__step">
          <span className="help-card__num">2</span>
          <div>
            <div className="help-card__title">Informe nome e apartamento</div>
            <div className="help-card__text">Não é preciso senha ou cadastro.</div>
          </div>
        </div>
        <div className="help-card__step">
          <span className="help-card__num">3</span>
          <div>
            <div className="help-card__title">Cancele se precisar</div>
            <div className="help-card__text">
              Na aba "Minhas reservas", só o celular que fez a reserva consegue cancelá-la.
            </div>
          </div>
        </div>
      </div>

      <div className="help-card">
        <div className="help-card__title">Horário de funcionamento</div>
        <div className="help-card__text">
          {LAUNDRY_CONFIG.closingHour - LAUNDRY_CONFIG.openingHour === 24
            ? 'Funciona 24 horas'
            : `Das ${String(LAUNDRY_CONFIG.openingHour).padStart(2, '0')}:00 às ${String(
                LAUNDRY_CONFIG.closingHour,
              ).padStart(2, '0')}:00`}
          , reservas de {LAUNDRY_CONFIG.reservationDurationMinutes / 60} hora.
        </div>
      </div>

      <Credits />
    </>
  )
}
