import { describe, expect, it } from 'vitest';
import { isAnalyticsExcludedPath } from './analytics-exclusions';

describe('isAnalyticsExcludedPath', () => {
  it.each(['/sales', '/sales/', '/sales/anything', '/review-request', '/review-request/', '/sales?bucket=hot'])(
    'excludes %s',
    (path) => expect(isAnalyticsExcludedPath(path)).toBe(true)
  );

  it.each(['/', '/services', '/salesforce', '/sales-tax-guide', '/reviews', '/review-requests', null, undefined, ''])(
    'keeps analytics on %s',
    (path) => expect(isAnalyticsExcludedPath(path)).toBe(false)
  );
});
