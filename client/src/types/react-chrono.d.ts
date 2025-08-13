/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'react-chrono' {
  import * as React from 'react';

  export interface ChronoProps {
    items: Array<{
      title: string;
      cardTitle?: string;
      cardSubtitle?: string;
      cardDetailedText?: string | string[];
      media?: {
        type: 'IMAGE' | 'VIDEO';
        source: { url: string };
      };
    }>;
    mode?: 'HORIZONTAL' | 'VERTICAL' | 'VERTICAL_ALTERNATING';
    [key: string]: any; // allow extra props
  }

  export const Chrono: React.FC<ChronoProps>;
}
