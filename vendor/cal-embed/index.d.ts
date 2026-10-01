export type CalUiConfig = {
  hideEventTypeDetails?: boolean;
  layout?: 'month_view' | 'week_view' | 'column_view';
  styles?: {
    branding?: {
      brandColor?: string;
    };
  };
};

export type CalModalConfig = {
  calLink: string;
  calOrigin?: string;
  config?: Record<string, string>;
};

export interface CalNamespaceApi {
  (method: 'ui', config: CalUiConfig): void;
  (method: 'modal', config: CalModalConfig): void;
}

export function getCalApi(options?: {
  embedJsUrl?: string;
  namespace?: string;
}): Promise<CalNamespaceApi>;
