import { describe, expect, it } from 'vitest';
import { PA_HIC_REGISTRATION_NUMBER, paHicRegistrationLine } from '@/lib/claims';
import { SALES_PA_HIC } from '@/lib/sales/company';

/**
 * TODO(HIC): when Jose supplies the Pennsylvania registration number, set
 * PA_HIC_REGISTRATION_NUMBER and update this test in the same change.
 * A number that appears only in a page, a contract, or an ad fails the
 * "one source" expectation below.
 */
describe('Pennsylvania HIC registration placeholder', () => {
  it('does not publish a number until the owner supplies one', () => {
    expect(PA_HIC_REGISTRATION_NUMBER).toBeNull();
    expect(paHicRegistrationLine()).toBe(
      'Pennsylvania home-improvement registration is on file. The registration number is not printed until the owner supplies it.',
    );
    expect(paHicRegistrationLine()).not.toMatch(/\d/);
  });

  it('uses that same placeholder for contracts and ads', () => {
    expect(SALES_PA_HIC.number).toBe(PA_HIC_REGISTRATION_NUMBER);
    expect(SALES_PA_HIC.line).toBe(paHicRegistrationLine());
  });
});
