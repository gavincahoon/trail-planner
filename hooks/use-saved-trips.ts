"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  SavedTripIds,
  savedTripsPersistence,
  subscribeToSavedTripChanges,
} from "@/lib/saved-trips";

type UseSavedTripsResult = {
  isReady: boolean;
  savedTripIds: SavedTripIds;
  isSaved: (tripId: string) => boolean;
  save: (tripId: string) => void;
  unsave: (tripId: string) => void;
  toggleSaved: (tripId: string) => void;
};

export function useSavedTrips(): UseSavedTripsResult {
  const savedIdsSnapshot = useSyncExternalStore(
    subscribeToSavedTripChanges,
    () => JSON.stringify(Array.from(savedTripsPersistence.loadSavedTripIds())),
    () => null
  );

  const isReady = savedIdsSnapshot !== null;
  const savedTripIds = useMemo<SavedTripIds>(() => {
    if (!savedIdsSnapshot) {
      return new Set();
    }

    try {
      const parsed = JSON.parse(savedIdsSnapshot);
      if (!Array.isArray(parsed)) {
        return new Set();
      }

      return new Set(parsed.filter((id): id is string => typeof id === "string"));
    } catch {
      return new Set();
    }
  }, [savedIdsSnapshot]);

  const updateSavedIds = useCallback((updater: (current: SavedTripIds) => SavedTripIds) => {
    const next = updater(savedTripsPersistence.loadSavedTripIds());
    savedTripsPersistence.persistSavedTripIds(next);
  }, []);

  const save = useCallback(
    (tripId: string) => {
      updateSavedIds((current) => {
        current.add(tripId);
        return current;
      });
    },
    [updateSavedIds]
  );

  const unsave = useCallback(
    (tripId: string) => {
      updateSavedIds((current) => {
        current.delete(tripId);
        return current;
      });
    },
    [updateSavedIds]
  );

  const toggleSaved = useCallback(
    (tripId: string) => {
      updateSavedIds((current) => {
        if (current.has(tripId)) {
          current.delete(tripId);
        } else {
          current.add(tripId);
        }

        return current;
      });
    },
    [updateSavedIds]
  );

  const isSaved = useCallback((tripId: string) => savedTripIds.has(tripId), [savedTripIds]);

  return useMemo(
    () => ({
      isReady,
      savedTripIds,
      isSaved,
      save,
      unsave,
      toggleSaved,
    }),
    [isReady, isSaved, save, savedTripIds, toggleSaved, unsave]
  );
}
