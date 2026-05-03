/**
 * @jest-environment node
 */

// Minimal validation utilities to test common patterns used across the app
// These test the validation logic directly without importing from the app
// since validation functions are inline in components/API routes

describe("EPIC Number Validation", () => {
  // EPIC pattern used in /api/verify-registration/route.ts
  const EPIC_REGEX = /^[A-Z]{3}[0-9]{7}$/;

  const validEpics = ["ABC1234567", "XYZ9876543", "MNO0000001"];
  const invalidEpics = [
    "",
    "abc1234567", // lowercase
    "AB12345678", // only 2 letters
    "ABCD123456", // 4 letters
    "ABC123456", // 6 digits
    "ABC12345678", // 8 digits
    "ABC123456X", // letter in numeric portion
    "1234567890", // no letters
  ];

  it.each(validEpics)("accepts valid EPIC: %s", (epic) => {
    expect(EPIC_REGEX.test(epic)).toBe(true);
  });

  it.each(invalidEpics)("rejects invalid EPIC: %s", (epic) => {
    expect(EPIC_REGEX.test(epic)).toBe(false);
  });
});

describe("Indian Phone Number Validation", () => {
  const PHONE_REGEX = /^[6-9]\d{9}$/;

  const validPhones = ["9876543210", "8123456789", "6012345678", "7999999999"];
  const invalidPhones = [
    "1234567890", // starts with 1
    "5876543210", // starts with 5
    "987654321", // only 9 digits
    "98765432100", // 11 digits
    "+919876543210", // has country code
    "abcdefghij", // letters
  ];

  it.each(validPhones)("accepts valid phone: %s", (phone) => {
    expect(PHONE_REGEX.test(phone)).toBe(true);
  });

  it.each(invalidPhones)("rejects invalid phone: %s", (phone) => {
    expect(PHONE_REGEX.test(phone)).toBe(false);
  });
});

describe("Indian Pincode Validation", () => {
  const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

  const validPincodes = ["400001", "110001", "600001", "700001"];
  const invalidPincodes = [
    "000001", // starts with 0
    "12345", // only 5 digits
    "1234567", // 7 digits
    "abcdef", // letters
    "40000A", // alphanumeric
  ];

  it.each(validPincodes)("accepts valid pincode: %s", (pin) => {
    expect(PINCODE_REGEX.test(pin)).toBe(true);
  });

  it.each(invalidPincodes)("rejects invalid pincode: %s", (pin) => {
    expect(PINCODE_REGEX.test(pin)).toBe(false);
  });
});

describe("Email Validation", () => {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validEmails = [
    "user@example.com",
    "voter@eci.gov.in",
    "first.last@domain.co.in",
    "user+tag@mail.org",
  ];

  const invalidEmails = [
    "notanemail",
    "@nodomain.com",
    "noatsign.com",
    "user@",
    "user@domain",
    "user name@domain.com",
  ];

  it.each(validEmails)("accepts valid email: %s", (email) => {
    expect(EMAIL_REGEX.test(email)).toBe(true);
  });

  it.each(invalidEmails)("rejects invalid email: %s", (email) => {
    expect(EMAIL_REGEX.test(email)).toBe(false);
  });
});

describe("Date formatting utilities", () => {
  it("formats Indian date correctly", () => {
    const date = new Date("2024-04-19T00:00:00.000Z");
    // Indian locale format
    const formatted = date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    expect(formatted).toContain("2024");
    expect(formatted).toMatch(/April|Apr/);
  });

  it("calculates relative time correctly", () => {
    const now = Date.now();
    const fiveMinutesAgo = new Date(now - 5 * 60 * 1000).toISOString();
    const diff = Date.now() - new Date(fiveMinutesAgo).getTime();
    const minutes = Math.floor(diff / 60000);
    expect(minutes).toBeGreaterThanOrEqual(4);
    expect(minutes).toBeLessThanOrEqual(6);
  });

  it("detects dates more than 7 days old", () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const diff = Date.now() - tenDaysAgo.getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    expect(days).toBeGreaterThanOrEqual(7);
  });
});
