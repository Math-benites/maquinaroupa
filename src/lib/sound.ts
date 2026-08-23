let ctx: AudioContext | null = null

export function getAudioCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
      ctx = new Ctor()
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    return ctx
  } catch {
    return null
  }
}

export function playEndingSoonSound() {
  const audioCtx = getAudioCtx()
  if (!audioCtx) return

  const now = audioCtx.currentTime
  const beeps = [
    { offset: 0, freq: 660 },
    { offset: 0.22, freq: 660 },
    { offset: 0.44, freq: 880 },
  ]

  for (const { offset, freq } of beeps) {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.value = 0.18
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(now + offset)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.18)
    osc.stop(now + offset + 0.2)
  }
}
