-- Lavanderia do condomínio: tabela de reservas

create extension if not exists btree_gist;

create table if not exists public.reservas (
    id uuid primary key default gen_random_uuid(),

    nome varchar(80) not null,
    apartamento varchar(20) not null,

    inicio timestamptz not null,
    fim timestamptz not null,

    created_at timestamptz not null default now(),

    constraint reservas_periodo_valido
        check (fim > inicio)
);

alter table public.reservas
add constraint reservas_sem_sobreposicao
exclude using gist (
    tstzrange(inicio, fim, '[)') with &&
);

create index if not exists reservas_inicio_idx on public.reservas (inicio);

alter table public.reservas enable row level security;

create policy "Reservas podem ser visualizadas"
on public.reservas
for select
to anon
using (true);

create policy "Reservas podem ser criadas"
on public.reservas
for insert
to anon
with check (
    inicio >= now()
    and fim > inicio
);

-- Habilita Realtime (INSERT) para a tabela de reservas
alter publication supabase_realtime add table public.reservas;
