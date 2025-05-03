import FaqSection from "../_components/landing_page/faqSection";
import HeroPage from "../_components/landing_page/hero";
import PerksSection from "../_components/landing_page/perksSection";
import StartToFinishSection from "../_components/landing_page/startToFinishSection";
import WhereYouBelongCard from "../_components/landing_page/whereYouBelongCard";
import WhyTrustOpenTask from "../_components/landing_page/whyTrustOpenTask";

function page() {
  return (
    <div className="mt-24 flex h-full w-full flex-col">
      <HeroPage />
      <PerksSection />
      <StartToFinishSection />
      <WhereYouBelongCard />
      <WhyTrustOpenTask />
      <FaqSection />
    </div>
  );
}

export default page;
