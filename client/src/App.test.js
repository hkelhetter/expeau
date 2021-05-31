import { render, screen } from '@testing-library/react';
import App from './App';
import { WebSocket, Server } from 'mock-socket';

test('App renders something', () => {
    render(<App />);
    const linkElement = screen.getByText(/Menu/i);
    expect(linkElement).toBeInTheDocument();
});

test('Create conversation', () => {
    render(<App />);
})
test('test state', () => {
    this.state = { test: "test" }
    expect(this.state).toBe({ test: "test" })
})