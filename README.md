# Lavanderia - Santa Monica

App mobile-first pra reservar horário na lavanderia do condomínio Santa Monica, sem cadastro e sem senha. Acesso via QR code fixado na lavanderia — cada aparelho (celular) reconhece suas próprias reservas por um token salvo localmente, sem login.

**Em produção:** [lavanderia.infrastack.com.br](https://lavanderia.infrastack.com.br)

## Como funciona

1. **Escolha um horário livre** na aba Agendar — a agenda mostra o dia atual com uma linha do tempo dos horários.
2. **Informe nome e apartamento** — sem senha, sem conta.
3. **Cancele quando precisar**, na aba "Minhas reservas" — só o mesmo celular que fez a reserva consegue cancelá-la.

Reservas são de 1 hora, com até 60 dias de antecedência. Tem um limite de reservas por apartamento em uma janela de 15 minutos, só pra evitar abuso — uso normal não é afetado.

Enquanto a roupa lava, tem um mini-jogo de decorar sequência ("Jogo do Ritmo") com ranking entre os moradores.

| Agendar | Ajuda |
|---|---|
| ![Tela de agendamento](docs/screenshots/01-agendar.png) | ![Tela de ajuda](docs/screenshots/03-ajuda.png) |

## Stack

- **React 19 + TypeScript + Vite** no front-end
- **Supabase** (Postgres + RLS + Realtime) como back-end — toda escrita passa por funções `SECURITY DEFINER` no banco (`criar_reserva`, `cancelar_reserva`, `submit_score`), não por INSERT direto, pra impedir bypass das regras de negócio (horário, limite de reservas, etc) direto pela API REST.
- **oxlint** pra lint, **Vitest** pra testes unitários
- Deploy automático no **Cloudflare Workers** a cada push na `master`
- CI no GitHub Actions: build, testes, lint, [Gitleaks](https://github.com/gitleaks/gitleaks) (segredos), [Trivy](https://github.com/aquasecurity/trivy) (vulnerabilidades de dependência) e [SonarQube](https://sonarcloud.io) (qualidade/segurança de código)

## Desenvolvimento

```bash
npm install
npm run dev      # servidor local
npm run test     # testes unitários (Vitest)
npm run lint     # oxlint
npm run build    # typecheck + build de produção
```

Precisa de um `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (veja `.env.example`).

## Branches

- `master` — roda o pipeline completo (CI + deploy). O fluxo esperado é sempre via PR (sem branch protection configurada ainda, então isso não é bloqueado pelo GitHub).
- `feature` — desenvolvimento, sem pipeline.
