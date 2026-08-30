# Mind — Recapitulação completa do projeto (handoff para nova conversa)

> **Propósito deste documento:** retomar o desenvolvimento do app Mind numa conversa nova, sem re-explicar tudo. Cole este arquivo (ou suba-o como arquivo do projeto) no início da próxima conversa. Contém: contexto, ambiente técnico, decisões travadas, status de cada lote, o que falta AGORA, plano de deploy, a ideia futura do calendário (já avaliada) e como retomar desde a abertura do PowerShell.
>
> **Estado em uma frase:** os **21 itens de melhoria estão implementados e mesclados** (Lotes A→E, todos no `master`, incluindo o Lote E em `a9fedb8`) e **publicados** — o deploy único já ocorreu e foi validado no celular. A **Fase 8 (calendário)** está em curso: a **8a (mensal com contadores por dia)** é a fatia em desenvolvimento no branch `lote-8a`.

---

## 1. Contexto do app

**Mind** — organizador de tarefas pessoal para pessoas neurodivergentes (TDAH/autismo). Princípios centrais: **flexibilidade** e **design não-punitivo** (nada de "streak quebrada", "meta perdida"; linguagem sempre observacional). Fundamentação científica em princípios de engajamento.

Documentos de referência na raiz do projeto: `1-instrucoes-criacao-app-mind.md` (princípios de design) e `2-pesquisa-tecnica-engajamento-tdah.md` (ranking de prioridades por evidência).

---

## 2. Ambiente técnico

- **Máquina:** Windows, PowerShell
- **Pasta do projeto:** `C:\Users\Admin\Documents\mind-app`
- **Node.js:** v24.18.0
- **Claude Code:** v2.1.201 (instalado via `npm install -g @anthropic-ai/claude-code`)
- **Stack:** Next.js (App Router) + TypeScript + Tailwind + Zustand + bcryptjs + date-fns
- **Persistência:** localStorage (Google Drive/Fase 7 ainda não iniciada)
- **Modelo no Claude Code:** `/model opusplan` (Opus planeja, Sonnet executa)
- **Deploy:** **Vercel com deploy automático a partir da branch `master`** (confirmado via tela de Deployments: produção amarrada a commit no `master`). **Push no `master` = deploy em produção** na URL que o celular usa.
- **Servidor de dev:** `npm run dev` → `localhost:3000`

---

## 3. Fluxo de trabalho git (o ciclo de cada lote)

1. **Branch novo** a partir do `master` atualizado: `git checkout -b lote-X`
2. **Colar a spec** na conversa do Claude Code (com `opusplan`)
3. **G0 (inspeção) primeiro** — o Claude Code investiga o código real e mostra o plano **antes de codar**
4. **Revisar o plano** antes de aprovar a implementação
5. **Testar item a item** no navegador (o "como testar" de cada item)
6. **Merge local** pro `master` — **SEM push** (deploy fica pro fim)
7. **Limpar o branch:** `git branch -d lote-X`

**Divisão de canais (evita confusão):**
- Comandos `git` → **PowerShell** (o git não precisa de login; sobrevive a restart)
- Spec do lote → **dentro da conversa do Claude Code** (é instrução pra ele)

**Lições de processo (importantes):**
- **Confirme o branch antes de commitar.** Um commit vai pro branch onde o HEAD está no instante do commit. No Lote C, um commit caiu direto no `master`. Prevenção embutida em todas as specs seguintes: rodar `git status` e confirmar `lote-X` (não `master`) **antes** do commit.
- **Restart desloga o Claude Code.** Após reiniciar a máquina: `/login` na conversa do Claude Code. O git no PowerShell não é afetado.
- **`Please run /login` é do Claude Code, não do git.** Se aparecer ao colar `git` na conversa do Claude Code, o comando não rodou (nada quebrou) — rode o `git` no PowerShell, que não precisa de login.
- **Corrigir branch desalinhado:** `git branch -f lote-X master` só reposiciona o ponteiro (não reescreve histórico, não perde nada). Foi como resolvemos o desvio do Lote C.
- **Avisos `LF will be replaced by CRLF`:** ruído inofensivo do Windows (normalização de fim de linha). Ignorar.

---

## 4. Decisões de arquitetura travadas (NÃO reabrir)

