// Small validation utilities for name fields
export const nameRegex = /^[\p{L}\s'\-]+$/u;

export function sanitizeName(value: string) {
  if (!value) return '';
  return value.replace(/[^\p{L}\s'\-]/gu, '');
}

export function validateName(value: string, required = false) {
  const v = (value || '').trim();
  if (required && v === '') {
    return { valid: false, message: 'This field is required.' };
  }
  if (v === '') return { valid: true, message: '' };
  if (!nameRegex.test(v)) {
    return {
      valid: false,
      message:
        'Only alphabetic characters, spaces, hyphens or apostrophes are allowed.',
    };
  }
  if (v.length > 80) return { valid: false, message: 'Name is too long.' };
  return { valid: true, message: '' };
}
