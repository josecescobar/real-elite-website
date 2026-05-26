import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/constants';
import Hero from '@/components/home/Hero';
import TrustBar from '@/components/home/TrustBar';
import InstantQuoteBand from '@/components/home/InstantQuoteBand';
import FeaturedServices from '@/components/home/FeaturedServices';
import PartnershipBand from '@/components/home/PartnershipBand';
import PrecisionProcess from '@/components/home/PrecisionProcess';
import ProjectSpotlight from '@/components/home/ProjectSpotlight';
import BeforeAfter from '@/components/home/BeforeAfter';
import FeaturedGuides from '@/components/home/FeaturedGuides';
import Testimonials from '@/components/home/Testimonials';
import ServiceAreaMap from '@/components/home/ServiceAreaMap';
import AssurancesBand from '@/components/home/AssurancesBand';
import HomeEstimate from '@/components/home/HomeEstimate';
import HomeFAQ from '@/components/home/HomeFAQ';
import CTASection from '@/components/home/CTASection';

export const metadata: Metadata = {
  alternates: {
    canonical: BUSINESS.url,
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <InstantQuoteBand />
      <FeaturedServices />
      <PartnershipBand />
      <PrecisionProcess />
      <ProjectSpotlight />
      <BeforeAfter />
      <FeaturedGuides />
      <Testimonials />
      <ServiceAreaMap />
      <AssurancesBand />
      <HomeEstimate />
      <HomeFAQ />
      <CTASection />
    </>
  );
}
