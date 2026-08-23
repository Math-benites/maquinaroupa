import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { APARTAMENTOS } from '../config/laundry'
import { fetchTopScores, submitScore } from '../services/gameScores'
import { LAUNDRY_QUOTES } from '../data/laundryQuotes'
import { getAudioCtx } from '../lib/sound'
import type { GameScore } from '../services/gameScores'

type Phase = 'form' | 'countdown' | 'showing' | 'input' | 'gameover'

interface Item {
  label: string
  emoji: string
  tone: 'a' | 'b' | 'c' | 'd'
  freq: number
}

const ITEMS: Item[] = [
  { label: 'Meia', emoji: '🧦', tone: 'a', freq: 329.63 },
  { label: 'Calça', emoji: '👖', tone: 'b', freq: 392.0 },
  { label: 'Camisa', emoji: '👔', tone: 'c', freq: 440.0 },
  { label: 'Vestido', emoji: '👗', tone: 'd', freq: 523.25 },
]

const STORAGE_KEY_NOME = 'lavanderia:nome'
const STORAGE_KEY_APARTAMENTO = 'lavanderia:apartamento'
const NOME_REGEX = /^[\p{L}\s]+$/u
const STEP_MS = 1100
const HIGHLIGHT_MS = 700
const NEXT_ROUND_PAUSE_MS = 700
const COUNTDOWN_START = 5

function sanitizeNome(value: string): string {
  return value.replace(/[^\p{L}\s]/gu, '')
}

function rodadaLabel(n: number): string {
  return `${n} rodada${n === 1 ? '' : 's'}`
}

function randomQuote(): string {
  return LAUNDRY_QUOTES[Math.floor(Math.random() * LAUNDRY_QUOTES.length)]
}

function playTone(freq: number, durationMs = 260) {
  const ctx = getAudioCtx()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.value = 0.16
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000)
  osc.stop(ctx.currentTime + durationMs / 1000 + 0.02)
}

function playFailSound() {
  const ctx = getAudioCtx()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.value = 130
  gain.gain.value = 0.12
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4)
  osc.stop(ctx.currentTime + 0.42)
}

