-- Placar do minigame "Jogo do Ritmo" (aba Ajuda).

create table public.jogo_scores (
    id uuid primary key default gen_random_uuid(),
    nome varchar(80) not null,
    apartamento varchar(20) not null,
    rodadas int not null,
    created_at timestamptz not null default now(),

    constraint jogo_scores_rodadas_valido check (rodadas > 0 and rodadas < 1000),
    constraint jogo_scores_campos_nao_vazios check (
        char_length(trim(nome)) > 0 and char_length(trim(apartamento)) > 0
    )
);

create index jogo_scores_rodadas_idx on public.jogo_scores (rodadas desc, created_at asc);

alter table public.jogo_scores enable row level security;

create policy "Scores podem ser visualizados"
on public.jogo_scores
for select
to anon
using (true);

create policy "Scores podem ser criados"
on public.jogo_scores
for insert
to anon
with check (rodadas > 0 and rodadas < 1000);

revoke select on public.jogo_scores from anon;
grant select (id, apartamento, rodadas, created_at) on public.jogo_scores to anon;
