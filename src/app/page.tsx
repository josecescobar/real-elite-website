import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/constants';
import Hero from '@/components/home/Hero';
import TrustBar from '@/components/home/TrustBar';
import ServicesGrid from '@/components/home/ServicesGrid';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ProjectGallery from '@/components/home/ProjectGallery';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import ServiceAreaMap from '@/components/home/ServiceAreaMap';
import LatestBlogPosts from '@/components/home/LatestBlogPosts';

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
      <ServicesGrid />
      <WhyChooseUs />
      <ProjectGallery />
      <Testimonials />
      <LatestBlogPosts />
      <CTASection />
      <ServiceAreaMap />
    </>
  );
}
