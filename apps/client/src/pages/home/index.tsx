import Hero from "./Hero";
import Features from "./features";
import HowItWorks from "./how-it-works";
import FAQ from "./faq";
import CTA from "./cta";
import Footer from "./footer";
import ScrollDemo from "./scroll";
const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ScrollDemo />
      <Features />
      <HowItWorks />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
