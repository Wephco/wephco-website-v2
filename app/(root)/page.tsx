import { Hero } from "@/components/Hero";
import { Regions } from "@/components/Regions";
import { NewDevelopmentsSection } from "@/components/NewDevelopments";
import { BecomeAgent } from "@/components/BecomeAgent";
import { Partners } from "@/components/Partners";
import { Press } from "@/components/Press";
import { ContactUs } from "@/components/ContactUs";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Hero />
      <Regions />
      <NewDevelopmentsSection />
      <BecomeAgent />
      <Partners />
      <Press />
      <ContactUs />
      <Footer />
    </div>
  );
}
