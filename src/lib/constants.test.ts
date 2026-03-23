import { describe, it, expect } from 'vitest';
import {
  BUSINESS,
  SERVICES,
  PRIMARY_SERVICE_AREAS,
  SECONDARY_SERVICE_AREAS,
  EXPANSION_SERVICE_AREAS,
  ALL_SERVICE_AREAS,
  SERVICE_AREAS,
  TESTIMONIALS,
  NAV_LINKS,
  GALLERY_IMAGES,
} from './constants';

describe('BUSINESS', () => {
  it('has required contact fields', () => {
    expect(BUSINESS.name).toBe('Real Elite Contracting');
    expect(BUSINESS.phone).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
    expect(BUSINESS.phoneRaw).toMatch(/^\+\d+$/);
    expect(BUSINESS.email).toContain('@');
  });

  it('has a valid URL', () => {
    expect(BUSINESS.url).toMatch(/^https:\/\//);
  });

  it('has address fields', () => {
    expect(BUSINESS.address.city).toBeTruthy();
    expect(BUSINESS.address.state).toBe('WV');
    expect(BUSINESS.address.zip).toMatch(/^\d{5}$/);
  });

  it('has social media links', () => {
    expect(BUSINESS.social.facebook).toMatch(/^https:\/\//);
    expect(BUSINESS.social.instagram).toMatch(/^https:\/\//);
  });
});

describe('SERVICES', () => {
  it('has at least one service', () => {
    expect(SERVICES.length).toBeGreaterThan(0);
  });

  it('each service has required fields', () => {
    SERVICES.forEach((service) => {
      expect(service.title).toBeTruthy();
      expect(service.slug).toMatch(/^[a-z0-9-]+$/);
      expect(service.description.length).toBeGreaterThan(10);
      expect(service.icon).toBeTruthy();
    });
  });

  it('has unique slugs', () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has unique titles', () => {
    const titles = SERVICES.map((s) => s.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe('Service Areas', () => {
  it('each area has city, state, and slug', () => {
    [...PRIMARY_SERVICE_AREAS, ...SECONDARY_SERVICE_AREAS, ...EXPANSION_SERVICE_AREAS].forEach((area) => {
      expect(area.city).toBeTruthy();
      expect(area.state).toMatch(/^[A-Z]{2}$/);
      expect(area.slug).toMatch(/^[a-z-]+-[a-z]{2}$/);
    });
  });

  it('ALL_SERVICE_AREAS combines all tiers', () => {
    expect(ALL_SERVICE_AREAS.length).toBe(
      PRIMARY_SERVICE_AREAS.length + SECONDARY_SERVICE_AREAS.length + EXPANSION_SERVICE_AREAS.length
    );
  });

  it('SERVICE_AREAS contains primary and secondary city names', () => {
    expect(SERVICE_AREAS.length).toBe(PRIMARY_SERVICE_AREAS.length + SECONDARY_SERVICE_AREAS.length);
    PRIMARY_SERVICE_AREAS.forEach((area) => {
      expect(SERVICE_AREAS).toContain(area.city);
    });
    SECONDARY_SERVICE_AREAS.forEach((area) => {
      expect(SERVICE_AREAS).toContain(area.city);
    });
  });

  it('has unique slugs across all areas', () => {
    const slugs = ALL_SERVICE_AREAS.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('TESTIMONIALS', () => {
  it('has at least one testimonial', () => {
    expect(TESTIMONIALS.length).toBeGreaterThan(0);
  });

  it('each testimonial has required fields', () => {
    TESTIMONIALS.forEach((t) => {
      expect(t.name).toBeTruthy();
      expect(t.location).toBeTruthy();
      expect(t.rating).toBeGreaterThanOrEqual(1);
      expect(t.rating).toBeLessThanOrEqual(5);
      expect(t.text.length).toBeGreaterThan(20);
    });
  });
});

describe('NAV_LINKS', () => {
  it('has Home as first link pointing to /', () => {
    expect(NAV_LINKS[0].label).toBe('Home');
    expect(NAV_LINKS[0].href).toBe('/');
  });

  it('each link has label and href', () => {
    NAV_LINKS.forEach((link) => {
      expect(link.label).toBeTruthy();
      expect(link.href).toMatch(/^\//);
    });
  });

  it('Services link has children matching SERVICES', () => {
    const servicesLink = NAV_LINKS.find((l) => l.label === 'Services');
    expect(servicesLink).toBeDefined();
    expect(servicesLink!.children).toBeDefined();
    expect(servicesLink!.children!.length).toBe(SERVICES.length);
    servicesLink!.children!.forEach((child, i) => {
      expect(child.label).toBe(SERVICES[i].title);
      expect(child.href).toBe(`/services/${SERVICES[i].slug}`);
    });
  });
});

describe('GALLERY_IMAGES', () => {
  it('has at least one image', () => {
    expect(GALLERY_IMAGES.length).toBeGreaterThan(0);
  });

  it('each image has src, alt, and category', () => {
    GALLERY_IMAGES.forEach((img) => {
      expect(img.src).toMatch(/^\/images\/.+\.(jpg|png|webp)$/);
      expect(img.alt.length).toBeGreaterThan(5);
      expect(img.category).toBeTruthy();
    });
  });

  it('has unique image sources', () => {
    const srcs = GALLERY_IMAGES.map((img) => img.src);
    expect(new Set(srcs).size).toBe(srcs.length);
  });
});
