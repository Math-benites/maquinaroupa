-- Ranking do jogo exibe o nome de quem jogou (tabela separada das
-- reservas — a privacidade do nome nas reservas não é afetada).

revoke select on public.jogo_scores from anon;
grant select (id, nome, apartamento, rodadas, created_at) on public.jogo_scores to anon;
