import { render, screen } from '@testing-library/react';

// The selector is a server component. Mock the server barrel so no Supabase /
// Vercel Flags code loads, and stub the existing page (heavy: styles, images,
// and a Google Maps env check). The redesign stub is light, so it renders for
// real — that also covers its scoped `.eigenai-redesign` wrapper.
const mockEvaluateFlag = jest.fn();
const mockGetCurrentUser = jest.fn();

jest.mock('@/shared/lib/server', () => ({
  evaluateFlag: (...args: unknown[]) => mockEvaluateFlag(...args),
  getCurrentUser: () => mockGetCurrentUser(),
}));

jest.mock('@/features/public-site/pages/eigenai', () => ({
  __esModule: true,
  default: () => <div data-testid="eigenai-existing">existing</div>,
}));

import EigenAIFlagged from '@/features/public-site/pages/eigenaiFlagged';
// `dynamic` is declared on the route segment itself (that's the only place
// Next.js reads it), so assert it there rather than on the selector module.
import { dynamic } from '@/app/(frontend)/eigenai/page';

describe('EigenAI flag selector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue(null);
  });

  it('renders /eigenai dynamically so the flag is read per request', () => {
    expect(dynamic).toBe('force-dynamic');
  });

  it('selects the existing page when the flag is off', async () => {
    mockEvaluateFlag.mockResolvedValue(false);

    render(await EigenAIFlagged());

    expect(screen.getByTestId('eigenai-existing')).toBeInTheDocument();
    expect(screen.queryByTestId('eigenai-redesign')).not.toBeInTheDocument();
    expect(mockEvaluateFlag).toHaveBeenCalledWith(
      'Eigen-AI-Redesign',
      { cohort: 'public' },
    );
  });

  it('selects the redesign when the flag is on', async () => {
    mockEvaluateFlag.mockResolvedValue(true);

    render(await EigenAIFlagged());

    const redesign = screen.getByTestId('eigenai-redesign');
    expect(redesign).toBeInTheDocument();
    expect(redesign).toHaveClass('eigenai-redesign');
    expect(screen.queryByTestId('eigenai-existing')).not.toBeInTheDocument();
  });

  it('keeps the existing page on default-off (missing config / error)', async () => {
    // evaluateFlag collapses missing config and evaluation failures to false
    // upstream, so the selector only ever sees a boolean.
    mockEvaluateFlag.mockResolvedValue(false);

    render(await EigenAIFlagged());

    expect(screen.getByTestId('eigenai-existing')).toBeInTheDocument();
  });
});
