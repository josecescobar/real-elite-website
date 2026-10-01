import { describe, expect, it } from 'vitest';
import { parseBookingUrl } from './booking';

const PILOT = 'http://127.0.0.1:3340/real-elite/free-estimate-visit';

describe('parseBookingUrl', () => {
  it('returns null when the flag is missing or blank', () => {
    expect(parseBookingUrl(undefined)).toBeNull();
    expect(parseBookingUrl(null)).toBeNull();
    expect(parseBookingUrl('')).toBeNull();
    expect(parseBookingUrl('   ')).toBeNull();
  });

  it('splits the Cal.diy event URL into origin, link, and embed script', () => {
    expect(parseBookingUrl(PILOT)).toEqual({
      origin: 'http://127.0.0.1:3340',
      calLink: 'real-elite/free-estimate-visit',
      embedJsUrl: 'http://127.0.0.1:3340/embed/embed.js',
    });
  });

  it('accepts https and ignores a trailing slash or query', () => {
    expect(
      parseBookingUrl('https://booking.example.com/real-elite/free-estimate-visit/?overlayCalendar=true'),
    ).toEqual({
      origin: 'https://booking.example.com',
      calLink: 'real-elite/free-estimate-visit',
      embedJsUrl: 'https://booking.example.com/embed/embed.js',
    });
  });

  it('rejects values that are not an event link', () => {
    expect(parseBookingUrl('not a url')).toBeNull();
    expect(parseBookingUrl('/real-elite/free-estimate-visit')).toBeNull();
    expect(parseBookingUrl('javascript:alert(1)')).toBeNull();
    expect(parseBookingUrl('http://127.0.0.1:3340')).toBeNull();
    expect(parseBookingUrl('http://127.0.0.1:3340/real-elite')).toBeNull();
  });
});
