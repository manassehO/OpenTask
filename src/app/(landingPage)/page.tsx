'use client';
import FaqSection from '~/_components/landing_page/faqSection';
import HeroPage from '~/_components/landing_page/hero';
import PerksSection from '~/_components/landing_page/perksSection';
import StartToFinishSection from '~/_components/landing_page/startToFinishSection';
import WhereYouBelongCard from '~/_components/landing_page/whereYouBelongCard';
import WhyTrustOpenTask from '~/_components/landing_page/whyTrustOpenTask';
import Footer from '~/_components/layout/Footer';
import { Navbar } from '~/_components/layout/navbar';

function page() {
  return (
    <div>
      <Navbar />
      <div className="mt-24 flex h-full w-full flex-col">
        <HeroPage />
        <PerksSection />
        <StartToFinishSection />
        <WhereYouBelongCard />
        <WhyTrustOpenTask />
        <FaqSection />
      </div>
      <Footer />
    </div>
  );
}

export default page;
