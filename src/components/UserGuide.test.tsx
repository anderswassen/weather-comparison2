import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserGuide } from './UserGuide';

describe('UserGuide', () => {
  it('renders the help button', () => {
    render(<UserGuide />);

    expect(screen.getByLabelText('Open user guide')).toBeInTheDocument();
  });

  it('opens modal when help button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserGuide />);

    await user.click(screen.getByLabelText('Open user guide'));

    expect(screen.getByText('User Guide')).toBeInTheDocument();
    expect(screen.getByText('How to use Weather Compare')).toBeInTheDocument();
  });

  it('shows English content by default', async () => {
    const user = userEvent.setup();
    render(<UserGuide />);

    await user.click(screen.getByLabelText('Open user guide'));

    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Searching for Locations')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
  });

  it('switches to Swedish when SV button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserGuide />);

    await user.click(screen.getByLabelText('Open user guide'));
    await user.click(screen.getByText('SV'));

    expect(screen.getByText('Användarguide')).toBeInTheDocument();
    expect(screen.getByText('Komma igång')).toBeInTheDocument();
    expect(screen.getByText('Söka efter platser')).toBeInTheDocument();
    expect(screen.getByText('Favoriter')).toBeInTheDocument();
  });

  it('switches back to English when EN button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserGuide />);

    await user.click(screen.getByLabelText('Open user guide'));
    await user.click(screen.getByText('SV'));
    await user.click(screen.getByText('EN'));

    expect(screen.getByText('User Guide')).toBeInTheDocument();
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserGuide />);

    await user.click(screen.getByLabelText('Open user guide'));
    expect(screen.getByText('User Guide')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Close'));

    expect(screen.queryByText('User Guide')).not.toBeInTheDocument();
  });

  it('closes modal when "Got it!" button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserGuide />);

    await user.click(screen.getByLabelText('Open user guide'));
    await user.click(screen.getByText('Got it!'));

    expect(screen.queryByText('User Guide')).not.toBeInTheDocument();
  });

  it('closes modal when backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<UserGuide />);

    await user.click(screen.getByLabelText('Open user guide'));
    expect(screen.getByText('User Guide')).toBeInTheDocument();

    // Click the backdrop (the blur overlay)
    const backdrop = document.querySelector('.backdrop-blur-sm');
    expect(backdrop).toBeInTheDocument();
    await user.click(backdrop!);

    expect(screen.queryByText('User Guide')).not.toBeInTheDocument();
  });

  it('shows Swedish close button text when in Swedish mode', async () => {
    const user = userEvent.setup();
    render(<UserGuide />);

    await user.click(screen.getByLabelText('Open user guide'));
    await user.click(screen.getByText('SV'));

    expect(screen.getByText('Jag förstår!')).toBeInTheDocument();
  });

  it('displays all 6 sections', async () => {
    const user = userEvent.setup();
    render(<UserGuide />);

    await user.click(screen.getByLabelText('Open user guide'));

    // Check for numbered section badges (1-6)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });
});
