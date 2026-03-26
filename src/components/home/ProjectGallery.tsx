import Image from 'next/image';
import Link from 'next/link';
import { GALLERY_IMAGES } from '@/lib/constants';

export const ProjectGallery = () => {
  return (
    <section className="w-full bg-gray-50 py-16 sm:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-navy-900 mb-4">
            Our Recent Projects
          </h2>
          <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
            See the quality and craftsmanship we bring to every project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_IMAGES.map((image, index) => (
            <div
              key={index}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                <p className="text-white font-semibold text-lg">
                  {image.category}
                </p>
                <Link
                  href="/gallery"
                  className="inline-flex px-6 py-2 bg-gold-500 text-navy-900 rounded-lg font-semibold hover:bg-gold-600 transition-colors duration-200"
                >
                  View Project
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;
