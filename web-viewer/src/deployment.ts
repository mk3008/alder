/** Runtime-only context: identical static files can be promoted without rebuilding. */
export function deploymentContext(pathname: string) {
  const match = pathname.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);
  if (!match) return {database: 'alder-web-viewer'};
  const [,pr,version] = match;
  return {database: `alder-web-viewer:preview:pr-${pr}:${version}`, pr, version};
}