- **`EstadoTarefa`** só pode ser: `disponivel | em-andamento | concluida` (nunca "falha"). Rotinas NÃO usam o estado terminal `concluida`.
- **Linguagem da UI** sempre observacional, nunca punitiva/comparativa.
- **Persistência** em localStorage; tudo **retrocompatível** (campos novos opcionais; ausência = comportamento padrão, nunca erro).
- **Tempo sempre em MINUTOS** (unidade canônica). "Horas/minutos" é só entrada/exibição.
- **Tempo de foco (sessões do timer) é SEPARADO da estimativa.** Os gráficos da Fase 6 e os cards do Lote F usam tempo de foco real.
- **Vermelho é exclusivo do emergencial** (Lote B4). Único vermelho do app.
- **Cores por status:** `concluida`=azul, `em-andamento`=verde, `disponivel`=neutro. Fonte única em `estados.ts` (rótulo, ordem e cor). Tokens `--status-*` fixos no `:root`, como o `--emergencial`.
- **Cor nunca é o único sinal** — sempre manter o rótulo textual junto (acessibilidade).
- **Deletar tag** = reatribuir tarefas afetadas para "sem tag" (Opção A); a tarefa **nunca** é apagada.
- **Flag de microtarefas** (quebra automática) vale só para tarefas **novas**.
- **Datas gravadas ao meio-dia local** (evita salto de dia por fuso). Vale para todos os campos de data — inclusive `repetirAte`.
- **Editores de data:** salvar no `onChange`, fechar só no `onBlur` (padrão do bug recorrente).
- **Rotinas (Lote E):** uma rotina é UMA `Task` com `diasSemana` (+ `repetirAte` opcional); nunca gera instâncias nem histórico por dia. "Concluir rotina" = marcador leve `ultimaConclusao` (feito hoje) que reseta por dia. Rotina fica FORA dos **contadores de tarefas** do /progresso — mas **minutos focados** de sessões em rotina **continuam contando** (tempo real).
- **Item 17** da lista original estava em branco → **descartado**.

---

## 5. Status dos lotes — TODOS OS 21 ITENS IMPLEMENTADOS

Ordem executada: **A → G → F → B → C → D → E**.

| Lote | Escopo | Itens | Commit | Status |
|---|---|---|---|---|
| **A** | Exibição + CRUD de tarefas | 4, 2, 14, 15, 12, 9 | `b03f254` | ✅ Mesclado e validado |
| **G** | Data editável no humor | 18 | `3360108` | ✅ Mesclado e validado |
| **F** | Indicadores no Progresso | 5, 6, 20 | `c5f56a9` | ✅ Mesclado e validado |
| **B** | Opções e flags na criação | 1, 7, 16+13, 19 | `664369c` | ✅ Mesclado e validado |
| **C** | Tags editáveis + cores de status | 10, 21 | `32271dc` | ✅ Mesclado e validado |
| **D** | Sinais sonoros no timer | 11 | `befe64d` | ✅ Mesclado e validado |
| **E** | Rotinas + agenda de hoje | 3, 8 | `a9fedb8` | ✅ Mesclado e validado |

**Cadeia de commits no `master`:** `e047ced` (pré-melhorias) → `b03f254` (A) → `3360108` (G) → `c5f56a9` (F) → `664369c` (B) → `32271dc` (C) → `befe64d` (D) → `a9fedb8` (E, HEAD do `master` na publicação). Todos os 7 lotes foram ao ar juntos no deploy único (§7, agora histórico).

### Resumo do que cada lote entregou

**Lote A (`b03f254`)** — data de criação exibida; editar nome de micro-metas; editar data de conclusão (move nos gráficos); copiar tarefa (começa do zero); busca "contém" (case/acento-insensível); alternar visão completa/resumida. Criou `src/lib/tarefas/formato.ts`.

**Lote G (`3360108`)** — data editável no registro de humor (que já existia, ligado à Fase 4). Bug do editor de data (fechava no primeiro onChange) corrigido. Arquivos: `reflexoesStore.ts`, `RegistroHumorDia.tsx`.

