# Pesquisa técnica e avaliação: iniciativas de engajamento para público TDAH

> Síntese de 62 confrontos comparativos de ideias de funcionalidades geradas para o app Mind (arquivo `Debate_tecnico_Mind.txt`), cruzada com pesquisa acadêmica e de mercado sobre engajamento de usuários com TDAH. Objetivo: identificar quais iniciativas de engajamento têm melhor relação evidência-impacto para priorização no MVP.

---

## 1. Metodologia

O material de origem contém 62 rodadas de debate multi-especialista, cada uma comparando duas variações de ideia para o app Mind e elegendo a mais forte. Os nomes das funcionalidades variam entre rodadas (ex: "Effort Emblems" vs "Growth Gems" vs "Skill Constellations"), mas convergem em um número pequeno de **padrões de engajamento recorrentes**. Este documento:

1. Agrupa esses padrões em categorias.
2. Avalia cada categoria com os atributos definidos no documento de instruções (Flexibility, Scientific Backing, Gamification Impact, Novelty).
3. Cruza com literatura acadêmica e de produto real (2024–2026) para validar ou temperar as afirmações do material original — que, mesmo bem argumentado, é gerado por IA e não substitui evidência real.
4. Termina com uma recomendação priorizada para o MVP.

---

## 2. Categorias de iniciativas identificadas

### 2.1 Task Pools não-punitivos (retorno suave de tarefas)

**O que é**: tarefas não concluídas não são marcadas como "falha" — voltam para um pool neutro, disponíveis para nova seleção quando o usuário tiver capacidade.

**Por que funciona**: pessoas com TDAH sofrem de fadiga decisória e paralisia por medo de "falhar" novamente diante de listas rígidas. Remover o conceito de falha do sistema reduz a carga emocional associada a reagendar.

**Evidência real**: sistemas de recompensa tradicionais (pontos por conclusão, sequências/streaks) tendem a punir indiretamente quem quebra o padrão — a literatura sobre gamificação em saúde mental mostra que pessoas com dificuldades de regulação emocional respondem pior a mecânicas competitivas e melhor a frameworks de reforço não avaliativo.

| Atributo | Nota |
|---|---|
| Flexibility Score | 5 |
| Scientific Backing | 3 (bem fundamentado em teoria comportamental; poucos estudos específicos em apps) |
| Gamification Impact | 4 |
| Novelty | 3 (conceito já presente em apps como Todoist/TickTick, mas raramente explícito como filosofia central) |

---

### 2.2 Timers visuais com "decay" (ChronoCanvas / Time Timer)

**O que é**: representação visual do tempo passando — círculo que encolhe, líquido que drena, gradiente de cor — em vez de números abstratos.

**Por que funciona**: *time blindness* é um dos sintomas centrais do TDAH — dificuldade genuína em perceber a passagem do tempo. Tornar o tempo um objeto visual e espacial, em vez de um número, ajuda o cérebro a registrar essa passagem sem precisar calcular.

**Evidência real**: essa é, dentre todas as categorias analisadas, a que tem **maior consenso prático** — ferramentas como Time Timer já são recomendadas clinicamente e citadas de forma consistente em guias de coaching de função executiva como o principal antídoto de baixo custo para time blindness.

| Atributo | Nota |
|---|---|
| Flexibility Score | 4 |
| Scientific Backing | 5 |
| Gamification Impact | 2 (não é gamificação em si, é um recurso de suporte) |
| Novelty | 2 (já é padrão de mercado — o diferencial está em integrar bem, não em inventar) |

---

### 2.3 Body doubling virtual

**O que é**: presença simultânea (real ou simulada) de outras pessoas trabalhando, para reduzir procrastinação e paralisia de início de tarefa.

**Por que funciona**: mecanismos propostos incluem resposta dopaminérgica à interação social, teoria da facilitação social e efeito Hawthorne (mudança de comportamento por se saber observado).

**Evidência real**: importante nuance — **não há ainda pesquisa clínica rigorosa e específica** testando body doubling isoladamente; a evidência é majoritariamente anedótica, mas consistente o suficiente para que produtos reais (Focusmate, Flow Club) tenham tração real no mercado. Um estudo recente em HCI nota que o efeito é heterogêneo: ajuda algumas pessoas e distrai outras, dependendo de como o traço de TDAH se manifesta.

| Atributo | Nota |
|---|---|
| Flexibility Score | 4 |
| Scientific Backing | 2 (evidência anedótica forte, mas não controlada) |
| Gamification Impact | 3 |
| Novelty | 2 (categoria já consolidada por concorrentes diretos) |

---

### 2.4 Micro-metas e quebra automática de tarefas

**O que é**: decomposição automática (ou assistida por IA) de tarefas grandes em subtarefas pequenas, com recompensa imediata a cada conclusão.

**Por que funciona**: tarefas grandes disparam paralisia de iniciação. Subdividir cria vitórias rápidas que geram pequenos picos de dopamina, sustentando motivação.

**Evidência real**: há dado quantitativo direto aqui — um estudo de 2021 em *Cognitive Therapy and Research* encontrado na pesquisa de mercado aponta melhora de até 47% na duração de foco ao longo de quatro semanas quando tarefas são quebradas em micro-metas.

| Atributo | Nota |
|---|---|
| Flexibility Score | 4 |
| Scientific Backing | 4 |
| Gamification Impact | 4 |
| Novelty | 3 |

---

### 2.5 Gamificação por esforço (não por resultado)

**O que é**: emblemas/gemas/"constelações de habilidade" concedidos por tentar, se adaptar e refletir — não apenas por completar tarefas.

