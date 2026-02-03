/**
 * Age Utilities for Projected Net Worth
 *
 * Handles conversion between display format ("35y 6mos") and storage format (total months)
 */

/**
 * Parse age string in format "35y 6mos" or "35y" or "6mos" to total months
 * @param ageString - Age string like "35y 6mos", "35y", or "6mos"
 * @returns Total months as integer
 * @throws Error if format is invalid
 */
export function parseAgeString(ageString: string): number {
  if (!ageString || typeof ageString !== 'string') {
    throw new Error('Invalid age string');
  }

  const trimmed = ageString.trim();

  // Try to parse as plain number (assume years)
  const plainNumber = Number(trimmed);
  if (!isNaN(plainNumber) && trimmed === String(plainNumber)) {
    return Math.floor(plainNumber * 12);
  }

  // Parse "35y 6mos" format
  const yearMatch = trimmed.match(/(\d+)y/);
  const monthMatch = trimmed.match(/(\d+)mos/);

  if (!yearMatch && !monthMatch) {
    throw new Error('Invalid age format. Use "35y 6mos", "35y", or "6mos"');
  }

  const years = yearMatch ? parseInt(yearMatch[1], 10) : 0;
  const months = monthMatch ? parseInt(monthMatch[1], 10) : 0;

  if (months >= 12) {
    throw new Error('Months must be less than 12');
  }

  return years * 12 + months;
}

/**
 * Format total months to age string "35y 6mos"
 * @param totalMonths - Total months as integer
 * @returns Formatted age string like "35y 6mos" or "35y" or "6mos"
 */
export function formatAgeMonths(totalMonths: number): string {
  if (typeof totalMonths !== 'number' || isNaN(totalMonths) || totalMonths < 0) {
    return '0y';
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0 && months === 0) {
    return '0y';
  }

  if (months === 0) {
    return `${years}y`;
  }

  if (years === 0) {
    return `${months}mos`;
  }

  return `${years}y ${months}mos`;
}

/**
 * Convert age months to decimal years (e.g., 426 months -> 35.5 years)
 * @param totalMonths - Total months as integer
 * @returns Age in years as decimal
 */
export function monthsToYears(totalMonths: number): number {
  return totalMonths / 12;
}

/**
 * Convert decimal years to months (e.g., 35.5 years -> 426 months)
 * @param years - Age in years as decimal
 * @returns Total months as integer
 */
export function yearsToMonths(years: number): number {
  return Math.floor(years * 12);
}

/**
 * Get current age in months from birth date
 * @param birthDate - Birth date as Date or date string
 * @returns Current age in months
 */
export function getCurrentAgeMonths(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const now = new Date();

  const yearsDiff = now.getFullYear() - birth.getFullYear();
  const monthsDiff = now.getMonth() - birth.getMonth();

  return yearsDiff * 12 + monthsDiff;
}

/**
 * Validate age is within reasonable bounds
 * @param ageMonths - Age in months
 * @returns True if valid, false otherwise
 */
export function isValidAge(ageMonths: number): boolean {
  return ageMonths >= 0 && ageMonths <= 1440; // 0 to 120 years
}
