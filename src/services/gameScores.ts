import { supabase } from '../lib/supabase'

export interface GameScore {
  id: string
  nome: string
  apartamento: string
  rodadas: number
  created_at: string
}

export async function submitScore(nome: string, apartamento: string, rodadas: number): Promise<void> {
  const { error } = await supabase.rpc('submit_score', {
    p_nome: nome.trim(),
    p_apartamento: apartamento.trim(),
    p_rodadas: rodadas,
  })
  if (error) throw error
}

export async function fetchTopScores(limit = 5): Promise<GameScore[]> {
  const { data, error } = await supabase
    .from('jogo_scores')
    .select('id, nome, apartamento, rodadas, created_at')
    .order('rodadas', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data as GameScore[]
}
