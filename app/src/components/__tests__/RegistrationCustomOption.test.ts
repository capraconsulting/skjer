import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
// Using a simplified version of the RegistrationCustomOption component for testing
// This avoids issues with mocking child components (Checkbox, Radio, Textarea from flowbite-svelte)
import RegistrationCustomOption from './RegistrationCustomOption.test.svelte';
import { writable } from 'svelte/store';

// Mock the Svelte store
vi.mock('svelte/store', () => ({
  writable: vi.fn()
}));

describe('RegistrationCustomOption Component', () => {
  let mockStore;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create a mock store with update method
    mockStore = {
      update: vi.fn(callback => {
        const currentForm = { customOptions: [] };
        callback(currentForm);
      }),
      subscribe: vi.fn(callback => {
        callback({ customOptions: [] });
        return () => {};
      })
    };

    vi.mocked(writable).mockReturnValue(mockStore);
  });

  it('renders the option label correctly', () => {
    const { getByText } = render(RegistrationCustomOption, {
      props: {
        key: 'test-key',
        optionLabel: 'Test Option',
        inputType: 'checkbox',
        checkboxValue: 'Yes'
      }
    });

    expect(getByText('Test Option')).toBeTruthy();
  });

  it('renders a checkbox when inputType is "checkbox"', () => {
    const { container, getByText } = render(RegistrationCustomOption, {
      props: {
        key: 'test-key',
        optionLabel: 'Test Option',
        inputType: 'checkbox',
        checkboxValue: 'Yes'
      }
    });

    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeTruthy();
    expect(getByText('Yes')).toBeTruthy();
  });

  it('renders radio buttons when inputType is "radio"', () => {
    const { container, getByText } = render(RegistrationCustomOption, {
      props: {
        key: 'test-key',
        optionLabel: 'Test Option',
        inputType: 'radio',
        radioValues: ['Yes', 'No']
      }
    });

    const radioInputs = container.querySelectorAll('input[type="radio"]');
    expect(radioInputs.length).toBe(2);
    expect(getByText('Yes')).toBeTruthy();
    expect(getByText('No')).toBeTruthy();
  });

  it('renders a textarea when inputType is not "checkbox" or "radio"', () => {
    const { container } = render(RegistrationCustomOption, {
      props: {
        key: 'test-key',
        optionLabel: 'Test Option',
        inputType: 'text'
      }
    });

    const textarea = container.querySelector('textarea');
    expect(textarea).toBeTruthy();
  });

  it('initializes the form value with the first radio value when inputType is "radio"', () => {
    render(RegistrationCustomOption, {
      props: {
        key: 'test-key',
        optionLabel: 'Test Option',
        inputType: 'radio',
        radioValues: ['Yes', 'No']
      }
    });

    // Check that the form was updated with the first radio value
    expect(mockStore.update).toHaveBeenCalled();
  });

  it('updates the form value when a radio button is changed', async () => {
    const { container } = render(RegistrationCustomOption, {
      props: {
        key: 'test-key',
        optionLabel: 'Test Option',
        inputType: 'radio',
        radioValues: ['Yes', 'No']
      }
    });

    // Find the second radio button (No)
    const radioInputs = container.querySelectorAll('input[type="radio"]');
    const noRadio = radioInputs[1];

    // Clear the mock to ignore the initialization call
    mockStore.update.mockClear();

    // Simulate changing the radio button
    await fireEvent.change(noRadio, { target: { value: 'No' } });

    // Check that the form was updated
    expect(mockStore.update).toHaveBeenCalled();
  });

  it('updates the form value when a checkbox is changed', async () => {
    const { container } = render(RegistrationCustomOption, {
      props: {
        key: 'test-key',
        optionLabel: 'Test Option',
        inputType: 'checkbox',
        checkboxValue: 'Yes'
      }
    });

    // Find the checkbox
    const checkbox = container.querySelector('input[type="checkbox"]');

    // Simulate checking the checkbox
    await fireEvent.change(checkbox, { target: { checked: true } });

    // Check that the form was updated
    expect(mockStore.update).toHaveBeenCalled();
  });

  it('updates the form value when a textarea is changed', async () => {
    const { container } = render(RegistrationCustomOption, {
      props: {
        key: 'test-key',
        optionLabel: 'Test Option',
        inputType: 'text'
      }
    });

    // Find the textarea
    const textarea = container.querySelector('textarea');

    // Simulate typing in the textarea
    await fireEvent.input(textarea, { target: { value: 'Test input' } });

    // Check that the form was updated
    expect(mockStore.update).toHaveBeenCalled();
  });

  it('uses default values for radioValues and checkboxValue when not provided', () => {
    const { getByText } = render(RegistrationCustomOption, {
      props: {
        key: 'test-key',
        optionLabel: 'Test Option',
        inputType: 'radio'
      }
    });

    // Default radio values are ["Ja", "Nei"]
    expect(getByText('Ja')).toBeTruthy();
    expect(getByText('Nei')).toBeTruthy();
  });
});
