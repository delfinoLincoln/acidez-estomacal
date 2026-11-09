# Acidez em equilíbrio

Trabalho de química sobre acidez do estômago e antiácidos, feito com **Vite + React + TypeScript**.

## Executar

É necessário Node.js 22.18 ou superior.

No terminal, dentro desta pasta:

```powershell
npm install
npm run dev
```

Abra o endereço indicado pelo Vite, normalmente http://127.0.0.1:5173 ou visite https://acidez-estomacal.vercel.app/
No PowerShell, `npm.cmd` evita o bloqueio de execução de scripts `npm.ps1`.
Em outros terminais, pode usar `npm`.

## O que está pronto

- Introdução sobre HCl, digestão, azia e neutralização.
- Minigame com três missões, previsão, tentativas e até 450 pontos.
- Modo livre para comparar Mg(OH)₂, CaCO₃ e NaHCO₃.
- Layout para celular, navegação por teclado e opção de pausar a animação.
- Fontes e crédito explícito ao uso de ChatGPT/Codex.

O jogo começa do zero ao sair da tela ou recarregar a página. Não há cadastro. Apenas a preferência de tema claro/escuro fica salva localmente no navegador.

## Mapa do projeto

Veja [ARCHITECTURE.md](stomach-acid/ARCHITECTURE.md) para a estrutura e as responsabilidades.

| Pasta                    | Responsabilidade                             |
| ------------------------ | -------------------------------------------- |
| src/app/                 | Composição das telas e navegação.            |
| src/pages/               | Página explicativa.                          |
| src/components/          | Layout, fontes e créditos compartilhados.    |
| src/features/chemistry/  | Tipos, substâncias e balanço químico.        |
| src/features/laboratory/ | Estado do jogo, missões, página e controles. |
| src/features/molecular/  | Componentes React e cena Three.js.           |
| src/features/theme/      | Alternância e persistência do tema.          |
| src/styles/              | Estilos com um único ponto de entrada.       |
| tests/unit/ e tests/e2e/ | Testes de lógica e navegador.                |


## Testar e gerar a versão final

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview -- --port 5173
```

Em outro terminal, para testar os fluxos no Microsoft Edge instalado:

```powershell
npm.cmd run test:e2e
```

O build verifica os tipos e cria `dist/`. Use um servidor local ou a hospedagem para abrir essa versão; não abra o HTML com duplo clique.
Depois de instalar as dependências, a apresentação local não usa fontes, imagens ou bibliotecas externas pela internet. Os links das fontes precisam de conexão.

## Modelo químico

O estado inicial contém 12 mmol fictícios de HCl. Cada clique representa 1 mmol da substância selecionada. Os coeficientes das equações determinam o consumo de HCl e a formação de água e CO₂. A reação para quando o ácido acaba.

O modelo assume reação completa e não calcula pH, solubilidade, cinética, volume, tamponamento ou secreção gástrica. As metas são exercícios de estequiometria e não representam doses ou metas clínicas. Os símbolos mostram quantidades; não representam trajetórias moleculares reais. A água já existente e os íons espectadores são omitidos.

Fontes científicas estão na própria página. Referências técnicas: [React](https://react.dev/learn/build-a-react-app-from-scratch) e [Vite](https://vite.dev/guide/).

## Visualização 3D e temas

- `src/features/molecular/scene/createMolecularScene.ts`: cena Three.js, contorno esquemático com profundidade, partículas, iluminação e controles de câmera. Não usa modelos ou texturas remotas.
- `src/features/theme/ThemeToggle.tsx`: alternância de tema, escuro por padrão, com preferência salva em `localStorage`.
- `src/styles/laboratory.css`: identidade do laboratório e cores dos dois temas.
- A cena permite arrastar, aproximar, afastar, girar por botão, restaurar a câmera e ocultar o contorno.
- Os conjuntos H₂O e CO₂ são representações ilustrativas; tamanhos, cores e movimentos não são uma simulação molecular física. A estequiometria continua em `src/features/chemistry/model/reactions.ts`.
- Movimento reduzido pausa o movimento automático. Fora da tela, a cena evita renderização desnecessária. Sem WebGL, há uma alternativa textual e os controles químicos continuam funcionando.

Referências de interação indicadas pelo aluno: [PhET](https://phet.colorado.edu/), [ChemCollective](https://chemcollective.org/vlabs), [MolView](https://molview.org/), [Three.js](https://threejs.org/examples/), [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/examples) e [Codrops](https://tympanus.net/codrops/). A implementação usa Three.js diretamente dentro de um componente React.
