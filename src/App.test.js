
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Swiggy application successfully', () => {
  render(<App />);

  expect(screen.getByText('Search')).toBeInTheDocument();
  expect(screen.getByText('Offers')).toBeInTheDocument();
  expect(screen.getByText('Profile')).toBeInTheDocument();
  expect(screen.getByText('Cart')).toBeInTheDocument();
});

