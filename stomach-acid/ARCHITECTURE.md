# Arquitetura

O projeto é organizado por responsabilidade e funcionalidade:

    src/
      main.tsx
      app/                  Composição e navegação
      pages/                Página explicativa
      components/           Fontes e layout compartilhados
      features/
        chemistry/model/    Tipos, substâncias e funções químicas puras
        laboratory/
          pages/            Composição do laboratório
          components/       Controles, indicadores, desafios e resultado
          hooks/            Estado, ações e pontuação
          model/            Dados das missões e verificação de metas
        molecular/
          components/       Integração React e carregamento sob demanda
          scene/            Câmera, geometria, animação e recursos GPU
        theme/              Botão, estado e persistência de tema
      styles/               Base, layout do jogo e tema do laboratório
    tests/
      unit/                 Testes de química e metas, executados com Node
      e2e/                  Fluxos de interface com Playwright

## Responsabilidades

- **app/App.tsx** escolhe a página e compõe Header e Footer. A navegação, rolagem e foco ficam em useHashNavigation.
- **chemistry** não depende de React, Three.js ou DOM. Os tipos ficam em types.ts; as substâncias em antacids.ts; o balanço em reactions.ts.
- **laboratory** usa a química e concentra as ações em useLaboratory. Os componentes recebem dados e comandos; não calculam coeficientes químicos.
- **molecular** recebe o estado da reação. MolecularScene monta e desmonta a cena. createMolecularScene cria os recursos e devolve comandos e dispose(). A cena não conhece pontuação ou missões.
- **theme** mantém apenas a preferência de aparência.
- **components** reúne elementos usados por diferentes páginas.

Use imports diretos. Os tipos de domínio ficam junto à lógica correspondente; os tipos de props ficam com cada componente. Não é necessário adicionar um gerenciador global de estado para esse escopo.

## Onde alterar

| Mudança | Arquivo ou pasta em src/ |
| --- | --- |
| Substâncias e proporções | features/chemistry/model/antacids.ts |
| Balanço químico | features/chemistry/model/reactions.ts |
| Missões | features/laboratory/model/missions.ts |
| Ações e pontuação | features/laboratory/hooks/useLaboratory.ts |
| Controles e indicadores | features/laboratory/components/ |
| Geometria e iluminação | features/molecular/scene/createMolecularScene.ts |
| Preferência de tema | features/theme/useTheme.ts |
| Conteúdo explicativo | pages/IntroductionPage.tsx |
| Aparência | styles/ |

## Estilos

main.tsx importa apenas styles/index.css. A ordem base → game → laboratory é explícita. A cascata existente foi preservada para manter a aparência; esta refatoração não redesenha nem reordena os seletores.

## Verificação

- npm.cmd test: testes unitários.
- npm.cmd run typecheck: TypeScript.
- npm.cmd run build: TypeScript e Vite.
- npm.cmd run test:e2e: Playwright, com o servidor iniciado em http://127.0.0.1:5173. A variável PLAYWRIGHT_BASE_URL permite usar outra URL.

## Navegação e carrosséis
- O hash seleciona capítulos: inicio, conceitos, reacoes, apresentacao, jogo e livre. O histórico do navegador continua funcionando.
- components/layout/Header contém o menu de capítulos, com fechamento por Escape e clique fora.
- components/ui/Carousel é compartilhado pelos conceitos e pelo roteiro. Exibe um card por vez, sem reprodução automática; aceita botões, teclado e gestos horizontais.
- features/chemistry/components/ReactionExplorer compara os três reagentes; features/laboratory/components/AcidMeter visualiza o consumo de HCl.
- Estilos de componentes ficam ao lado do componente; styles/editorial.css reúne os ajustes visuais gerais.
