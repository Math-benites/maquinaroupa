-- Fecha o bypass: só a função criar_reserva pode inserir em reservas.
-- Sem essa policy, um POST direto na API REST não passa mais pelas
-- validações de negócio (duração, apartamento válido, alinhamento de
-- hora, limite de tentativas).
drop policy if exists "Reservas podem ser criadas" on public.reservas;

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
declare
    v_apartamento text := trim(p_apartamento);
    v_nome text := trim(p_nome);
    v_recent_count int;
begin
    if v_nome = '' or char_length(v_nome) > 80 then
        raise exception 'Nome inválido' using errcode = '22023';
    end if;

    if v_apartamento not in ('1','2','3','4','5','6','7') then
        raise exception 'Apartamento inválido' using errcode = '22023';
    end if;

    if p_fim <= now() then
        raise exception 'Horário no passado' using errcode = '22023';
    end if;

    if p_fim - p_inicio <> interval '60 minutes' then
        raise exception 'Duração de reserva inválida' using errcode = '22023';
    end if;

    if date_trunc('hour', p_inicio) <> p_inicio then
        raise exception 'Horário precisa começar em hora cheia' using errcode = '22023';
    end if;

    if p_inicio > now() + interval '60 days' then
        raise exception 'Fora da janela de agendamento' using errcode = '22023';
    end if;

    -- Limite anti-abuso: no máximo 15 reservas por apartamento a cada 15 minutos.
    select count(*) into v_recent_count
    from public.reservas
    where apartamento = v_apartamento
      and created_at > now() - interval '15 minutes';

    if v_recent_count >= 15 then
        raise exception 'Muitas reservas em pouco tempo. Tente novamente em alguns minutos.' using errcode = 'RATE1';
    end if;

    return query
        insert into public.reservas (nome, apartamento, inicio, fim)
        values (v_nome, v_apartamento, p_inicio, p_fim)
        returning reservas.id, reservas.cancel_token;
end;
$$;

revoke all on function public.criar_reserva(text, text, timestamptz, timestamptz) from public;
grant execute on function public.criar_reserva(text, text, timestamptz, timestamptz) to anon;
