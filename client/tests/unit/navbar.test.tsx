import { render, screen, fireEvent, within } from '@testing-library/react';

jest.mock('@/shared/lib/hooks/useUser', () => ({
  useUser: () => ({ user: null, loading: false }),
}));

jest.mock('@/components/theme-toggle', () => ({
  __esModule: true,
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

import Navbar from '@/components/navbar';

describe('Navbar — Programs dropdown', () => {
  it('renders a single Programs trigger instead of separate MISTic R&D and MLF items', () => {
    render(<Navbar />);
    const programsTriggers = screen.getAllByRole('button', { name: /programs/i });
    expect(programsTriggers.length).toBeGreaterThan(0);

    // Before opening, the program links should not be visible
    expect(screen.queryByRole('menuitem', { name: /MISTic R&D/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /^MLF$/i })).not.toBeInTheDocument();
  });

  it('opens the desktop Programs dropdown on click and shows MISTic R&D and MLF links', () => {
    render(<Navbar />);
    const desktopTrigger = screen.getAllByRole('button', { name: /programs/i })[0];

    expect(desktopTrigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(desktopTrigger);
    expect(desktopTrigger).toHaveAttribute('aria-expanded', 'true');

    const menu = screen.getByRole('menu');
    const mistic = within(menu).getByRole('menuitem', { name: /MISTic R&D/i });
    const mlf = within(menu).getByRole('menuitem', { name: /^MLF$/i });

    expect(mistic).toHaveAttribute('href', '/startups');
    expect(mlf).toHaveAttribute('href', '/ml-fundamentals');
  });

  it('closes the desktop Programs dropdown when a link is clicked', () => {
    render(<Navbar />);
    const desktopTrigger = screen.getAllByRole('button', { name: /programs/i })[0];
    fireEvent.click(desktopTrigger);

    const mistic = within(screen.getByRole('menu')).getByRole('menuitem', {
      name: /MISTic R&D/i,
    });
    fireEvent.click(mistic);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(desktopTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands the mobile Programs section to reveal MISTic R&D and MLF', () => {
    render(<Navbar />);
    // Open the mobile menu via the hamburger
    fireEvent.click(screen.getByRole('button', { name: /☰/ }));

    // The mobile menu also has a Programs trigger; pick the last one (mobile dropdown is rendered after desktop)
    const programsTriggers = screen.getAllByRole('button', { name: /programs/i });
    const mobileTrigger = programsTriggers[programsTriggers.length - 1];

    expect(mobileTrigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(mobileTrigger);
    expect(mobileTrigger).toHaveAttribute('aria-expanded', 'true');

    const misticLinks = screen.getAllByRole('link', { name: /MISTic R&D/i });
    const mlfLinks = screen.getAllByRole('link', { name: /^MLF$/i });
    expect(misticLinks.some((el) => el.getAttribute('href') === '/startups')).toBe(true);
    expect(mlfLinks.some((el) => el.getAttribute('href') === '/ml-fundamentals')).toBe(true);
  });

  it('does not render top-level MISTic R&D or MLF nav items outside of the Programs dropdown', () => {
    render(<Navbar />);
    // No links should exist for these targets while the dropdown is closed
    const misticLinks = screen.queryAllByRole('link', { name: /MISTic R&D/i });
    const mlfLinks = screen.queryAllByRole('link', { name: /^MLF$/i });
    expect(misticLinks).toHaveLength(0);
    expect(mlfLinks).toHaveLength(0);
  });
});
