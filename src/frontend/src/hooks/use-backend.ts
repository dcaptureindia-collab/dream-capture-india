import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

/**
 * Returns the backend actor for direct calls.
 * Prefer using typed hooks from use-queries.ts for data fetching.
 */
export function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isLoading: isFetching };
}
