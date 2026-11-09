import Carousel from "../components/ui/Carousel";
import ReactionExplorer from "../features/chemistry/components/ReactionExplorer";
import type { Page } from "../app/useHashNavigation";
import "./IntroductionPage.css";
import Sources from "../components/Sources";
import Stomach from "../features/molecular/components/Stomach";
import { initialState } from "../features/chemistry/model/reactions";

export default function IntroductionPage({
  chapter = "inicio",
}: {
  chapter?: Page;
}) {
  return (
    <>
      {chapter === "inicio" && (
        <section className="intro intro-grid">
          <div>
            <p className="eyebrow">QUÍMICA NO SEU DIA A DIA / EXPERIMENTO 01</p>
            <h1 className="cover-title">
              Acidez em
              <br />
              <em>equilíbrio.</em>
            </h1>
            <p>
              Seu estômago precisa de ácido.
              <br />
              Então, o que um antiácido faz lá dentro?
            </p>
            <a className="start-link" href="#conceitos">
              Entenda a química <span aria-hidden="true">↓</span>
            </a>
            <p className="small">
              Aprenda os conceitos. Depois, coloque sua hipótese à prova.
            </p>
          </div>
          <div className="hero-figure">
            <div className="visual-top">
              <span>POR DENTRO DA REAÇÃO</span>
              <span className="tag">HCl + ANTIÁCIDO</span>
            </div>
            <Stomach state={initialState()} paused />
            <div className="hero-caption">
              <strong>Uma reação. Novos produtos.</strong>
              <span>Explore ácidos, bases e sais.</span>
            </div>
          </div>
        </section>
      )}
      {chapter === "conceitos" && (
        <section id="conceitos" className="learn chapter-page">
          <div className="section-heading">
            <p className="eyebrow">PRIMEIRO, ENTENDA</p>
            <h1>
              O ácido não é <em>o vilão.</em>
            </h1>
          </div>
          <Carousel label="Conceitos de química">
            <article>
              <div className="card-art" aria-hidden="true">
                <small>Suco gástrico</small>
                <strong>HCl</strong>
                <span className="art-note">ÁCIDO CLORÍDRICO</span>
              </div>
              <div className="card-copy">
                <span className="number">01 / A função do ácido</span>
                <h2>O estômago é ácido.</h2>
                <p>
                  O suco gástrico contém ácido clorídrico, HCl. O meio ácido
                  participa da digestão, ajudando a criar as condições de
                  atuação de enzimas como a pepsina.
                </p>
              </div>
            </article>
            <article>
              <div className="card-art" aria-hidden="true">
                <small>O caminho do refluxo</small>
                <svg viewBox="0 0 140 140">
                  <path d="M58 12v42c-28 4-36 32-22 53 16 24 57 20 69-6 14-30-2-55-28-48V12" />
                  <path d="M67 92V28m-10 10 10-10 10 10" />
                  <path d="M41 95c16-10 33 9 54-2" opacity=".5" />
                </svg>
                <span className="art-note">ESTÔMAGO → ESÔFAGO</span>
              </div>
              <div className="card-copy">
                <span className="number">02 / Entenda o refluxo</span>
                <h2>De onde vem a azia?</h2>
                <p>
                  A azia pode ocorrer quando o conteúdo ácido do estômago volta
                  para o esôfago. Não é correto dizer que toda azia significa
                  que o estômago produziu ácido demais.
                </p>
              </div>
            </article>
            <article>
              <div className="card-art" aria-hidden="true">
                <small>Uma transformação</small>
                <strong>H⁺ + OH⁻</strong>
                <span className="art-note">→ H₂O · EQUAÇÃO IÔNICA</span>
              </div>
              <div className="card-copy">
                <span className="number">03 / Neutralização</span>
                <h2>O antiácido reage.</h2>
                <p>
                  Antiácidos consomem ácido em uma reação química. O hidróxido
                  de magnésio é uma base; carbonato de cálcio e bicarbonato de
                  sódio são sais que também reagem com ácidos.
                </p>
              </div>
            </article>
          </Carousel>
          <a className="chapter-next" href="#reacoes">
            Próximo capítulo: as reações →
          </a>
        </section>
      )}
      {chapter === "reacoes" && (
        <>
          <ReactionExplorer />
          <section className="equation-lesson">
            <div>
              <p className="eyebrow">A REAÇÃO CENTRAL</p>
              <h2>Ácido + base → sal + água</h2>
              <p>No caso do hidróxido de magnésio:</p>
              <p className="big-equation">Mg(OH)₂ + 2 HCl → MgCl₂ + 2 H₂O</p>
              <p>
                O número <strong>2</strong> na frente do HCl importa: cada 1 mol
                de Mg(OH)₂ reage com 2 mol de HCl. É essa proporção que você vai
                usar no jogo.
              </p>
            </div>
            <aside>
              <span className="number">pH</span>
              <h3>Uma escala de acidez.</h3>
              <p>
                Em soluções diluídas, pH ≈ −log₁₀[H₃O⁺]. Diminuir essa
                concentração dez vezes aumenta o pH em uma unidade.
              </p>
              <p className="small">
                O jogo acompanha quantidades em mmol, não o pH real do estômago.
                1 mmol = 0,001 mol.
              </p>
            </aside>
          </section>
        </>
      )}
      {chapter === "inicio" && (
        <section className="challenge">
          <div>
            <p className="eyebrow">AGORA É COM VOCÊ</p>
            <h2>Entre no laboratório.</h2>
            <p>
              Três missões: preveja a quantidade, adicione a substância e pare
              na meta. Ganhe pontos explicando a reação.
            </p>
            <p className="small light-note">
              As metas são desafios de estequiometria, não metas de tratamento.
            </p>
          </div>
          <div className="game-invite">
            <span className="game-numbers">
              03 <small>missões</small> / 450 <small>pontos</small>
            </span>
            <a className="start-link light" href="#jogo">
              Começar o minigame <span aria-hidden="true">→</span>
            </a>
            <a href="#livre">Ou explorar no modo livre</a>
          </div>
        </section>
      )}
    </>
  );
}
