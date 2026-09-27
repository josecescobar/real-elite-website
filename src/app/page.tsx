import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/constants';
import Hero from '@/components/home/Hero';
import CredentialsStrip from '@/components/home/CredentialsStrip';
import SignatureServices from '@/components/home/SignatureServices';
import ProcessPreview from '@/components/home/ProcessPreview';
import PortfolioTeaser from '@/components/home/PortfolioTeaser';
import InvestmentPreview from '@/components/home/InvestmentPreview';
import VeteranTrust from '@/components/home/VeteranTrust';
import Testimonials from '@/components/home/Testimonials';
import LoudounAreas from '@/components/home/LoudounAreas';
import ConsultationCTA from '@/components/home/ConsultationCTA';

export const metadata: Metadata = {
  alternates: {
    canonical: BUSINESS.url,
  },
};

/**
 * Homepage — the luxury design-build front door for Loudoun County.
 *
 * Order is the argument: what we build, how we work, proof, what it costs,
 * who we are, where, then the consultation. The roof quote, paving and
 * handyman lanes keep their pages and their navigation entries; they no longer
 * appear here.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <CredentialsStrip />
      <SignatureServices />
      <ProcessPreview />
      <PortfolioTeaser />
      <InvestmentPreview />
      <VeteranTrust />
      <Testimonials />
      <LoudounAreas />
      <ConsultationCTA />
    </>
  );
}
