-- Ranking do jogo passa a ser upsert por (nome, apartamento):
-- só sobrescreve o placar existente se o novo for maior.
-- Criação/atualização passam a ser feitas via função (bypassa RLS),
-- então a policy de INSERT direto na tabela é removida.

create unique index jogo_scores_nome_apto_uidx
on public.jogo_scores (lower(trim(nome)), apartamento);

create or replace function public.submit_score(
    p_nome text,
    p_apartamento text,
    p_rodadas int
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    v_existing int;
begin
    if p_rodadas <= 0 or p_rodadas >= 1000 then
        raise exception 'Rodadas inválidas' using errcode = '22023';
    end if;

    select rodadas into v_existing
    from public.jogo_scores
    where lower(trim(nome)) = lower(trim(p_nome))
      and apartamento = trim(p_apartamento);

    if v_existing is null then
        insert into public.jogo_scores (nome, apartamento, rodadas)
        values (trim(p_nome), trim(p_apartamento), p_rodadas);
    elsif p_rodadas > v_existing then
        update public.jogo_scores
        set rodadas = p_rodadas, nome = trim(p_nome), created_at = now()
        where lower(trim(nome)) = lower(trim(p_nome))
          and apartamento = trim(p_apartamento);
    end if;
end;
$$;

revoke all on function public.submit_score(text, text, int) from public;
grant execute on function public.submit_score(text, text, int) to anon;

drop policy if exists "Scores podem ser criados" on public.jogo_scores;
