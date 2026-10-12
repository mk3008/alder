import type {Relation} from './graph';

/** Display-only suppression. Keep original relation indexes for routing and labels. */
export function hiddenReadIndexes(relations: readonly Relation[], preferWrite: boolean): Set<number> {
  const hidden = new Set<number>();
  if (!preferWrite) return hidden;
  const writes = new Set(relations.filter(r => r.kind === 'output').map(r => JSON.stringify([r.to, r.from])));
  relations.forEach((r, index) => {
    if (r.kind === 'input' && writes.has(JSON.stringify([r.from, r.to]))) hidden.add(index);
  });
  return hidden;
}
