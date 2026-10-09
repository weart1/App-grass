import { Agentation } from 'agentation';

/**
 * Visual feedback toolbar for AI coding agents (https://agentation.com).
 * Dev-only: click elements in the web build to annotate them, then copy the
 * structured notes to the agent. Set EXPO_PUBLIC_AGENTATION_ENDPOINT
 * (e.g. http://localhost:4747) to sync annotations to `agentation-mcp`.
 */
export function AgentationHost() {
  if (!__DEV__) return null;
  return <Agentation appName="Leafy" endpoint={process.env.EXPO_PUBLIC_AGENTATION_ENDPOINT} />;
}
