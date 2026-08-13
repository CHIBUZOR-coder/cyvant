import { isValidEmail, isValidPhone, validateContactFields } from "@/lib/validation";

describe("isValidEmail", () => {
  it("accepts valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("user+tag@domain.co.ng")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("@nodomain.com")).toBe(false);
    expect(isValidEmail("noatsign.com")).toBe(false);
  });
});

describe("isValidPhone", () => {
  it("accepts valid phone numbers", () => {
    expect(isValidPhone("+2348012345678")).toBe(true);
    expect(isValidPhone("08012345678")).toBe(true);
  });

  it("rejects too-short strings", () => {
    expect(isValidPhone("123")).toBe(false);
  });
});

describe("validateContactFields", () => {
  it("returns errors for all empty required fields", () => {
    const errors = validateContactFields({ name: "", email: "", consent: false });
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.consent).toBeDefined();
  });

  it("returns no errors for valid input", () => {
    const errors = validateContactFields({
      name: "Ada",
      email: "ada@example.com",
      consent: true,
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("returns error for invalid email format", () => {
    const errors = validateContactFields({
      name: "Ada",
      email: "not-an-email",
      consent: true,
    });
    expect(errors.email).toMatch(/valid email/i);
  });
});
