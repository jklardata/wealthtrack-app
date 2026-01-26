/**
 * Cost of Living (COL) Data for Retirement Calculator
 *
 * All indices are normalized to New York City = 100
 * Higher numbers indicate higher costs
 *
 * Data sources: Numbeo, Expatistan, and other COL databases
 * Data year: 2024-2025
 */

export interface CityData {
  city_id: string;
  city_name: string;
  country: string;
  base_index: number;        // Overall cost of living index
  housing_index: number;     // Rent/housing costs
  food_index: number;        // Groceries and dining
  transport_index: number;   // Transportation costs
  healthcare_index: number;  // Healthcare and insurance
  utilities_index: number;   // Utilities (electricity, water, internet)
  tax_index: number;         // Income tax burden (effective rate comparison)
  data_year: number;
  confidence: 'low' | 'medium' | 'high';
}

export const CITIES: CityData[] = [
  // United States Cities
  {
    city_id: 'nyc',
    city_name: 'New York City',
    country: 'United States',
    base_index: 100,
    housing_index: 100,
    food_index: 100,
    transport_index: 100,
    healthcare_index: 100,
    utilities_index: 100,
    tax_index: 100,
    data_year: 2025,
    confidence: 'high',
  },
  {
    city_id: 'sf',
    city_name: 'San Francisco',
    country: 'United States',
    base_index: 102,
    housing_index: 115,
    food_index: 98,
    transport_index: 95,
    healthcare_index: 105,
    utilities_index: 85,
    tax_index: 105,
    data_year: 2025,
    confidence: 'high',
  },
  {
    city_id: 'austin',
    city_name: 'Austin',
    country: 'United States',
    base_index: 75,
    housing_index: 70,
    food_index: 85,
    transport_index: 80,
    healthcare_index: 90,
    utilities_index: 90,
    tax_index: 85,
    data_year: 2025,
    confidence: 'high',
  },
  {
    city_id: 'miami',
    city_name: 'Miami',
    country: 'United States',
    base_index: 78,
    housing_index: 80,
    food_index: 88,
    transport_index: 85,
    healthcare_index: 95,
    utilities_index: 88,
    tax_index: 80,
    data_year: 2025,
    confidence: 'high',
  },
  {
    city_id: 'denver',
    city_name: 'Denver',
    country: 'United States',
    base_index: 73,
    housing_index: 72,
    food_index: 82,
    transport_index: 78,
    healthcare_index: 92,
    utilities_index: 75,
    tax_index: 88,
    data_year: 2025,
    confidence: 'high',
  },
  {
    city_id: 'chicago',
    city_name: 'Chicago',
    country: 'United States',
    base_index: 77,
    housing_index: 75,
    food_index: 85,
    transport_index: 88,
    healthcare_index: 95,
    utilities_index: 92,
    tax_index: 92,
    data_year: 2025,
    confidence: 'high',
  },
  // International Cities - High Cost
  {
    city_id: 'london',
    city_name: 'London',
    country: 'United Kingdom',
    base_index: 95,
    housing_index: 110,
    food_index: 90,
    transport_index: 105,
    healthcare_index: 60,  // NHS makes healthcare cheaper
    utilities_index: 105,
    tax_index: 95,
    data_year: 2025,
    confidence: 'high',
  },
  {
    city_id: 'zurich',
    city_name: 'Zurich',
    country: 'Switzerland',
    base_index: 125,
    housing_index: 140,
    food_index: 135,
    transport_index: 110,
    healthcare_index: 120,
    utilities_index: 100,
    tax_index: 75,
    data_year: 2025,
    confidence: 'high',
  },
  {
    city_id: 'singapore',
    city_name: 'Singapore',
    country: 'Singapore',
    base_index: 92,
    housing_index: 125,
    food_index: 75,
    transport_index: 70,
    healthcare_index: 65,
    utilities_index: 80,
    tax_index: 70,
    data_year: 2025,
    confidence: 'high',
  },
  // International Cities - Medium Cost
  {
    city_id: 'barcelona',
    city_name: 'Barcelona',
    country: 'Spain',
    base_index: 65,
    housing_index: 70,
    food_index: 68,
    transport_index: 60,
    healthcare_index: 50,
    utilities_index: 85,
    tax_index: 80,
    data_year: 2025,
    confidence: 'high',
  },
  {
    city_id: 'lisbon',
    city_name: 'Lisbon',
    country: 'Portugal',
    base_index: 58,
    housing_index: 62,
    food_index: 55,
    transport_index: 52,
    healthcare_index: 45,
    utilities_index: 78,
    tax_index: 75,
    data_year: 2025,
    confidence: 'high',
  },
  {
    city_id: 'tokyo',
    city_name: 'Tokyo',
    country: 'Japan',
    base_index: 85,
    housing_index: 90,
    food_index: 80,
    transport_index: 75,
    healthcare_index: 70,
    utilities_index: 88,
    tax_index: 85,
    data_year: 2025,
    confidence: 'high',
  },
  {
    city_id: 'dubai',
    city_name: 'Dubai',
    country: 'United Arab Emirates',
    base_index: 70,
    housing_index: 80,
    food_index: 75,
    transport_index: 65,
    healthcare_index: 85,
    utilities_index: 55,
    tax_index: 0,  // No income tax in UAE
    data_year: 2025,
    confidence: 'medium',
  },
  // International Cities - Low Cost
  {
    city_id: 'mexico-city',
    city_name: 'Mexico City',
    country: 'Mexico',
    base_index: 45,
    housing_index: 40,
    food_index: 42,
    transport_index: 35,
    healthcare_index: 38,
    utilities_index: 50,
    tax_index: 65,
    data_year: 2025,
    confidence: 'medium',
  },
  {
    city_id: 'bangkok',
    city_name: 'Bangkok',
    country: 'Thailand',
    base_index: 48,
    housing_index: 45,
    food_index: 35,
    transport_index: 40,
    healthcare_index: 42,
    utilities_index: 52,
    tax_index: 60,
    data_year: 2025,
    confidence: 'medium',
  },
  {
    city_id: 'buenos-aires',
    city_name: 'Buenos Aires',
    country: 'Argentina',
    base_index: 42,
    housing_index: 38,
    food_index: 40,
    transport_index: 35,
    healthcare_index: 45,
    utilities_index: 48,
    tax_index: 70,
    data_year: 2025,
    confidence: 'medium',
  },
  {
    city_id: 'bali',
    city_name: 'Bali (Ubud)',
    country: 'Indonesia',
    base_index: 40,
    housing_index: 35,
    food_index: 32,
    transport_index: 30,
    healthcare_index: 35,
    utilities_index: 45,
    tax_index: 55,
    data_year: 2025,
    confidence: 'medium',
  },
  {
    city_id: 'chiang-mai',
    city_name: 'Chiang Mai',
    country: 'Thailand',
    base_index: 38,
    housing_index: 32,
    food_index: 30,
    transport_index: 28,
    healthcare_index: 35,
    utilities_index: 42,
    tax_index: 58,
    data_year: 2025,
    confidence: 'medium',
  },
  {
    city_id: 'medellin',
    city_name: 'Medellín',
    country: 'Colombia',
    base_index: 43,
    housing_index: 40,
    food_index: 38,
    transport_index: 32,
    healthcare_index: 40,
    utilities_index: 48,
    tax_index: 62,
    data_year: 2025,
    confidence: 'medium',
  },
];

/**
 * Default spending category weights
 * These represent typical spending distribution in retirement
 * Users can adjust these based on their lifestyle
 */
export const DEFAULT_WEIGHTS = {
  housing: 0.35,    // Rent/mortgage, property taxes
  food: 0.15,       // Groceries and dining out
  transport: 0.10,  // Car, gas, public transport
  healthcare: 0.10, // Insurance, medical expenses
  utilities: 0.10,  // Electricity, water, internet, phone
  lifestyle: 0.20,  // Entertainment, travel, hobbies (uses base_index)
};

/**
 * Get city by ID
 */
export function getCityById(cityId: string): CityData | undefined {
  return CITIES.find(c => c.city_id === cityId);
}

/**
 * Get cities sorted by base cost of living
 */
export function getCitiesSortedByCost(ascending = true): CityData[] {
  return [...CITIES].sort((a, b) =>
    ascending ? a.base_index - b.base_index : b.base_index - a.base_index
  );
}

/**
 * Get cities by country
 */
export function getCitiesByCountry(country: string): CityData[] {
  return CITIES.filter(c => c.country === country);
}
