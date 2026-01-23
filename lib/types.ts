export interface User {
  id: string;
  clerk_id: string;
  email: string;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  product_tier: 'starter' | 'pro' | 'complete';
  amount_cents: number;
  currency: string;
  gumroad_sale_id: string | null;
  purchased_at: string;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  currency: string;
  date_format: string;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  source: string;
  subscribed_at: string;
}

export interface NetWorthEntry {
  id: string;
  user_id: string;
  date: string;
  stocks: number;
  bonds: number;
  cash: number;
  real_estate: number;
  points_value: number;
  other_assets: number;
  total_assets: number;
  total_debts: number;
  net_worth: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NetWorthFormData {
  date: string;
  stocks: number;
  bonds: number;
  cash: number;
  real_estate: number;
  points_value: number;
  other_assets: number;
  total_debts: number;
  notes?: string;
}
