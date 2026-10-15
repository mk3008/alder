import { target } from '../validation.mjs';

export function detail(records, id) {
  return { ...target(records, id) };
}
