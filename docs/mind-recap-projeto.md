# Mind — Recapitulação completa do projeto (handoff para nova conversa)

> **Propósito deste documento:** retomar o desenvolvimento do app Mind numa conversa nova, sem re-explicar tudo. Cole este arquivo (ou suba-o como arquivo do projeto) no início da próxima conversa. Contém: contexto, ambiente técnico, decisões travadas, status de cada lote, o que falta AGORA, plano de deploy, a ideia futura do calendário (já avaliada) e como retomar desde a abertura do PowerShell.
>
> **Estado em uma frase:** os **21 itens de melhoria estão implementados** (Lotes A→E). Os Lotes A, G, F, B, C, D estão **mesclados no `master` local**; o **Lote E está commitado no branch `lote-e`, mas ainda NÃO mesclado**. Falta: (1) a segunda metade da regressão do /progresso, (2) o merge do Lote E, (3) o **deploy único** na Vercel. Tudo segurando o push até o fim. Depois, há uma **nova ideia (calendário — "Fase 8")** já avaliada, a construir em fases.

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
| **E** | Rotinas + agenda de hoje | 3, 8 | `a9fedb8` | 🟡 **Commitado no `lote-e`, NÃO mesclado** |

**Cadeia de commits no `master`:** `e047ced` (pré-melhorias, é o que está NO AR hoje) → `b03f254` (A) → `3360108` (G) → `c5f56a9` (F) → `664369c` (B) → `32271dc` (C) → `befe64d` (D, HEAD atual do `master`).
**Fora do `master`:** `a9fedb8` (E) vive no branch `lote-e`, aguardando merge.

### Resumo do que cada lote entregou

**Lote A (`b03f254`)** — data de criação exibida; editar nome de micro-metas; editar data de conclusão (move nos gráficos); copiar tarefa (começa do zero); busca "contém" (case/acento-insensível); alternar visão completa/resumida. Criou `src/lib/tarefas/formato.ts`.

**Lote G (`3360108`)** — data editável no registro de humor (que já existia, ligado à Fase 4). Bug do editor de data (fechava no primeiro onChange) corrigido. Arquivos: `reflexoesStore.ts`, `RegistroHumorDia.tsx`.

**Lote F (`c5f56a9`)** — cards de criadas/concluídas em 7/30 dias (rolling); filtros por data (criação/conclusão) + lista resumida ordenada por status. Regra crítica: "concluída" = `estado==="concluida"` E `concluidaEm`. Criou `src/lib/tarefas/estados.ts`; componentes `CartaoIndicadorPeriodo`, `FiltroTarefasPorData`.

**Lote B (`664369c`)** — estimativa opcional em h/min (sempre gravada em minutos); miniseletor de duração (15/25/45+custom) quando não há estimativa (preserva o decay); checkbox "Quebrar em microtarefas?"; "Previsão de término" editável (fora do /progresso); flag "Emergencial" (vermelho). Convergência em `duracaoPlanejadaMin`. Validado: números do /progresso inalterados.

**Lote C (`32271dc`)** — sistema de tags criado do zero (por id: `tagsStore.ts`, `Task.tagIds`); gerenciador na Config (criar/renomear/deletar com reatribuição pra "sem tag"); cores por status via `ESTADO_COR_VAR` em `estados.ts` (tokens `--status-*` fixos; componente `ChipStatus`). Validado via Playwright. **Pendência opcional:** casos de borda das tags (nome vazio/duplicado) não testados.

**Lote D (`befe64d`)** — som aos 50% (novo) além do som do fim (que já existia); detecção movida pra dentro do tick; `chime.ts` com variante "metade" (660 Hz, ~60% volume, sem vibração); reusa `Config.intensidadeNotificacao` (silencioso=off). Mecanismo de flag persistida (`metadeSinalizada`) testado contra disparo retroativo (sair/voltar) e escuta manual do áudio — ambos OK.

**Lote E (`a9fedb8`, NÃO mesclado)** — rotinas semanais + agenda de hoje:
- Campos novos em `Task`: `diasSemana?`, `repetirAte?`, `ultimaConclusao?` (todos opcionais).
- Novo `src/lib/tarefas/rotinas.ts` centraliza `ehRotina`, `rotinaAtivaEm`, `dentroDoRepetirAte` (inclui o próprio dia), `feitoHoje`.
- Marcador "Rotina?" no formulário (revelação progressiva), revelando seletor S/T/Q/Q/S/S/D e "Repetir até".
- Rotina troca "Concluir" por "Feito hoje" ↔ "Desfazer" (nunca usa `concluida`). Seção "Rotinas" separada na lista.
- Novo `AgendaHoje.tsx` acima da lista: rotinas ativas hoje (não feitas) + tarefas com previsão B3 de hoje; vazio = "Nada previsto para hoje."
- `/progresso` filtra `!ehRotina` das agregações de **contagem de tarefas** (não dos minutos focados).
- Bug corrigido ao vivo: agenda não excluía rotinas já marcadas "feito hoje" — corrigido antes do commit.
- **Testado só um lado da regressão** (rotina NÃO entra nas contagens — "Tarefas criadas" ficou 0 mesmo com rotina de hoje). **Falta o outro lado** (ver §7).

---

## 6. Padrões e lições recorrentes

