import {
  Header,
  Hero,
  ClientsMarquee,
  Portfolio,
  HowItWorks,
  Pricing,
  FAQ,
  FinalCTA,
  Footer,
} from './components';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ClientsMarquee />
        <Portfolio />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

export default App;
