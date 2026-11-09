import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import IntroductionPage from "../pages/IntroductionPage";
import LaboratoryPage from "../features/laboratory/pages/LaboratoryPage";
import { useHashNavigation } from "./useHashNavigation";

export default function App() {
  const { page, mainRef } = useHashNavigation();
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header page={page} />
      <main id="conteudo" tabIndex={-1} ref={mainRef}>
        {page === "jogo" || page === "livre" ? (
          <LaboratoryPage key={page} free={page === "livre"} />
        ) : (
          <IntroductionPage key={page} chapter={page} />
        )}
      </main>
      <Footer />
    </>
  );
}