- **G0 (inspeção) antes de codar:** uma spec descreve o que o autor *imagina* que existe; o G0 verifica o que *de fato* existe. Salvou o projeto várias vezes (tags e humor não existiam como imaginado; no Lote E refinou "rotina fora dos analytics" para "fora só das contagens de tarefas; minutos focados contam").
- **"Última milha" de teste manual:** testes automatizados (Playwright) provam a *lógica*, mas não tudo. Fechar sempre com verificação humana: cliques reais, escuta de áudio (Lote D), e bugs pegos ao vivo (Lote E: agenda não excluía "feito hoje").
- **Regressão sempre dos DOIS lados:** ao filtrar dados, testar que o filtro (a) inclui o que deve e (b) NÃO exclui demais. É a pendência atual do Lote E.
- **Bug do editor de data apareceu 3x** (G, B, retroativamente no A). Oportunidade anotada (sua escolha): extrair um componente único de editor de data.
- **Consistência entre lotes paga dividendos:** `duracaoPlanejadaMin` (B) tornou os 50% do Lote D triviais; `estados.ts` (F) virou fonte única de cor e ordem; `rotinas.ts` (E) centralizou recorrência.

---

## 7. O que falta AGORA (retomar por aqui) — 3 passos

### Passo 1 — Fechar a regressão do /progresso (a metade que faltou)
No Lote E testamos que **rotina NÃO entra** nas contagens. Falta provar o **outro lado — que tarefa comum AINDA entra** (garantir que o filtro `!ehRotina` não pegou demais). Com `npm run dev` rodando:
1. Em `/progresso`, **anote** "tarefas criadas/concluídas" nos últimos 7 dias.
2. Crie uma **tarefa comum** (sem "Rotina?") e conclua.
3. Confirme que os contadores **subiram** (tarefa comum entra normalmente).
4. (Já provado: criar/marcar rotina não mexe nos números.)

Se subir, o filtro está cirúrgico e a regressão fecha dos dois lados.

### Passo 2 — Mesclar o Lote E (sem push)
Passando o Passo 1, no PowerShell:
```powershell
git status                 # confirmar: On branch lote-e
git checkout master
git merge lote-e           # deve ser fast-forward -> master em a9fedb8
git branch -d lote-e
git status                 # confirmar: ahead of 'origin/master' by 7 commits
```
Isso deixa **7 lotes** (A→E) empilhados no `master`, todos ainda sem push.

### Passo 3 — DEPLOY ÚNICO (o grande momento)
Os 7 lotes vão ao ar de uma vez, sobre os dados reais do celular (que hoje roda `e047ced`, pré-melhorias).
1. **Antes:** garantir que tudo foi testado (é o único ponto de segurança — não há teste no celular antes do push).
2. `git push` (no PowerShell) → dispara o deploy automático na Vercel.
3. Acompanhar na aba **Deployments** da Vercel até ficar **Ready**.
4. **Validar no celular (smoke-test), dois pontos:** (a) as melhorias apareceram; (b) as tarefas antigas continuam **intactas**. Esse teste pesa porque 7 lotes vão ao ar juntos — todos foram desenhados retrocompatíveis com o localStorage existente, mas confirmar no aparelho é a prova final.

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

**Importante:** só começar a Fase 8 **depois** de fechar os 3 passos da §7 (regressão + merge + deploy). Não abrir nova frente com um lote pronto e não publicado.

---

## 9. Como retomar desde o PowerShell

**Localizar-se primeiro** (não assumir o branch). O estado exato depende de onde parou.

### Parte 1 — Reabrir e localizar
1. Abra o **PowerShell**.
2. `cd C:\Users\Admin\Documents\mind-app`
3. Rode:
   ```powershell
   git status
   git branch
   git log --oneline -8
   ```

### Parte 2 — Interpretar (o `git log`/`git branch` diz tudo)
Marcadores-chave: `befe64d` = Lote D (topo esperado do `master`); `a9fedb8` = Lote E (no branch `lote-e`).

- **Se existe o branch `lote-e` e o `master` está em `befe64d`** (cenário esperado) → o Lote E está commitado mas **não mesclado**. Faça a §7 na ordem: Passo 1 (regressão), Passo 2 (merge), Passo 3 (deploy).
- **Se o topo do `master` já é `a9fedb8`** → o Lote E **já foi mesclado**. Falta só o Passo 3 (deploy), se ainda não foi feito. Cheque se já houve `git push` (o `git status` diria "up to date with 'origin/master'" em vez de "ahead by N commits").
- **Se `git status` mostra "up to date with 'origin/master'" com `a9fedb8`** → o **deploy já aconteceu**. Valide no celular e siga para a Fase 8 (§8).

### Parte 3 — Testar/rodar (quando aplicável)
- Para a regressão do /progresso e testes de UI: segunda janela do PowerShell → `cd` na pasta → `npm run dev` → `localhost:3000`.
- **Claude Code** só é necessário para escrever/implementar novo código (ex.: Fase 8). Reabrir: `claude` → `/login` (o restart desloga) → `/model opusplan`. Comandos `git` seguem indo no PowerShell.

### Parte 4 — Próximo grande passo
- Fechados os 3 passos da §7, o app está **completo e no ar** (21 itens).
- A partir daí, iniciar a **Fase 8 (calendário)** pela **8a** (mensal com contadores — valor rápido), com spec e **G0 primeiro**, como todos os lotes. A questão de design (âncoras gentis vs. slots rígidos) deve ser decidida antes da 8b.

---

**Divisão que evita confusão, sempre:** comandos `git` → **PowerShell**; spec do lote → **conversa do Claude Code**. O git sobrevive a restart; o Claude Code precisa de `/login` depois de reiniciar.
