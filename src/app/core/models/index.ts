// ─── User ───────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  uuid: string;
  language: string;
  plan: 'free' | 'pro';
}

// ─── Scenario ───────────────────────────────────────────────────────────────
export type ScenarioGoal = 'budget' | 'prestige' | 'job' | 'location';
export type ScenarioStatus = 'draft' | 'completed';

export interface Scenario {
  id: number;
  user_id: number;
  title: string;
  goal: ScenarioGoal;
  status: ScenarioStatus;
}

export interface CreateScenarioRequest {
  title: string;
  goal: ScenarioGoal;
}

export interface ScenarioStep {
  step_key: string;
  step_value: string;
}

export interface CompleteScenarioResponse {
  scenario_id: number;
  results_count: number;
  results: number[];
}

// ─── Search ──────────────────────────────────────────────────────────────────
export interface SearchResult {
  institution: string;
  region: string;
  specialty: string;
  language: string;
  price: number | null;
  plan_count: number;
}

export interface SearchParams {
  language?: string;
  specialty?: string;
  budget?: boolean;
  region_id?: number;
  district_id?: number;
  locality_id?: number;
  sort?: 'price' | 'plan_count' | 'institution';
  order?: 'asc' | 'desc';
  limit?: number;
}

// ─── Meta (Geography) ────────────────────────────────────────────────────────
export interface Region {
  id: number;
  name: string;
  type: string;
}

export interface District {
  id: number;
  name: string;
  type: string;
}

export interface Locality {
  id: number;
  name: string;
  type: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface AnalyticsOverview {
  total_searches: number;
  top_regions: { region_id: number; count: number }[];
  top_specialties: { specialty: string; count: number }[];
}

// ─── AI ──────────────────────────────────────────────────────────────────────
export interface ExplainRequest {
  results: SearchResult[];
  user_goal?: string;
}

export interface ExplainResponse {
  text: string;
}

export interface DialogRequest {
  session_id: string;
  answer?: Record<string, unknown>;
  results?: SearchResult[];
  reset?: boolean;
}

export interface DialogResponse {
  type: 'question' | 'final';
  text?: string;
  question?: string;
  options?: string[];
  key?: string;
  state?: {
    goal: string;
    priority: string;
  };
}