**Lote F (`c5f56a9`)** — cards de criadas/concluídas em 7/30 dias (rolling); filtros por data (criação/conclusão) + lista resumida ordenada por status. Regra crítica: "concluída" = `estado==="concluida"` E `concluidaEm`. Criou `src/lib/tarefas/estados.ts`; componentes `CartaoIndicadorPeriodo`, `FiltroTarefasPorData`.

**Lote B (`664369c`)** — estimativa opcional em h/min (sempre gravada em minutos); miniseletor de duração (15/25/45+custom) quando não há estimativa (preserva o decay); checkbox "Quebrar em microtarefas?"; "Previsão de término" editável (fora do /progresso); flag "Emergencial" (vermelho). Convergência em `duracaoPlanejadaMin`. Validado: números do /progresso inalterados.

**Lote C (`32271dc`)** — sistema de tags criado do zero (por id: `tagsStore.ts`, `Task.tagIds`); gerenciador na Config (criar/renomear/deletar com reatribuição pra "sem tag"); cores por status via `ESTADO_COR_VAR` em `estados.ts` (tokens `--status-*` fixos; componente `ChipStatus`). Validado via Playwright. **Pendência opcional:** casos de borda das tags (nome vazio/duplicado) não testados.

**Lote D (`befe64d`)** — som aos 50% (novo) além do som do fim (que já existia); detecção movida pra dentro do tick; `chime.ts` com variante "metade" (660 Hz, ~60% volume, sem vibração); reusa `Config.intensidadeNotificacao` (silencioso=off). Mecanismo de flag persistida (`metadeSinalizada`) testado contra disparo retroativo (sair/voltar) e escuta manual do áudio — ambos OK.

**Lote E (`a9fedb8`, mesclado)** — rotinas semanais + agenda de hoje:
- Campos novos em `Task`: `diasSemana?`, `repetirAte?`, `ultimaConclusao?` (todos opcionais).
- Novo `src/lib/tarefas/rotinas.ts` centraliza `ehRotina`, `rotinaAtivaEm`, `dentroDoRepetirAte` (inclui o próprio dia), `feitoHoje`.
- Marcador "Rotina?" no formulário (revelação progressiva), revelando seletor S/T/Q/Q/S/S/D e "Repetir até".
- Rotina troca "Concluir" por "Feito hoje" ↔ "Desfazer" (nunca usa `concluida`). Seção "Rotinas" separada na lista.
- Novo `AgendaHoje.tsx` acima da lista: rotinas ativas hoje (não feitas) + tarefas com previsão B3 de hoje; vazio = "Nada previsto para hoje."
- `/progresso` filtra `!ehRotina` das agregações de **contagem de tarefas** (não dos minutos focados).
- Bug corrigido ao vivo: agenda não excluía rotinas já marcadas "feito hoje" — corrigido antes do commit.
- **Regressão testada dos dois lados** (ver §7, agora histórico): rotina NÃO entra nas contagens — "Tarefas criadas" ficou 0 mesmo com rotina de hoje — **e** tarefa comum continuou entrando normalmente (contadores subiram ao criar/concluir). O filtro `!ehRotina` provou-se cirúrgico.

---

## 6. Padrões e lições recorrentes

