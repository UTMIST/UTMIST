import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';

import { EigenAIWordmark } from '@/features/public-site/components/eigenai-wordmark';

// Figma inner shadow: 6.2224px offset and blur at a 172.84px font size.
const shadowEm = 6.2224 / 172.84;
// Text span box: 1.5 line height + 0.06em top and 0.18em bottom padding.
const boxHeightEm = 1.74;

describe('EigenAIWordmark', () => {
  it('renders the wordmark text once for assistive technology', () => {
    render(<EigenAIWordmark />);

    expect(screen.getByTestId('eigenai-wordmark')).toHaveTextContent(/^eigenai$/);
  });

  it('applies the Figma white inner shadow in font-relative box units', () => {
    const { container } = render(<EigenAIWordmark />);
    const filter = screen.getByTestId('eigenai-wordmark-glass');
    const [blurX, blurY] = filter
      .querySelector('feGaussianBlur')!
      .getAttribute('stdDeviation')!
      .split(' ')
      .map(Number);

    expect(filter).toHaveAttribute('primitiveUnits', 'objectBoundingBox');
    expect(Number(filter.querySelector('feOffset')!.getAttribute('dy'))).toBeCloseTo(
      shadowEm / boxHeightEm,
    );
    expect(blurY).toBeCloseTo(shadowEm / 2 / boxHeightEm);
    expect(blurX).toBeGreaterThan(0);
    expect(filter.querySelector('feFlood')).toHaveAttribute('flood-color', '#fff');
    expect(container.querySelector<HTMLElement>('span > span')?.style.filter).toBe(
      `url(#${filter.id})`,
    );
  });

  it('ships the shimmer in server-rendered HTML without waiting for hydration', () => {
    const html = renderToString(<EigenAIWordmark />);
    const id = html.match(/<filter id="([^"]+)"/)?.[1];

    expect(id).toBeTruthy();
    expect(html).toContain(`filter:url(#${id})`);
  });

  it('gives each wordmark its own filter id', () => {
    render(
      <>
        <EigenAIWordmark />
        <EigenAIWordmark />
      </>,
    );

    const [first, second] = screen.getAllByTestId('eigenai-wordmark-glass');
    expect(first.id).not.toBe(second.id);
  });
});
