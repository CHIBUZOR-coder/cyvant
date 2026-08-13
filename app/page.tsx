import HeroSection from "@/components/ui/HeroSection";
import HowItWorks from "@/components/ui/HowItWorks";
import OutcomesStrip from "@/components/ui/OutcomesStrip";
import WebinarBanner from "@/components/ui/WebinarBanner";
import { graduateOutcomes } from "@/data/outcomes";

export default function HomePage() {
  return (
    <>
      <WebinarBanner />
      <HeroSection />
      <HowItWorks />
      <OutcomesStrip outcomes={graduateOutcomes} />
    </>
  );
}
