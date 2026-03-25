import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/constants';
import EstimateForm from '@/components/shared/EstimateForm';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: `Contact Us | ${BUSINESS.name}`,
  description:
    'Get in touch with Real Elite Contracting. Call, email, or request a free estimate. We are ready to help with your project.',
  keywords: [
    'contact us',
    'contractor contact',
    'request estimate',
    'phone',
    'email',
    'Eastern Panhandle',
  ],
  openGraph: {
    title: `Contact Us | ${BUSINESS.name}`,
    description: 'Get in touch with Real Elite Contracting for your home improvement project.',
    url: `${BUSINESS.url}/contact`,
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Contact Us</h1>
          <p className="text-lg text-white max-w-2xl">
            Get in touch with our team. We're ready to discuss your project.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-navy-900 mb-8">Get in Touch</h2>

              <div className="space-y-8">
                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#c0392b]/10">
                      <Phone className="h-6 w-6 text-[#c0392b]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900">Phone</h3>
                    <a
                      href={`tel:${BUSINESS.phoneRaw}`}
                      className="text-lg text-gold-600 hover:text-gold-700 font-semibold"
                    >
                      {BUSINESS.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#c0392b]/10">
                      <Mail className="h-6 w-6 text-[#c0392b]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900">Email</h3>
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="text-lg text-gold-600 hover:text-gold-700 font-semibold break-all"
                    >
                      {BUSINESS.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#c0392b]/10">
                      <MapPin className="h-6 w-6 text-[#c0392b]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900">Location</h3>
                    <p className="text-gray-700">
                      {BUSINESS.address.street}
                      <br />
                      {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Serving: {BUSINESS.address.region}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#c0392b]/10">
                      <Clock className="h-6 w-6 text-[#c0392b]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900">Hours</h3>
                    <p className="text-gray-700">{BUSINESS.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimate Form */}
            <div>
              <EstimateForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-16 md:py-24 bg-navy-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-8 text-center">
            Find Us on the Map
          </h2>

          <div className="rounded-lg h-96 overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d98304.34812693078!2d-77.93!3d39.46!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b9a1e3b4c72f93%3A0x7c4e54e76f7d6b4e!2sMartinsburg%2C%20WV!5e0!3m2!1sen!2sus!4v1711000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Real Elite Contracting - Martinsburg, WV Service Area"
            />
          </div>
        </div>
      </section>

      {/* Response Time Info */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-gold-50 border border-gold-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-navy-900 mb-4">Quick Response Guaranteed</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We understand that your time is valuable. When you submit an estimate request or
              contact form, our team typically responds within 24 business hours. For urgent
              matters, please call us directly at{' '}
              <a href={`tel:${BUSINESS.phoneRaw}`} className="text-gold-600 font-semibold">
                {BUSINESS.phone}
              </a>
              .
            </p>
            <p className="text-gray-700">
              We're committed to providing prompt, professional communication from your first
              inquiry all the way through project completion.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
