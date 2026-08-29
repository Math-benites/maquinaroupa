import { useState } from 'react'
import { Header } from './components/Header'
import { BottomNav } from './components/BottomNav'
import type { Tab } from './components/BottomNav'
import { CancelModal } from './components/CancelModal'
import { Toast } from './components/Toast'
import { AgendarScreen } from './screens/AgendarScreen'
import { MinhasReservasScreen } from './screens/MinhasReservasScreen'
import { AjudaScreen } from './screens/AjudaScreen'
import { getOwnToken } from './lib/ownReservations'
import { cancelReservation } from './services/reservations'
import type { PublicReservation } from './types/reservation'

const SUBTITLES: Record<Tab, string> = {
  agendar: 'Reserva sem cadastro',
  minhas: 'Suas reservas neste aparelho',
  ajuda: 'Como funciona',
}

function App() {
  const [tab, setTab] = useState<Tab>('agendar')
  const [refreshKey, setRefreshKey] = useState(0)
  const [cancelTarget, setCancelTarget] = useState<PublicReservation | null>(null)
  const [cancelSubmitting, setCancelSubmitting] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function handleCancelRequest(reservation: PublicReservation) {
    setCancelError(null)
    setCancelTarget(reservation)
  }

  async function handleCancelConfirm() {
    if (!cancelTarget) return
    const token = getOwnToken(cancelTarget.id)
    if (!token) return

    setCancelSubmitting(true)
    setCancelError(null)

    try {
      await cancelReservation(cancelTarget.id, token)
      setCancelTarget(null)
      setRefreshKey((k) => k + 1)
      setToast('Reserva cancelada com sucesso!')
    } catch {
      setCancelError('Não foi possível cancelar. Tente novamente.')
    } finally {
      setCancelSubmitting(false)
    }
  }

  return (
    <div className="app">
      <Header subtitle={SUBTITLES[tab]} />

      {tab === 'agendar' && (
        <AgendarScreen
          refreshKey={refreshKey}
          onReserved={() => {
            setRefreshKey((k) => k + 1)
            setToast('Reserva feita com sucesso!')
          }}
          onCancelRequest={handleCancelRequest}
        />
      )}

      {tab === 'minhas' && (
        <MinhasReservasScreen refreshKey={refreshKey} onCancelRequest={handleCancelRequest} />
      )}

      {tab === 'ajuda' && <AjudaScreen />}

      {cancelTarget && (
        <CancelModal
          reservation={cancelTarget}
          submitting={cancelSubmitting}
          error={cancelError}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancelConfirm}
        />
      )}

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
