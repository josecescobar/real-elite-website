import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { BUSINESS } from '@/lib/constants';
import Hero from '@/components/home/Hero';
import TrustBar from '@/components/home/TrustBar';
import FeaturedServices from '@/components/home/FeaturedServices';
import PrecisionProcess from '@/components/home/PrecisionProcess';
import ProjectSpotlight from '@/components/home/ProjectSpotlight';
import FeaturedGuides from '@/components/home/FeaturedGuides';
import Testimonials from '@/components/home/Testimonials';
import LuxuryBand from '@/components/home/LuxuryBand';
import ServiceAreaMap from '@/components/home/ServiceAreaMap';
import AssurancesBand from '@/components/home/AssurancesBand';
import HomeEstimate from '@/components/home/HomeEstimate';
import HomeFAQ from '@/components/home/HomeFAQ';
import CTASection from '@/components/home/CTASection';

const BeforeAfter = dynamic(() => import('@/components/home/BeforeAfter'));

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
      <FeaturedServices />
      <PrecisionProcess />
      <ProjectSpotlight />
      <BeforeAfter />
      <FeaturedGuides />
      <Testimonials />
      <LuxuryBand />
      <ServiceAreaMap />
      <AssurancesBand />
      <HomeEstimate />
      <HomeFAQ />
      <CTASection />
    </>
  );
}
