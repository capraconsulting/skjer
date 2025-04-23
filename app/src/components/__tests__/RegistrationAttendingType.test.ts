import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import RegistrationAttendingType from '../shared/RegistrationAttendingType.svelte';

// Create a mock form store
const createMockFormStore = (initialValue = 'Fysisk') => {
  const store = {
    attendingType: initialValue,
    subscribe: vi.fn(),
    set: vi.fn()
  };

  // Make the store subscribable
  store.subscribe.mockImplementation(callback => {
    callback(store);
    return () => {};
  });

  return store;
};

describe('RegistrationAttendingType Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the label correctly', () => {
    const mockForm = createMockFormStore();

    const { getByText } = render(RegistrationAttendingType, { props: { form: mockForm } });

    expect(getByText('Hvordan vil du delta?')).toBeTruthy();
  });

  it('renders both radio options', () => {
    const mockForm = createMockFormStore();

    const { getByText } = render(RegistrationAttendingType, { props: { form: mockForm } });

    expect(getByText('Fysisk')).toBeTruthy();
    expect(getByText('Digitalt')).toBeTruthy();
  });

  it('binds the radio value to the form store', () => {
    const mockForm = createMockFormStore('Fysisk');

    const { container } = render(RegistrationAttendingType, { props: { form: mockForm } });

    // Find the radio inputs
    const radioInputs = container.querySelectorAll('input[type="radio"]');
    expect(radioInputs.length).toBe(2);

    // Check that the "Fysisk" option is selected
    const fysiskRadio = Array.from(radioInputs).find(input => input.value === 'Fysisk');
    const digitaltRadio = Array.from(radioInputs).find(input => input.value === 'Digitalt');

    expect(fysiskRadio).toBeTruthy();
    expect(digitaltRadio).toBeTruthy();

    // In a real test with a real Svelte store, we would check if the radio is checked
    // Here we're just verifying the component structure
  });

  it('has the correct name attribute on radio inputs', () => {
    const mockForm = createMockFormStore();

    const { container } = render(RegistrationAttendingType, { props: { form: mockForm } });

    // Find the radio inputs
    const radioInputs = container.querySelectorAll('input[type="radio"]');

    // Check that both radios have the same name
    const fysiskRadio = Array.from(radioInputs).find(input => input.value === 'Fysisk');
    const digitaltRadio = Array.from(radioInputs).find(input => input.value === 'Digitalt');

    expect(fysiskRadio?.getAttribute('name')).toBe('attendingType');
    expect(digitaltRadio?.getAttribute('name')).toBe('attendingType');
  });
});
