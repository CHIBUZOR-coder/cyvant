export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  return /^[+\d\s\-()]{7,20}$/.test(phone.trim());
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  consent?: string;
  [key: string]: string | undefined;
}

export function validateContactFields(fields: {
  name: string;
  email: string;
  phone?: string;
  consent: boolean;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!fields.name.trim()) errors.name = "Name is required.";
  if (!fields.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (fields.phone !== undefined && fields.phone.trim() && !isValidPhone(fields.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!fields.consent) {
    errors.consent = "You must agree to the privacy notice to continue.";
  }

  return errors;
}
