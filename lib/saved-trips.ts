"use client";

export const SAVED_TRIPS_STORAGE_KEY = "trail-planner:saved-trip-ids";
const SAVED_TRIPS_CHANGED_EVENT = "trail-planner:saved-trips-changed";

export type SavedTripIds = Set<string>;

/**
 * Persistence boundary for saved trips.
 * Today this is localStorage-backed. When auth is ready, swap these methods
 * for API/database calls without changing component usage.
 */
export interface SavedTripsPersistence {
  loadSavedTripIds: () => SavedTripIds;
  persistSavedTripIds: (ids: SavedTripIds) => void;
}

function normalizeSavedTripIds(value: unknown): SavedTripIds {
  if (!Array.isArray(value)) {
    return new Set();
  }

  const ids = value.filter((id): id is string => typeof id === "string" && id.trim().length > 0);
  return new Set(ids);
}

function parseSavedTripIds(raw: string | null): SavedTripIds {
  if (!raw) {
    return new Set();
  }

  try {
    const parsed = JSON.parse(raw);
    return normalizeSavedTripIds(parsed);
  } catch {
    return new Set();
  }
}

function readSavedTripIdsFromStorage(): SavedTripIds {
  if (typeof window === "undefined") {
    return new Set();
  }

  return parseSavedTripIds(window.localStorage.getItem(SAVED_TRIPS_STORAGE_KEY));
}

function writeSavedTripIdsToStorage(ids: SavedTripIds): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SAVED_TRIPS_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  window.dispatchEvent(new Event(SAVED_TRIPS_CHANGED_EVENT));
}

export const savedTripsPersistence: SavedTripsPersistence = {
  loadSavedTripIds: readSavedTripIdsFromStorage,
  persistSavedTripIds: writeSavedTripIdsToStorage,
};

export function subscribeToSavedTripChanges(onChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === SAVED_TRIPS_STORAGE_KEY) {
      onChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SAVED_TRIPS_CHANGED_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SAVED_TRIPS_CHANGED_EVENT, onChange);
  };
}
