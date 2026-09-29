import { describe, expect, it } from 'vitest';
import { PA_HIC_REGISTRATION_NUMBER, paHicRegistrationLine } from '@/lib/claims';
import { SALES_PA_HIC } from '@/lib/sales/company';

/** Exact public sentence from `paHicRegistrationLine()` in `src/lib/claims.ts`. */
const CONFIRMED_PA_HIC_LINE =
  'PA HIC #PA225060. Existing-house home improvement only. Expires 2028-09-02.';

describe('Pennsylvania HIC registration', () => {
  it('publishes the confirmed registration number', () => {
    expect(PA_HIC_REGISTRATION_NUMBER).toBe('PA225060');
    expect(paHicRegistrationLine()).toBe(CONFIRMED_PA_HIC_LINE);
    expect(paHicRegistrationLine()).toContain('PA HIC #PA225060');
    expect(paHicRegistrationLine()).toContain('Existing-house home improvement only');
    expect(paHicRegistrationLine()).not.toMatch(/commercial/i);
  });

  it('uses that same registration for contracts and ads', () => {
    expect(SALES_PA_HIC.number).toBe(PA_HIC_REGISTRATION_NUMBER);
    expect(SALES_PA_HIC.line).toBe(paHicRegistrationLine());
  });
});
