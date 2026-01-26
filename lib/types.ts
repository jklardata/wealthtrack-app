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

export interface UserSettings {
  id: string;
  user_id: string;
  google_sheet_id: string | null;
  credit_cards_sheet_id: string | null;
  last_sync_at: string | null;
  credit_cards_last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SheetRow {
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

export interface CreditCardSheetRow {
  card_name: string;
  last_four: string;
  status: CreditCardStatus;
  signup_bonus: string;
  sub_requirement: number;
  current_spend: number;
  sub_deadline: string;
  got_bonus: boolean;
  annual_fee: number;
  signup_date: string;
  annual_fee_date: string;
  close_date: string;
  notes: string;
}

export type CreditCardStatus = 'active' | 'pending' | 'closed';

export interface CreditCard {
  id: string;
  user_id: string;
  card_name: string;
  last_four: string | null;
  status: CreditCardStatus;
  signup_bonus: string | null;
  sub_requirement: number | null;
  current_spend: number;
  sub_deadline: string | null;
  got_bonus: boolean;
  annual_fee: number;
  signup_date: string | null;
  annual_fee_date: string | null;
  close_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditCardFormData {
  card_name: string;
  last_four?: string;
  status: CreditCardStatus;
  signup_bonus?: string;
  sub_requirement?: number;
  current_spend?: number;
  sub_deadline?: string;
  got_bonus?: boolean;
  annual_fee?: number;
  signup_date?: string;
  annual_fee_date?: string;
  close_date?: string;
  notes?: string;
}
