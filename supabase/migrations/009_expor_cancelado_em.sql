-- A 002_cancel_token.sql restringe o SELECT do anon a colunas específicas
-- (esconde nome e cancel_token). A coluna cancelado_em (008) ficou de fora
-- dessa lista, o que quebra TODO o select (42501: permission denied),
-- não só a coluna nova.
grant select (cancelado_em) on public.reservas to anon;
