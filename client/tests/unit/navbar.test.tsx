import { fireEvent, render } from '@testing-library/react';

jest.mock('@/shared/lib/client', () => ({
  useUser: () => ({ user: null, loading: false }),
}));

import { Navbar } from '@/shared/ui/client';

describe('Navbar mobile scroll lock', () => {
  afterEach(() => {
    document.body.style.overflow = '';
  });

  it.each(['close', 'unmount'])(
    'restores the previous scroll setting on %s',
    (action) => {
      document.body.style.overflow = 'auto';
      const { container, unmount } = render(<Navbar />);
      const buttons = container.querySelectorAll('button');
      const toggle = buttons[buttons.length - 1];
      fireEvent.click(toggle);
      expect(document.body.style.overflow).toBe('hidden');

      if (action === 'unmount') unmount();
      else fireEvent.click(toggle);

      expect(document.body.style.overflow).toBe('auto');
      unmount();
    },
  );
});

describe('Navbar EigenAI promotion', () => {
  it('closes the mobile menu when navigating to EigenAI', () => {
    const { container } = render(<Navbar />);
    fireEvent.click(container.querySelector('.hamburger')!);
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(container.querySelector('.mobile-navbar a[href="/eigenai"]')!);
    expect(document.body.style.overflow).not.toBe('hidden');
    expect(container.querySelector('.mobile-navbar a[href="/eigenai"]')).toBeNull();
  });
});

describe('Navbar programs dropdown', () => {
  it('keeps program links inside their collapsed menu', () => {
    const { container } = render(<Navbar />);

    expect(container.querySelectorAll('button[aria-haspopup="true"]')).toHaveLength(1);
    expect(container.querySelector('a[href="/startups"]')).not.toBeInTheDocument();
    expect(container.querySelector('a[href="/ml-fundamentals"]')).not.toBeInTheDocument();
  });

  it('opens the desktop menu and exposes its destinations', () => {
    const { container } = render(<Navbar />);
    const desktopTrigger = container.querySelector('button[aria-haspopup="true"]')!;

    expect(desktopTrigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(desktopTrigger);
    expect(desktopTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(container.querySelector('[role="menu"] a[href="/startups"]')).toBeInTheDocument();
    expect(
      container.querySelector('[role="menu"] a[href="/ml-fundamentals"]'),
    ).toBeInTheDocument();
  });

  it('closes the desktop menu when a destination is selected', () => {
    const { container } = render(<Navbar />);
    const desktopTrigger = container.querySelector('button[aria-haspopup="true"]')!;
    fireEvent.click(desktopTrigger);
    fireEvent.click(container.querySelector('a[href="/startups"]')!);

    expect(container.querySelector('[role="menu"]')).not.toBeInTheDocument();
    expect(desktopTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands the mobile programs menu', () => {
    const { container } = render(<Navbar />);
    const initialButtons = container.querySelectorAll('button');
    fireEvent.click(initialButtons[initialButtons.length - 1]);

    const programsTriggers = container.querySelectorAll('button[aria-haspopup="true"]');
    const mobileTrigger = programsTriggers[programsTriggers.length - 1];
    expect(mobileTrigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(mobileTrigger);
    expect(mobileTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(container.querySelector('a[href="/startups"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/ml-fundamentals"]')).toBeInTheDocument();
  });
});
