import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import Footer from '../shared/Footer.svelte';

// Mock the image imports
vi.mock('$lib/assets/capra-white-vertical.webp', () => ({ default: 'capra-white-mock-path' }));
vi.mock('$lib/assets/capra-black-vertical.webp', () => ({ default: 'capra-black-mock-path' }));
vi.mock('$lib/assets/fryde-white-vertical.webp', () => ({ default: 'fryde-white-mock-path' }));
vi.mock('$lib/assets/fryde-black-vertical.webp', () => ({ default: 'fryde-black-mock-path' }));
vi.mock('$lib/assets/liflig-white-vertical.webp', () => ({ default: 'liflig-white-mock-path' }));
vi.mock('$lib/assets/liflig-black-vertical.webp', () => ({ default: 'liflig-black-mock-path' }));
vi.mock('$lib/assets/miljofyrtarn-dark.webp', () => ({ default: 'miljofyrtarn-dark-mock-path' }));
vi.mock('$lib/assets/miljofyrtarn-light.webp', () => ({ default: 'miljofyrtarn-light-mock-path' }));
vi.mock('$lib/assets/dnv-dark.webp', () => ({ default: 'dnv-dark-mock-path' }));
vi.mock('$lib/assets/dnv-light.webp', () => ({ default: 'dnv-light-mock-path' }));

describe('Footer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the footer with correct text', () => {
    const { getByText } = render(Footer);

    expect(getByText('Vi er en del av Capra-gruppen')).toBeTruthy();
    expect(getByText('Sertifiseringer')).toBeTruthy();
    expect(getByText('Personvernerklæring')).toBeTruthy();

    // Check for the current year in the copyright text
    const currentYear = new Date().getFullYear();
    expect(getByText(`${currentYear} © Capra | Torggata 2-4, 0180 Oslo |`)).toBeTruthy();
  });

  it('renders all company logos', () => {
    const { getAllByAltText } = render(Footer);

    const capraLogos = getAllByAltText('Capra-logo');
    const lifligLogos = getAllByAltText('Liflig-logo');
    const frydeLogos = getAllByAltText('Fryde-logo');

    // Should have both light and dark mode logos
    expect(capraLogos.length).toBe(2);
    expect(lifligLogos.length).toBe(2);
    expect(frydeLogos.length).toBe(2);
  });

  it('renders certification logos', () => {
    const { getAllByAltText } = render(Footer);

    const miljofyrtarnLogos = getAllByAltText('Miljøfyrtårn-sertifisering');
    const dnvLogos = getAllByAltText('DNV-sertifisering');

    // Should have both light and dark mode logos
    expect(miljofyrtarnLogos.length).toBe(2);
    expect(dnvLogos.length).toBe(2);
  });

  it('has correct links to company websites', () => {
    const { container } = render(Footer);

    const links = container.querySelectorAll('a');

    // Find the company links
    const capraLink = Array.from(links).find(link => link.href.includes('capraconsulting.no'));
    const lifligLink = Array.from(links).find(link => link.href.includes('liflig.no'));
    const frydeLink = Array.from(links).find(link => link.href.includes('fryde.no'));

    expect(capraLink).toBeTruthy();
    expect(lifligLink).toBeTruthy();
    expect(frydeLink).toBeTruthy();
  });

  it('has a link to the privacy policy', () => {
    const { container } = render(Footer);

    const links = container.querySelectorAll('a');
    const privacyLink = Array.from(links).find(link => link.href.includes('/personvern'));

    expect(privacyLink).toBeTruthy();
    expect(privacyLink?.textContent).toBe('Personvernerklæring');
  });

  it('has a mailto link', () => {
    const { container } = render(Footer);

    const links = container.querySelectorAll('a');
    const mailtoLink = Array.from(links).find(link => link.href.includes('mailto:'));

    expect(mailtoLink).toBeTruthy();
    expect(mailtoLink?.href).toBe('mailto:post@capraconsulting.no');
    expect(mailtoLink?.textContent).toBe('post@capraconsulting.no');
  });
});