export function RhythmGame() {
  const [modalOpen, setModalOpen] = useState(false)
  const [phase, setPhase] = useState<Phase>('form')
  const [nome, setNome] = useState(() => sanitizeNome(localStorage.getItem(STORAGE_KEY_NOME) ?? ''))
  const [apartamento, setApartamento] = useState(() => localStorage.getItem(STORAGE_KEY_APARTAMENTO) ?? '')
  const [countdown, setCountdown] = useState(COUNTDOWN_START)
  const [sequence, setSequence] = useState<number[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [inputIndex, setInputIndex] = useState(0)
  const [quote, setQuote] = useState('')
  const [scores, setScores] = useState<GameScore[]>([])
  const [submitting, setSubmitting] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [])

  function after(ms: number, fn: () => void) {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
  }

  function loadScores() {
    fetchTopScores(5)
      .then(setScores)
      .catch(() => {})
  }

  function handleOpen() {
    setModalOpen(true)
    loadScores()
  }

  function handleClose() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPhase('form')
    setActiveIndex(null)
    setModalOpen(false)
  }

  const leaderboard = scores.length > 0 && (
    <ol className="rhythm-game__leaderboard">
      {scores.map((s, i) => (
        <li key={s.id}>
          <span>#{i + 1}</span>
          <span>
            {s.nome} <span className="rhythm-game__leaderboard-apto">Apto {s.apartamento}</span>
          </span>
          <span>{rodadaLabel(s.rodadas)}</span>
        </li>
      ))}
    </ol>
  )

  const nomeValido = NOME_REGEX.test(nome.trim()) && nome.trim().length <= 80
  const apartamentoValido = (APARTAMENTOS as readonly string[]).includes(apartamento)
  const podeComecar = nomeValido && apartamentoValido

  function playSequence(seq: number[]) {
    setPhase('showing')
    seq.forEach((idx, i) => {
      after(i * STEP_MS, () => {
        setActiveIndex(idx)
        playTone(ITEMS[idx].freq)
        after(HIGHLIGHT_MS, () => setActiveIndex(null))
      })
    })
    after(seq.length * STEP_MS, () => {
      setPhase('input')
      setInputIndex(0)
    })
  }

  function beginFirstRound() {
    const first = [Math.floor(Math.random() * ITEMS.length)]
    setSequence(first)
    playSequence(first)
  }

  function startGame() {
    if (!podeComecar) return
    localStorage.setItem(STORAGE_KEY_NOME, nome)
    localStorage.setItem(STORAGE_KEY_APARTAMENTO, apartamento)

    setPhase('countdown')
    setCountdown(COUNTDOWN_START)

    let remaining = COUNTDOWN_START
    const tick = () => {
      remaining -= 1
      setCountdown(remaining)
      if (remaining > 0) {
        after(1000, tick)
      } else {
        after(400, beginFirstRound)
      }
    }
    after(1000, tick)
  }

  function handleTap(idx: number) {
    if (phase !== 'input') return

    if (idx !== sequence[inputIndex]) {
      playFailSound()
      const rounds = sequence.length - 1
      setQuote(randomQuote())
      setPhase('gameover')
      if (rounds > 0) {
        setSubmitting(true)
        submitScore(nome, apartamento, rounds)
          .catch(() => {})
          .finally(() => {
            setSubmitting(false)
            loadScores()
          })
      }
      return
    }

    setActiveIndex(idx)
    playTone(ITEMS[idx].freq)
    after(200, () => setActiveIndex(null))

    if (inputIndex + 1 === sequence.length) {
      const next = [...sequence, Math.floor(Math.random() * ITEMS.length)]
      after(NEXT_ROUND_PAUSE_MS, () => {
        setSequence(next)
        playSequence(next)
      })
    } else {
      setInputIndex((i) => i + 1)
    }
  }

  if (!modalOpen) {
    return (
      <div className="rhythm-game rhythm-game--collapsed">
        <div className="rhythm-game__collapsed-text">
          <div className="rhythm-game__collapsed-title">
            <span className="rhythm-mini-icon" aria-hidden="true">
              <span className="rhythm-mini-icon__cell rhythm-mini-icon__cell--a" />
              <span className="rhythm-mini-icon__cell rhythm-mini-icon__cell--b" />
              <span className="rhythm-mini-icon__cell rhythm-mini-icon__cell--c" />
              <span className="rhythm-mini-icon__cell rhythm-mini-icon__cell--d" />
            </span>
            <span>Jogo do Ritmo</span>
          </div>
          <div className="rhythm-game__collapsed-sub">Decore a sequência de roupas e entre no ranking</div>
        </div>
        <button type="button" className="btn-pill btn-pill--free" onClick={handleOpen}>
          Jogar
        </button>
      </div>
    )
  }

  return (
    <div className="modal-overlay modal-overlay--center">
      <button type="button" className="modal-overlay__backdrop" aria-label="Fechar" onClick={handleClose} />
      <div className="rhythm-modal">
        <div className="rhythm-game__header">
          <span>
            {phase === 'form' || phase === 'countdown' ? 'Jogo do Ritmo' : `Rodada ${sequence.length}`}
          </span>
          <button type="button" className="rhythm-game__close" onClick={handleClose} aria-label="Fechar jogo">
            <Icon name="close" />
          </button>
        </div>

        {phase === 'form' && (
          <>
            <div className="rhythm-game__intro">Decore a sequência de roupas e repita na ordem certa!</div>

            <label className="modal-field">
              <span>Nome</span>
              <input
                value={nome}
                onChange={(e) => setNome(sanitizeNome(e.target.value))}
                maxLength={80}
                placeholder="Seu nome"
              />
            </label>

            <label className="modal-field">
              <span>Apartamento</span>
              <select value={apartamento} onChange={(e) => setApartamento(e.target.value)}>
                <option value="" disabled>
                  Selecione
                </option>
                {APARTAMENTOS.map((apto) => (
                  <option key={apto} value={apto}>
                    Apto {apto}
                  </option>
                ))}
              </select>
            </label>

            <button type="button" className="btn-pill btn-pill--free" disabled={!podeComecar} onClick={startGame}>
              Começar
            </button>

            {leaderboard}
          </>
        )}

        {(phase === 'countdown' || phase === 'showing' || phase === 'input') && (
          <div className="rhythm-game__grid-wrapper">
            {phase === 'countdown' && (
              <div className="rhythm-game__countdown-overlay">
                <div className="rhythm-game__countdown-number">{countdown}</div>
                <div>Prepare-se!</div>
              </div>
            )}

            <div className="rhythm-game__grid">
              {ITEMS.map((item, i) => (
                <button
                  key={item.label}
                  type="button"
                  className={`rhythm-game__tile rhythm-game__tile--${item.tone} ${
                    activeIndex === i ? 'rhythm-game__tile--active' : ''
                  }`}
                  onClick={() => handleTap(i)}
                  disabled={phase !== 'input'}
                >
                  <span className="rhythm-game__tile-emoji">{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'gameover' && (
          <>
            <div className="rhythm-game__gameover">
              <span className="rhythm-game__gameover-icon">
                <Icon name="local_laundry_service" />
              </span>
              <div className="rhythm-game__intro">
                Você lembrou {rodadaLabel(sequence.length - 1)}!{submitting && ' Salvando no ranking...'}
              </div>
              <div className="rhythm-game__quote-text">{quote}</div>
            </div>

            <button type="button" className="btn-pill btn-pill--free" onClick={startGame}>
              Jogar de novo
            </button>

            {leaderboard}
          </>
        )}
      </div>
    </div>
  )
}