**Por que funciona**: TDAH está associado a um processamento de recompensa atípico. Ligar a recompensa exclusivamente ao resultado final penaliza dias ruins; ligar ao esforço mantém engajamento mesmo em ciclos de baixa energia.

**Evidência real**: ensaio clínico randomizado recente (2025, *Frontiers in Education*, 8 semanas, crianças com TDAH) mostrou melhora significativa em atenção sustentada e desempenho acadêmico com aplicativo gamificado vs. não gamificado — mas a maior parte da evidência forte ainda é em contexto infantil/educacional, não produtividade adulta.

| Atributo | Nota |
|---|---|
| Flexibility Score | 3 |
| Scientific Backing | 4 |
| Gamification Impact | 5 |
| Novelty | 3 |

---

### 2.6 Customização sensorial (Sensory Tags / Sensory Sanctuary)

**O que é**: paletas, densidade visual, intensidade de notificação e modos de foco ajustáveis por perfil sensorial do usuário.

**Por que funciona**: sobrecarga sensorial é gatilho comum de burnout em pessoas neurodivergentes (TDAH e Autismo). Interfaces "tamanho único" aumentam abandono.

**Evidência real**: usuários reais de apps de TDAH relatam explicitamente, em pesquisa qualitativa recente, preferência por interfaces com mais recursos gráficos e cor — e pedem elementos de recompensa visual justamente para suprir a falta do "estímulo de dopamina" que sentem faltar em apps mais neutros.

| Atributo | Nota |
|---|---|
| Flexibility Score | 5 |
| Scientific Backing | 3 |
| Gamification Impact | 2 |
| Novelty | 3 |

---

### 2.7 Micro-pausas restaurativas proativas

**O que é**: o app sugere pausas curtas e guiadas com base em sinais de fadiga ou padrão de uso, antes do burnout acontecer.

**Por que funciona**: combate diretamente o ciclo "boom-bust" característico do TDAH (hiperfoco seguido de exaustão).

**Evidência real**: é a categoria de **maior risco técnico** identificada no próprio material de debate — prever o momento certo de propor uma pausa exige inferência comportamental sofisticada; se mal calibrada, gera irritação em vez de alívio. Recomenda-se começar com versão simples (regra fixa, ex: a cada X minutos de uso contínuo) antes de qualquer personalização adaptativa.

| Atributo | Nota |
|---|---|
| Flexibility Score | 3 |
| Scientific Backing | 2 (plausível, mas pouco testado como feature específica) |
| Gamification Impact | 3 |
| Novelty | 4 |

---

### 2.8 Analytics descritivos (não avaliativos)

**O que é**: painéis de progresso em linguagem de "observação" e "aprendizado" — nunca "streak quebrada" ou "meta perdida".

**Por que funciona**: métricas punitivas reforçam vergonha, um gatilho comum de abandono de apps de produtividade por parte de usuários neurodivergentes.

| Atributo | Nota |
|---|---|
| Flexibility Score | 4 |
| Scientific Backing | 3 |
| Gamification Impact | 3 |
| Novelty | 3 |

---

## 3. Ranking para priorização no MVP

| Prioridade | Iniciativa | Justificativa |
|---|---|---|
| 1 | **Timer visual com decay** | Maior evidência científica direta + menor complexidade técnica. Base do produto. |
| 2 | **Micro-metas com quebra automática** | Dado quantitativo forte (47% de melhora) + relativamente simples de implementar sem IA complexa. |
| 3 | **Task pools não-punitivos** | Baixo custo técnico, alto impacto psicológico — é mais um princípio de design do que uma feature isolada. |
| 4 | **Gamificação por esforço** | Alto impacto motivacional, mas cuidado: evidência forte é majoritariamente em contexto infantil — adaptar linguagem para público adulto. |
| 5 | **Customização sensorial** | Fácil de fasear (começar com poucas opções, expandir depois). |
| 6 | **Analytics descritivos** | Vem "de graça" se o princípio de não-julgamento for aplicado desde o design dos dados. |
| 7 | **Micro-pausas proativas** | Deixar para uma versão 2 — risco técnico alto, evidência ainda fraca. |
| 8 | **Body doubling virtual** | Feature de alto valor percebido, mas evidência anedótica e mercado já com players fortes (Focusmate) — avaliar como integração/parceria em vez de construir do zero. |

---

## 4. Fontes consultadas

- Dai et al., *Effectiveness of a gamified educational application on attention and academic performance in children with ADHD* — Frontiers in Education, 2025/2026.
- *A mobile app as a gamified early intervention for ADHD students* — ResearchGate, 2024.
- Imaginovation, *How Gamification in ADHD Apps Can Boost User Retention*, 2025 (cita estudo de 2021 em *Cognitive Therapy and Research* sobre micro-metas).
- *"A one-stop shop": Real-world use and app-users' experiences of a psychoeducational smartphone app for adults with ADHD* — ScienceDirect, 2025.
- Flow Club, *Body Doubling for ADHD: Everything You Need to Know*, 2026.
- *You Are Not Alone: Designing Body Doubling for ADHD in Virtual Reality* — arXiv, 2025 (nota sobre heterogeneidade do efeito).
- Medical News Today, *Body doubling for ADHD: Definition, how it works, and more*, 2024 (nota sobre ausência de pesquisa controlada recente).
- Simply Psychology, *The Best ADHD Apps of 2026: What Works and What's Hype*, 2026.
- Material interno: `Debate_tecnico_Mind.txt` (62 rodadas de debate comparativo gerado para ideação do app Mind).

> Observação: links completos não foram incluídos linha a linha para manter o documento enxuto — todas as fontes acima são pesquisáveis diretamente pelo título. Recomenda-se validar cada uma novamente antes de citá-las publicamente, já que parte do material é recente e pode ser atualizado.
