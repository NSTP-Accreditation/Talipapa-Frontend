import { describe, it, expect } from 'vitest';
import { sanitizeName, validateName, validateAddress } from '../utils/validation';

describe('Validation Utilities', () => {
  describe('sanitizeName', () => {
    it('should remove invalid characters', () => {
      expect(sanitizeName('Juan123')).toBe('Juan');
    });

    it('should preserve valid characters', () => {
      expect(sanitizeName("O'Brien")).toBe("O'Brien");
    });
  });

  describe('validateName', () => {
    it('should validate correct names', () => {
      const result = validateName('Juan Dela Cruz', true);
      expect(result.valid).toBe(true);
    });

    it('should reject empty required fields', () => {
      const result = validateName('', true);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateAddress', () => {
    it('should validate proper addresses', () => {
      const result = validateAddress('123 Main Street, Quezon City');
      expect(result.valid).toBe(true);
    });

    it('should reject short addresses', () => {
      const result = validateAddress('abc');
      expect(result.valid).toBe(false);
    });
  });
});
