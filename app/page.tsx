import HeroSection from "@/components/ui/HeroSection";
import TrustedBy from "@/components/ui/TrustedBy";
import HowItWorks from "@/components/ui/HowItWorks";
import OutcomesStrip from "@/components/ui/OutcomesStrip";
import WebinarBanner from "@/components/ui/WebinarBanner";
import { graduateOutcomes } from "@/data/outcomes";

export default function HomePage() {
  return (
    <>
      <WebinarBanner />
      <HeroSection />
      <TrustedBy />
      <HowItWorks />
      <OutcomesStrip outcomes={graduateOutcomes} />
    </>
  );
}
