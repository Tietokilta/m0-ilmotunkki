export const extractStatusFromError = (error: unknown): number | null =>
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  typeof error.status === "number"
    ? error.status
    : null;
