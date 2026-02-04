/**
 * Age Utilities for Projected Net Worth
 *
 * Handles conversion between display format ("35y") and storage format (years as integer)
 */

/**
 * Parse age string - just a plain number
 * @param ageString - Age string like "35"
 * @returns Age in years as integer
 * @throws Error if format is invalid
 */
export function parseAgeString(ageString: string): number {
  if (!ageString || typeof ageString !== 'string') {
    throw new Error('Invalid age string');
  }

  const trimmed = ageString.trim();

  // Parse as plain number
  const plainNumber = Number(trimmed);
  if (isNaN(plainNumber)) {
    throw new Error('Invalid age format. Enter a number like "35"');
  }

  return Math.floor(plainNumber);
}

/**
 * Format years to age string (plain number)
 * @param years - Age in years as integer
 * @returns Formatted age string like "35"
 */
export function formatAgeYears(years: number): string {
  if (typeof years !== 'number' || isNaN(years) || years < 0) {
    return '0';
  }

  return `${Math.floor(years)}`;
}

/**
 * Format total months to age string (for backwards compatibility)
 * @param totalMonths - Total months as integer
 * @returns Formatted age string like "35"
 */
export function formatAgeMonths(totalMonths: number): string {
  if (typeof totalMonths !== 'number' || isNaN(totalMonths) || totalMonths < 0) {
    return '0';
  }

  const years = Math.floor(totalMonths / 12);
  return `${years}`;
}

/**
 * Convert age months to decimal years (for backwards compatibility)
 * @param totalMonths - Total months as integer
 * @returns Age in years as integer
 */
export function monthsToYears(totalMonths: number): number {
  return Math.floor(totalMonths / 12);
}

/**
 * Convert decimal years to months (for backwards compatibility)
 * @param years - Age in years
 * @returns Total months as integer
 */
export function yearsToMonths(years: number): number {
  return Math.floor(years * 12);
}

/**
 * Get current age in years from birth date
 * @param birthDate - Birth date as Date or date string
 * @returns Current age in years
 */
export function getCurrentAgeYears(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const now = new Date();

  const yearsDiff = now.getFullYear() - birth.getFullYear();
  const monthsDiff = now.getMonth() - birth.getMonth();

  // Adjust if birthday hasn't occurred this year
  if (monthsDiff < 0 || (monthsDiff === 0 && now.getDate() < birth.getDate())) {
    return yearsDiff - 1;
  }

  return yearsDiff;
}

/**
 * Validate age is within reasonable bounds
 * @param age - Age in years
 * @returns True if valid, false otherwise
 */
export function isValidAge(age: number): boolean {
  return age >= 0 && age <= 120;
}
