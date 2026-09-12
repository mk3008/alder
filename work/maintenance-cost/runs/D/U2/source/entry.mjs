import { createWorkflow } from './application.mjs';
import { createMemoryRepository } from './memory.mjs';

// Composition root creates one independent adapter per application instance.
export function createApp() {
  return createWorkflow(createMemoryRepository());
}