- **G0 (inspeção) antes de codar:** uma spec descreve o que o autor *imagina* que existe; o G0 verifica o que *de fato* existe. Salvou o projeto várias vezes (tags e humor não existiam como imaginado; no Lote E refinou "rotina fora dos analytics" para "fora só das contagens de tarefas; minutos focados contam").
- **"Última milha" de teste manual:** testes automatizados (Playwright) provam a *lógica*, mas não tudo. Fechar sempre com verificação humana: cliques reais, escuta de áudio (Lote D), e bugs pegos ao vivo (Lote E: agenda não excluía "feito hoje").
- **Regressão sempre dos DOIS lados:** ao filtrar dados, testar que o filtro (a) inclui o que deve e (b) NÃO exclui demais. Foi assim que o Lote E fechou (§5).
- **Bug do editor de data apareceu 3x** (G, B, retroativamente no A). Oportunidade anotada (sua escolha): extrair um componente único de editor de data.
- **Consistência entre lotes paga dividendos:** `duracaoPlanejadaMin` (B) tornou os 50% do Lote D triviais; `estados.ts` (F) virou fonte única de cor e ordem; `rotinas.ts` (E) centralizou recorrência.
- **Dívida — três grades mensais (Fase 8a).** Existem três implementações da mesma
  grade 7 colunas: `CalendarioMensal.tsx` (/progresso, Lote F), `CalendarioHumorMensal.tsx`
  (/humor) e o `/calendario` da Fase 8a. **`src/lib/calendario/grade.ts` é a fonte
  canônica** — módulo puro (dias do mês + offset inicial, ancorados ao meio-dia local),
  criado na 8a e consumido só por ela. A migração dos dois calendários antigos para o
  helper fica para um **lote futuro**, deliberadamente: primeiro a 8a prova o helper em
  uso real, depois se refatora o que já funciona — migrar junto com a estreia teria
  colocado /progresso e /humor em risco de regressão dentro do lote mais barato da fase.
  Duas divergências de borda pré-existentes, mapeadas mas **não** tocadas na 8a: (a)
  `tarefasConcluidasPorDiaDoMes` e `tarefasConcluidasPorDia` (`src/lib/progresso/agregacao.ts`)
  não checam `estado === "concluida"`, ao contrário de `tarefasConcluidasPorPeriodo` e
  `tarefasConcluidasNoDia` — uma tarefa concluída e depois devolvida ao pool ainda conta
  no heatmap e no gráfico de 7 dias, mas não nos cards de período nem no `/calendario`
  novo; (b) `RegistroHumorDia.tsx` (linha ~84) tem uma cópia privada de
  `dataInputParaISOMeioDia` (a versão pública está em `src/lib/tarefas/formato.ts`).

---

## 7. Os 3 passos do deploy único — histórico (concluído)

Esta seção documentava os passos pendentes antes do primeiro deploy dos 21 itens.
**Os três estão concluídos** e ficam aqui só como registro do que foi feito, na ordem
em que aconteceu:

### Passo 1 — Fechar a regressão do /progresso — ✅ concluído
No Lote E já estava provado que **rotina NÃO entra** nas contagens. Faltava o outro
lado: confirmar que **tarefa comum AINDA entra** (o filtro `!ehRotina` não excluiu
demais). Testado em `/progresso`: criar e concluir uma tarefa comum fez os contadores
de 7 dias **subirem** normalmente. Regressão fechada dos dois lados (ver §5 e §6).

### Passo 2 — Mesclar o Lote E — ✅ concluído
```powershell
git checkout master
git merge lote-e           # fast-forward -> master em a9fedb8
git branch -d lote-e
```
Os 7 lotes (A→E) ficaram empilhados no `master` em `a9fedb8`.

### Passo 3 — DEPLOY ÚNICO — ✅ concluído
Os 7 lotes foram ao ar de uma vez, sobre os dados reais do celular (que rodava
`e047ced`, pré-melhorias). `git push` disparou o deploy automático na Vercel; a
publicação ficou **Ready**. Smoke-test no celular validou os dois pontos que
importavam: (a) as melhorias apareceram; (b) as tarefas antigas continuaram
**intactas** — confirmando a retrocompatibilidade com que os 7 lotes foram desenhados.

**Estado atual:** `master` publicado em `a9fedb8`, sincronizado com `origin/master`.
A Fase 8 (calendário, §8) está em curso — ver `lote-8a` para o desenvolvimento
corrente.

---

## 8. Ideia futura já avaliada — Calendário ("Fase 8")

O usuário quer uma **aba de calendário** (estilo Google Calendar), com visões dia/semana/mês, para (1) **agendar tarefas por horário** e (2) **ver quantas tarefas criadas/concluídas por dia**. Avaliação já feita:

- **É a evolução natural da "agenda de hoje"** (Lote E) — direção coerente.
- **Os dois pedidos têm custos MUITO diferentes:**
  - *Contadores por dia (pedido 2): BARATO.* Os dados já existem (`agregacao.ts` do Lote F: `tarefasCriadasNoDia`, `tarefasConcluidasNoDia`) e já há um heatmap mensal no /progresso. É quase reaproveitamento num layout de grade.
  - *Agendar por horário + visões dia/semana (pedido 1): CARO.* O modelo **nunca teve HORA** — todos os campos de data são gravados ao meio-dia local (só o dia). Agendar "às 15h" exige um campo novo de **data+hora** (ex.: `agendadaEm`). Somado à UI de calendário (visões semana/dia com faixas de horário são das interfaces mais trabalhosas), são realisticamente **2–4 lotes**.
