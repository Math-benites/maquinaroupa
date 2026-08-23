-- Permite reservar o horário em andamento (que já começou mas não terminou),
-- não apenas horários totalmente futuros.

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
    if p_fim <= now() then
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
