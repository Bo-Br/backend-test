/**
 * Represents a dynamic status bar (e.g., HP, MP, Stamina)
 * used in the character's system interface.
 */
export interface StatusBar {
  id: string;
  name: string;
  color: string;
  value: number;
  max: number;
  /** Tracks how many times the bar was filled/overflown */
  repeatCount: number;
}

/** 
 * Defines whether a quest is part of the core progression (main) 
 * or an optional task (side).
 */
export type QuestType = 'main' | 'side';

/** 
 * A mission or objective that provides rewards upon completion.
 */
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  rewards: Reward[];
}

/** 
 * Links a reward amount to a specific status bar.
 * 'exp' is a special reserved ID for experience points.
 */
export interface Reward {
  statusBarId: string;
  amount: number;
}

/** 
 * A repeatable task (e.g., exercise, work) that yields specific rewards.
 */
export interface GrindTask {
  id: string;
  title: string;
  rewards: Reward[];
}

/** 
 * A negative condition or challenge that results in experience loss.
 */
export interface Problem {
  id: string;
  title: string;
  xpPenalty: number;
}

/** 
 * A character ability that can level up and track progress.
 */
export interface Skill {
  id: string;
  name: string;
  level: number;
  description: string;
}

/** 
 * Core state of the user's avatar.
 */
export interface Character {
  name: string;
  level: number;
  exp: number;
}

/** 
 * Classification for creating new entities via the UI modals.
 */
export type CreationType = 'side-quest' | 'grind-task' | 'problem' | 'main-quest' | 'skill';

/** 
 * A record of a completed action for the daily activity log.
 */
export interface LogEntry {
  id: string;
  type: CreationType;
  title: string;
  timestamp: number;
}
