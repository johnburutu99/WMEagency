import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Check for a known page title or nav item
    expect(
      screen.getByText(/Dashboard|Bookings|Documents|Payments|Messages|Coordinators/i)
    ).toBeInTheDocument();
  });
});
