import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const titleElement = screen.getByText(/EOS Blocks List/i);
  const buttonElement = screen.getByText(/Load/i);
  expect(titleElement).toBeInTheDocument();
  expect(buttonElement).toBeInTheDocument();
});