- **Questão de design a resolver (não é bloqueio):** um calendário rígido reintroduz o "perdeu o slot das 15h" — a dinâmica de falha que o Mind evita. Fazer com **âncoras gentis**, não compromissos rígidos: horário não cumprido **volta pro pool** sem estado de falha, linguagem observacional. Assim o calendário fica coerente com o não-punitivo.
- **Faseamento recomendado:**
  - **8a (barata):** calendário **mensal com contadores por dia** — entrega o pedido 2 rápido, reusando `agregacao.ts` + heatmap. Cria a "casa" do calendário.
  - **8b (média):** campo de **data+hora** (`agendadaEm`) + mostrar tarefas agendadas na agenda/visão de dia. Núcleo do pedido 1.
  - **8c (maior):** visões **dia/semana com faixas de horário** (o cara a cara com o Google Calendar).
- **Detalhe técnico (decidir no lote certo):** visão mensal é fácil à mão (grade 7 colunas, heatmap já existe). Semana/dia com horário é onde uma lib (ex.: `react-big-calendar`) economizaria — mas ela briga com as paletas sensoriais e o não-punitivo. Provável: **mês à mão; decidir lib-vs-mão só para semana/dia.**

**Importante (histórico):** a regra era só começar a Fase 8 depois de fechar os 3 passos
da §7 (regressão + merge + deploy) — para não abrir uma nova frente com um lote pronto e
não publicado. **Os 3 passos estão concluídos** (§7): o deploy único já ocorreu e foi
validado no celular. A Fase 8 **está liberada e em curso** — a 8a (calendário mensal com
contadores por dia) é a fatia em desenvolvimento agora, no branch `lote-8a`. Ver também a
dívida técnica registrada em §6 sobre as três implementações de grade mensal que a 8a
introduziu.

---

## 9. Como retomar desde o PowerShell

**Localizar-se primeiro.** O estado descrito abaixo é o de referência (pós-deploy,
Fase 8 em curso); confirme com `git log`/`git branch` antes de assumir que nada mudou
desde a última sessão.

### Parte 1 — Reabrir e localizar
1. Abra o **PowerShell**.
2. `cd C:\Users\Admin\Documents\mind-app`
3. Rode:
   ```powershell
   git status
   git branch
   git log --oneline -8
   ```

### Parte 2 — Interpretar
Marcador-chave: `a9fedb8` = Lote E, topo do `master` desde o deploy único (§7). O
branch `lote-e` não existe mais (apagado após o merge).

- **`master` em `a9fedb8`, "up to date with 'origin/master'"** → cenário de referência:
  os 21 itens estão publicados. Se houver um branch `lote-X` ativo (ex.: `lote-8a`), é
  a Fase 8 em desenvolvimento — retome por ali.
- **Algo diferente disso** (branch `lote-e` ainda existindo, `master` atrás de
  `a9fedb8`, etc.) → o repositório está num estado anterior ao registrado aqui;
  trate como desatualização deste documento antes de seguir, não como o esperado.

### Parte 3 — Testar/rodar (quando aplicável)
- Para a regressão do /progresso e testes de UI: segunda janela do PowerShell → `cd` na pasta → `npm run dev` → `localhost:3000`.
- **Claude Code** só é necessário para escrever/implementar novo código (ex.: Fase 8). Reabrir: `claude` → `/login` (o restart desloga) → `/model opusplan`. Comandos `git` seguem indo no PowerShell.

### Parte 4 — Próximo grande passo
- Fechados os 3 passos da §7, o app está **completo e no ar** (21 itens).
- A partir daí, iniciar a **Fase 8 (calendário)** pela **8a** (mensal com contadores — valor rápido), com spec e **G0 primeiro**, como todos os lotes. A questão de design (âncoras gentis vs. slots rígidos) deve ser decidida antes da 8b.

---

**Divisão que evita confusão, sempre:** comandos `git` → **PowerShell**; spec do lote → **conversa do Claude Code**. O git sobrevive a restart; o Claude Code precisa de `/login` depois de reiniciar.
