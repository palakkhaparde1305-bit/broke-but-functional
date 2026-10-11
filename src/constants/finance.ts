import { RiskTier } from '../types/finance';

/**
 * Core Financial Simulation Constants
 * Centralized for clean architecture and deterministic simulation rules.
 */

export const INITIAL_BUDGET = 10000;
export const TOTAL_SIMULATION_DAYS = 30;
export const EMERGENCY_SHOCK_AMOUNT = 800;

export const HEALTH_WEIGHTS = {
  LIQUIDITY_RUNWAY: 0.30,
  OBLIGATIONS_SHIELD: 0.25,
  SAVINGS_LOCKBOX: 0.20,
  BURN_DISCIPLINE: 0.15,
  SHOCK_RESILIENCE: 0.10,
} as const;

export const RISK_TIERS: Record<string, { label: RiskTier; color: string; bg: string }> = {
  SAFE: {
    label: 'SAFE',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.1)'
  },
  CAUTION: {
    label: 'CAUTION',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.1)'
  },
  DANGER: {
    label: 'DANGER',
    color: '#F97316',
    bg: 'rgba(249, 115, 22, 0.1)'
  },
  CRITICAL: {
    label: 'CRITICAL',
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.1)'
  }
} as const;

export const STORAGE_KEYS = {
  STATE: 'broke_but_functional_state_v2',
  SETTINGS: 'broke_but_functional_settings_v2'
} as const;
