import {createSelector} from 'reselect';
import {sliceEntityBeings, sliceEntityBeingIds, sliceEntityItems, sliceEntityItemIds} from './entity/entity.reducer';
import {
  sliceBattleCounter,
  sliceCombatZone,
  sliceMap,
  sliceShipPosition,
  slicePosition,
  sliceGold,
  slicePartyIds, sliceInventoryIds
} from './game-state/game-state.reducer';
import {
  sliceWeaponIds,
  sliceWeapons,
  sliceArmors,
  sliceArmorIds,
  sliceMagics,
  sliceMagicIds,
  sliceClasses,
  sliceClassesIds,
  sliceRandomEncounters,
  sliceRandomEncounterIds,
  sliceFixedEncounters,
  sliceFixedEncounterIds,
  sliceItems,
  sliceItemIds,
  sliceGameDataType, sliceEnemies, sliceEnemiesIds
} from './game-data/game-data.reducer';
import {
  sliceCombatEncounterEnemies, sliceCombatEncounterParty,
  sliceCombatLoading
} from './combat/combat.reducer';

/**
 * This file contains the application level data selectors that can be used with @ngrx/store to
 * select chunks of data from the store. There are two types of functions exported from this
 * file:
 *
 *  1. "slice" functions take in a state and return some subset of state from it.
 *  2. "get" functions are slice functions that have been composed together using {@see createSelector}
 *
 * It is preferred to use the "get" functions rather than using the "slice" functions directly. This
 * is because reselect will memoize calls to the combined selectors, which improves performance.
 *
 * @fileOverview
 */

//
// Combat
//

/**
 * Slice off the "combat" branch of the main application state.
 */
export const sliceCombatState = (state) => state.combat;

export const getCombatLoading = createSelector(sliceCombatState, sliceCombatLoading);
export const getCombatEncounterParty = createSelector(sliceCombatState, sliceCombatEncounterParty);
export const getCombatEncounterEnemies = createSelector(sliceCombatState, sliceCombatEncounterEnemies);

//
// Entity collections
//

/**
 * Slice off the "entities" branch of the main application state.
 */
export const sliceEntitiesState = (state) => state.entities;

/**
 * Given an entity "byIds" object, and its "allIds" array, return an array of the items
 * represented in the byIds dictionary. It's often easier to deal with array of items
 * than objects.
 */
export const entitiesToArray = (object: {[uniqueId: string]: any}, ids: string[]) => {
  return ids.map((id: string) => object[id]);
};

// Beings
export const getEntityBeingById = createSelector(sliceEntitiesState, sliceEntityBeings);
export const getEntityBeingIds = createSelector(sliceEntitiesState, sliceEntityBeingIds);

// Items
export const getEntityItemById = createSelector(sliceEntitiesState, sliceEntityItems);
export const getEntityItemIds = createSelector(sliceEntitiesState, sliceEntityItemIds);

//
// Game application state
//

/**
 * Slice off the "gameState" branch of the main application state.
 */
export const sliceGameState = (state) => state.gameState;

export const getGameInventoryIds = createSelector(sliceGameState, sliceInventoryIds);
export const getGamePartyIds = createSelector(sliceGameState, slicePartyIds);
export const getGamePartyGold = createSelector(sliceGameState, sliceGold);
export const getGamePartyPosition = createSelector(sliceGameState, slicePosition);
export const getGameShipPosition = createSelector(sliceGameState, sliceShipPosition);
export const getGameMap = createSelector(sliceGameState, sliceMap);
export const getGameCombatZone = createSelector(sliceGameState, sliceCombatZone);
export const getGameBattleCounter = createSelector(sliceGameState, sliceBattleCounter);

export const getGameParty = createSelector(getEntityBeingById, getGamePartyIds, (entities, ids) => {
  return ids.map((id) => entities[id]);
});

export const getGameInventory = createSelector(getEntityItemById, getGameInventoryIds, (entities, ids) => {
  return ids.map((id) => entities[id]);
});

//
// Game data
//

/**
 * Slice off the "gameData" branch of the main application state. This branch contains game data
 * such as available weapons, armor, items, fixed encounters, etc.
 */
export const sliceGameDataState = (state) => state.gameData;

export const getGameDataForType = (type: string) => {
  return createSelector(sliceGameDataState, sliceGameDataType(type));
};

export const getGameDataWeaponsById = createSelector(sliceGameDataState, sliceWeapons);
export const getGameDataWeaponIds = createSelector(sliceGameDataState, sliceWeaponIds);
/** Select an array of weapons */
export const getGameDataWeapons = createSelector(getGameDataWeaponsById, getGameDataWeaponIds, entitiesToArray);

export const getGameDataArmorsById = createSelector(sliceGameDataState, sliceArmors);
export const getGameDataArmorIds = createSelector(sliceGameDataState, sliceArmorIds);
/** Select an array of armors */
export const getGameDataArmors = createSelector(getGameDataArmorsById, getGameDataArmorIds, entitiesToArray);

export const getGameDataItemsById = createSelector(sliceGameDataState, sliceItems);
export const getGameDataItemIds = createSelector(sliceGameDataState, sliceItemIds);
/** Select an array of items */
export const getGameDataItems = createSelector(getGameDataItemsById, getGameDataItemIds, entitiesToArray);

export const getGameDataEnemiesById = createSelector(sliceGameDataState, sliceEnemies);
export const getGameDataEnemiesIds = createSelector(sliceGameDataState, sliceEnemiesIds);
/** Select an array of items */
export const getGameDataEnemies = createSelector(getGameDataEnemiesById, getGameDataEnemiesIds, entitiesToArray);

export const getGameDataMagicsById = createSelector(sliceGameDataState, sliceMagics);
export const getGameDataMagicIds = createSelector(sliceGameDataState, sliceMagicIds);
/** Select an array of magics */
export const getGameDataMagics = createSelector(getGameDataMagicsById, getGameDataMagicIds, entitiesToArray);

export const getGameDataClassesById = createSelector(sliceGameDataState, sliceClasses);
export const getGameDataClassesIds = createSelector(sliceGameDataState, sliceClassesIds);
/** Select an array of game character classes */
export const getGameDataClasses = createSelector(getGameDataClassesById, getGameDataClassesIds, entitiesToArray);

export const getGameDataRandomEncountersById = createSelector(sliceGameDataState, sliceRandomEncounters);
export const getGameDataRandomEncounterIds = createSelector(sliceGameDataState, sliceRandomEncounterIds);
/** Select an array of random combat encounters */
export const getGameDataRandomEncounters =
  createSelector(getGameDataRandomEncountersById, getGameDataRandomEncounterIds, entitiesToArray);

export const getGameDataFixedEncountersById = createSelector(sliceGameDataState, sliceFixedEncounters);
export const getGameDataFixedEncounterIds = createSelector(sliceGameDataState, sliceFixedEncounterIds);
/** Select an array of fixed combat encounters */
export const getGameDataFixedEncounters =
  createSelector(getGameDataFixedEncountersById, getGameDataFixedEncounterIds, entitiesToArray);
