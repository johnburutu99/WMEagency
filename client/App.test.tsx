import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the main login page without crashing', () => {
    render(<App />);
    // Check for a known page title from the Index page
    // Use queryAllByText because the text appears twice (for mobile and desktop layouts)
    expect(
      screen.queryAllByText(/Welcome to the/i).length
    ).toBeGreaterThan(0);
  });
});
