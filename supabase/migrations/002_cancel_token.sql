-- Permite que o mesmo dispositivo que criou a reserva possa cancelá-la,
-- sem expor UPDATE/DELETE diretos para o papel anon.

alter table public.reservas
add column if not exists cancel_token uuid not null default gen_random_uuid();

-- nome e cancel_token nunca devem ser legíveis publicamente via REST direto na tabela
revoke select on public.reservas from anon;
grant select (id, apartamento, inicio, fim, created_at) on public.reservas to anon;

create or replace function public.criar_reserva(
    p_nome text,
    p_apartamento text,
    p_inicio timestamptz,
    p_fim timestamptz
) returns table (id uuid, cancel_token uuid)
language plpgsql
security definer
set search_path = public
as $$
begin
    if p_inicio < now() then
        raise exception 'Horário no passado' using errcode = '22023';
    end if;

    return query
        insert into public.reservas (nome, apartamento, inicio, fim)
        values (trim(p_nome), trim(p_apartamento), p_inicio, p_fim)
        returning reservas.id, reservas.cancel_token;
end;
$$;

revoke all on function public.criar_reserva(text, text, timestamptz, timestamptz) from public;
grant execute on function public.criar_reserva(text, text, timestamptz, timestamptz) to anon;

create or replace function public.cancelar_reserva(
    p_id uuid,
    p_token uuid
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
    delete from public.reservas
    where id = p_id and cancel_token = p_token;

    if not found then
        raise exception 'Reserva não encontrada ou token inválido';
    end if;
end;
$$;

revoke all on function public.cancelar_reserva(uuid, uuid) from public;
grant execute on function public.cancelar_reserva(uuid, uuid) to anon;
