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

// ─── Search Result (с score) ─────────────────────────────────────────────────
export interface SearchResult {
    institution: string;
    region: string;
    specialty: string;
    language: string;
    price: number | null;
    plan_count: number;
    score?: number; // 0–100, появляется в /scenarios/:id/results
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

// ─── Auth ─────────────────────────────────────────────────────────────────
export interface AuthUser {
    id: number;
    uuid: string;
    name: string | null;
    email: string | null;
    language: string;
    plan: 'free' | 'pro';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface AuthResponse {
    success: boolean;
    data?: TokenResponse;
    message?: string;
}

export interface MeResponse {
    success: boolean;
    data?: AuthUser;
}

// ─── Comparison (Pro) ─────────────────────────────────────────────────────
export interface ScenarioAxes extends Record<string, number> {
    budget: number;
    region: number;
    language: number;
    specialty: number;
}

export interface ScenarioTopSpecialty {
    specialty: string;
    institution: string;
    price: number | null;
    plan_count: number;
}

export interface ScenarioComparisonItem {
    id: number;
    title: string;
    goal: string;
    goal_label: string;
    total_results: number;
    free_count: number;
    avg_score: number;
    axes: ScenarioAxes;
    top_specialties: ScenarioTopSpecialty[];
    institutions: string[];
}

export interface ComparisonResult {
    scenarios: ScenarioComparisonItem[];
    common_institutions: string[];
    winner_id: number;
    winner_title: string;
}

export interface SelectOption {
    label: string;
    value: string;
}
export interface BudgetOption {
    label: string;
    value: 'all' | 'free' | 'paid';
}
