import {Action} from '@ngrx/store';
import {type} from '../util';
import {Combatant, CombatAttack, CombatEncounter} from './combat.model';
import {Entity} from '../entity/entity.model';
import {Item} from '../item';

export interface CombatVictorySummary {
  party: Entity[];
  enemies: Combatant[];
  levels: Entity[];
  items?: Item[];
  gold: number;
  exp: number;
}

export const CombatActionTypes = {
  ENCOUNTER: type('rpg/combat/fixed'),
  ENCOUNTER_READY: type('rpg/combat/fixed/ready'),
  ENCOUNTER_ERROR: type('rpg/combat/fixed/error'),
  ACTION_ATTACK: type('rpg/combat/attack')
};

//
// Fixed Encounter Actions
//

export class CombatEncounterAction implements Action {
  type = CombatActionTypes.ENCOUNTER;

  constructor(public payload: CombatEncounter) {
  }
}

export class CombatEncounterErrorAction implements Action {
  type = CombatActionTypes.ENCOUNTER_ERROR;

  constructor(public payload: CombatEncounter) {
  }
}

export class CombatEncounterReadyAction implements Action {
  type = CombatActionTypes.ENCOUNTER_READY;

  constructor(public payload: CombatEncounter) {
  }
}

//
// Attack Actions
//

export class CombatAttackAction implements Action {
  type = CombatActionTypes.ACTION_ATTACK;

  constructor(public payload: CombatAttack) {
  }
}

export class CombatVictoryAction implements Action {
  type = CombatActionTypes.ACTION_ATTACK;

  constructor(public payload: CombatVictorySummary) {
  }
}

export type CombatActions
  = CombatEncounterAction
  | CombatEncounterReadyAction
  | CombatAttackAction;
