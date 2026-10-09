/**
 * Agentation (https://agentation.com) annotates DOM elements, so it only runs
 * on web. Native builds resolve to this no-op; see AgentationHost.web.tsx.
 */
export function AgentationHost() {
  return null;
}
