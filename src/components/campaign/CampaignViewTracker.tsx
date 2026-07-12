'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function CampaignViewTracker() {
  useEffect(() => {
    trackEvent('premium_campaign_view', { campaign: 'premium_market_90_day' });
  }, []);

  return null;
}

