-- Cancelamento deixa de apagar a linha (senão o aparelho perde o registro
-- de auditoria de que reservou e cancelou). Agora só marca cancelado_em.
-- A exclusão de sobreposição passa a ignorar linhas canceladas, senão o
-- horário cancelado nunca mais poderia ser reservado por ninguém.
alter table public.reservas add column if not exists cancelado_em timestamptz;

alter table public.reservas drop constraint if exists reservas_sem_sobreposicao;

alter table public.reservas
add constraint reservas_sem_sobreposicao
exclude using gist (
    tstzrange(inicio, fim, '[)') with &&
) where (cancelado_em is null);

create or replace function public.cancelar_reserva(
    p_id uuid,
    p_token uuid
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
    update public.reservas
    set cancelado_em = now()
    where id = p_id and cancel_token = p_token and cancelado_em is null;

    if not found then
        raise exception 'Reserva não encontrada ou token inválido';
    end if;
end;
$$;
